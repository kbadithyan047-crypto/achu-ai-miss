/**
 * Continuous Native Audio Capture and Voice Activity Detection (VAD)
 * Runs 100% locally using Web Audio API + MediaRecorder.
 * Works seamlessly in Chromium on Linux, Google Chrome, Firefox, Safari, and Mobile.
 */

export class AudioVoiceManager {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  private isListening = false;
  private isMuted = false;
  private isAssistantSpeaking = false;
  private isRecordingSnippet = false;

  private silenceTimeout: any = null;
  private silenceDurationMs = 1200; // ~1.2s silence detection
  private speechStartTimestamp = 0;
  private animationFrameId: number | null = null;

  private onAudioReadyCallback: ((base64: string, mimeType: string) => void) | null = null;
  private onVolumeChangeCallback: ((volume: number) => void) | null = null;
  private onSpeechStateChangeCallback: ((isSpeaking: boolean) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  public async start(handlers: {
    onAudioReady: (base64: string, mimeType: string) => void;
    onVolumeChange?: (volume: number) => void;
    onSpeechStateChange?: (isSpeaking: boolean) => void;
    onError?: (err: string) => void;
  }): Promise<boolean> {
    this.onAudioReadyCallback = handlers.onAudioReady;
    this.onVolumeChangeCallback = handlers.onVolumeChange || null;
    this.onSpeechStateChangeCallback = handlers.onSpeechStateChange || null;
    this.onErrorCallback = handlers.onError || null;

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone access is not supported in this browser.');
      }

      // Request stream once and hold open
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.mediaStream = stream;
      this.isListening = true;
      this.isMuted = false;
      this.isAssistantSpeaking = false;

      // Initialize Web Audio API Analyser
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.4;
      source.connect(this.analyser);

      // Start real-time volume analysis loop
      this.startVADLoop();

      return true;
    } catch (err: any) {
      console.error('Failed to start microphone stream:', err);
      this.onErrorCallback?.(err?.message || 'Microphone access failed');
      return false;
    }
  }

  public setAssistantSpeaking(speaking: boolean) {
    this.isAssistantSpeaking = speaking;
    if (speaking) {
      this.cancelCurrentRecording();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
    if (muted) {
      this.cancelCurrentRecording();
    }
  }

  public finishCurrentRecordingManually() {
    if (this.isRecordingSnippet && this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.clearSilenceTimer();
      this.mediaRecorder.stop();
    }
  }

  private startVADLoop() {
    if (!this.analyser) return;

    const buffer = new Uint8Array(this.analyser.frequencyBinCount);

    const checkVolume = () => {
      if (!this.isListening) return;

      if (!this.isMuted && !this.isAssistantSpeaking && this.analyser) {
        this.analyser.getByteFrequencyData(buffer);

        // Compute average volume level (0 - 100)
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          sum += buffer[i];
        }
        const avg = sum / buffer.length;
        const normalizedVolume = Math.min(100, Math.round((avg / 128) * 100));

        this.onVolumeChangeCallback?.(normalizedVolume);

        // Speech detection threshold (typical voice activity > 10)
        const isVoiceActive = normalizedVolume > 10;

        if (isVoiceActive) {
          this.handleVoiceDetected();
        } else if (this.isRecordingSnippet) {
          this.handleSilenceDuringRecording();
        }
      } else {
        this.onVolumeChangeCallback?.(0);
      }

      this.animationFrameId = requestAnimationFrame(checkVolume);
    };

    this.animationFrameId = requestAnimationFrame(checkVolume);
  }

  private handleVoiceDetected() {
    this.clearSilenceTimer();

    if (!this.isRecordingSnippet) {
      this.startMediaRecorder();
    }

    // Set silence timeout to trigger ~1.2s after user finishes speaking
    this.silenceTimeout = setTimeout(() => {
      this.finalizeRecording();
    }, this.silenceDurationMs);
  }

  private handleSilenceDuringRecording() {
    // Silence timer is already running; nothing to do
  }

  private startMediaRecorder() {
    if (!this.mediaStream) return;

    this.isRecordingSnippet = true;
    this.speechStartTimestamp = Date.now();
    this.audioChunks = [];
    this.onSpeechStateChangeCallback?.(true);

    try {
      // Pick best supported MIME type
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else {
          mimeType = '';
        }
      }

      const recorder = mimeType ? new MediaRecorder(this.mediaStream, { mimeType }) : new MediaRecorder(this.mediaStream);
      this.mediaRecorder = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const duration = Date.now() - this.speechStartTimestamp;
        this.isRecordingSnippet = false;
        this.onSpeechStateChangeCallback?.(false);

        // Discard very short accidental noises (< 400ms)
        if (duration < 400 || this.audioChunks.length === 0) {
          this.audioChunks = [];
          return;
        }

        const blobMime = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: blobMime });
        this.audioChunks = [];

        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (result) {
            const base64Audio = result.split(',')[1];
            if (base64Audio) {
              this.onAudioReadyCallback?.(base64Audio, blobMime);
            }
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      recorder.start(200); // 200ms time slices
    } catch (err) {
      console.warn('Failed to start MediaRecorder:', err);
      this.isRecordingSnippet = false;
      this.onSpeechStateChangeCallback?.(false);
    }
  }

  private finalizeRecording() {
    this.clearSilenceTimer();
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        console.warn('Error stopping MediaRecorder:', e);
      }
    }
  }

  private cancelCurrentRecording() {
    this.clearSilenceTimer();
    this.isRecordingSnippet = false;
    this.audioChunks = [];
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      try {
        this.mediaRecorder.onstop = null;
        this.mediaRecorder.stop();
      } catch {}
    }
    this.onSpeechStateChangeCallback?.(false);
  }

  private clearSilenceTimer() {
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }
  }

  public stop() {
    this.isListening = false;
    this.cancelCurrentRecording();

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      this.mediaStream = null;
    }

    this.onVolumeChangeCallback?.(0);
    this.onSpeechStateChangeCallback?.(false);
  }
}

export const audioVoiceManager = new AudioVoiceManager();
