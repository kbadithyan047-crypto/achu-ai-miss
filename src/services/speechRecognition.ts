/**
 * Bulletproof Browser Speech Recognition Manager
 * Fixes infinite on/off restart loops, cleans up stale handlers,
 * releases probe media streams, and ensures smooth speech-to-text.
 */

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export type SpeechCallback = (text: string) => void;
export type InterimCallback = (text: string) => void;
export type StatusCallback = (status: 'listening' | 'idle' | 'error') => void;

class SpeechRecognitionManager {
  private recognition: any = null;
  private isListeningInternal = false;
  private isMutedInternal = false;
  private isAssistantSpeaking = false;
  private isRunning = false;
  private restartTimeout: any = null;
  private silenceTimer: any = null;
  private silenceDelayMs = 1200; // ~1.2s silence detection
  private preferredLanguage = 'ml-IN'; // Default to Malayalam/Indian locale for best Kerala Malayalam & Manglish recognition
  private currentTranscript = '';

  private onQuestionCompleteCallback: SpeechCallback | null = null;
  private onInterimCallback: InterimCallback | null = null;
  private onStatusCallback: StatusCallback | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      (Boolean(window.SpeechRecognition) || Boolean(window.webkitSpeechRecognition))
    );
  }

  public setPreferredLanguage(lang: string) {
    if (this.preferredLanguage === lang) return;
    this.preferredLanguage = lang;
    if (this.recognition && this.isRunning) {
      // Safely restart with new language
      this.safeRestart();
    }
  }

  public getPreferredLanguage(): string {
    return this.preferredLanguage;
  }

  public setAssistantSpeaking(speaking: boolean) {
    this.isAssistantSpeaking = speaking;
    if (speaking) {
      this.clearSilenceTimer();
      this.currentTranscript = '';
      if (this.onInterimCallback) {
        this.onInterimCallback('');
      }
      // Pause recognition while speaking so assistant doesn't hear itself
      this.safeStop();
    } else {
      // Resume listening after assistant finishes speaking
      if (this.isListeningInternal && !this.isMutedInternal) {
        setTimeout(() => {
          this.safeStart();
        }, 400);
      }
    }
  }

  public setMuted(muted: boolean) {
    this.isMutedInternal = muted;
    if (muted) {
      this.clearSilenceTimer();
      this.currentTranscript = '';
      if (this.onInterimCallback) {
        this.onInterimCallback('');
      }
      this.safeStop();
    } else {
      if (this.isListeningInternal && !this.isAssistantSpeaking) {
        this.safeStart();
      }
    }
  }

  public get isMuted(): boolean {
    return this.isMutedInternal;
  }

  public get isListening(): boolean {
    return this.isListeningInternal && this.isRunning;
  }

  /**
   * Request microphone permission and immediately release tracks
   * so the Web Speech API can have exclusive access to the mic hardware.
   */
  public async requestMicrophonePermission(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone access not supported in this browser');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // CRITICAL: Stop and release probe tracks immediately!
      // Keeping mediaStream open causes hardware locks and rapid on/off flapping in Chrome!
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });

      return true;
    } catch (err: any) {
      console.error('Microphone permission request failed:', err);
      return false;
    }
  }

  public startListening(handlers: {
    onQuestionComplete: SpeechCallback;
    onInterim?: InterimCallback;
    onStatus?: StatusCallback;
    onError?: (err: string) => void;
  }): void {
    if (!this.isSupported()) {
      handlers.onError?.(
        'Speech recognition is not supported in this browser. Please open in Google Chrome or Microsoft Edge.'
      );
      return;
    }

    this.onQuestionCompleteCallback = handlers.onQuestionComplete;
    this.onInterimCallback = handlers.onInterim || null;
    this.onStatusCallback = handlers.onStatus || null;
    this.onErrorCallback = handlers.onError || null;

    this.isListeningInternal = true;
    this.isMutedInternal = false;
    this.isAssistantSpeaking = false;
    this.currentTranscript = '';

    this.safeStart();
  }

  private safeStart(): void {
    if (this.isRunning || !this.isListeningInternal || this.isMutedInternal || this.isAssistantSpeaking) {
      return;
    }

    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    // Destroy any old recognition instance and detach handlers to prevent ghost onend events
    this.cleanupOldRecognition();

    try {
      const rec = new SpeechRecognitionAPI();
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.lang = this.preferredLanguage;

      rec.onstart = () => {
        this.isRunning = true;
        this.onStatusCallback?.('listening');
      };

      rec.onresult = (event: any) => {
        if (this.isMutedInternal || this.isAssistantSpeaking) return;

        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const transcript = item[0]?.transcript || '';
          if (item.isFinal) {
            finalText += transcript + ' ';
          } else {
            interimText += transcript;
          }
        }

        const candidate = (finalText || interimText).trim();
        if (candidate) {
          this.currentTranscript = candidate;
          this.onInterimCallback?.(candidate);

          // Reset silence timer
          this.clearSilenceTimer();
          this.silenceTimer = setTimeout(() => {
            this.handleSilenceTimeout();
          }, this.silenceDelayMs);
        }
      };

      rec.onerror = (event: any) => {
        const errType = event.error;
        // Benign errors that naturally occur during normal pauses or aborts
        if (errType === 'no-speech' || errType === 'aborted') {
          return;
        }

        console.warn('Speech recognition warning:', errType);
        if (errType === 'not-allowed') {
          this.isListeningInternal = false;
          this.onErrorCallback?.(
            'Microphone access was denied. Please allow microphone in browser address bar.'
          );
        }
      };

      rec.onend = () => {
        this.isRunning = false;

        // Schedule restart only if still supposed to be listening and not muted/speaking
        if (this.isListeningInternal && !this.isMutedInternal && !this.isAssistantSpeaking) {
          if (this.restartTimeout) clearTimeout(this.restartTimeout);
          this.restartTimeout = setTimeout(() => {
            this.safeStart();
          }, 350);
        } else {
          this.onStatusCallback?.('idle');
        }
      };

      this.recognition = rec;
      rec.start();
    } catch (e: any) {
      console.warn('Speech recognition start failed:', e);
      this.isRunning = false;
    }
  }

  private safeStop(): void {
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }

    if (this.recognition) {
      try {
        // Prevent onend handler from triggering restart
        this.recognition.onend = null;
        this.recognition.abort();
      } catch {}
      this.recognition = null;
    }
    this.isRunning = false;
  }

  private safeRestart(): void {
    this.safeStop();
    if (this.isListeningInternal && !this.isMutedInternal && !this.isAssistantSpeaking) {
      setTimeout(() => {
        this.safeStart();
      }, 250);
    }
  }

  private cleanupOldRecognition(): void {
    if (this.recognition) {
      try {
        this.recognition.onstart = null;
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.abort();
      } catch {}
      this.recognition = null;
    }
  }

  private handleSilenceTimeout(): void {
    this.clearSilenceTimer();

    const query = this.currentTranscript.trim();
    if (query.length >= 2 && !this.isAssistantSpeaking && !this.isMutedInternal) {
      this.currentTranscript = '';
      this.onInterimCallback?.('');
      this.onQuestionCompleteCallback?.(query);
    }
  }

  private clearSilenceTimer(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  public stopListening(): void {
    this.isListeningInternal = false;
    this.clearSilenceTimer();
    this.currentTranscript = '';
    this.safeStop();
    this.onStatusCallback?.('idle');
  }
}

export const speechRecognitionManager = new SpeechRecognitionManager();
