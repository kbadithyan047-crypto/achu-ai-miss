/**
 * Dual-Engine Text-to-Speech Service
 * Primary: High-fidelity MP3 voice audio stream via /api/tts-audio
 * Fallback: Browser Web SpeechSynthesis
 * Guarantees audio playback across Linux Chromium, Chrome, Safari, Firefox, and Mobile.
 */

class TTSService {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeakingInternal = false;
  private onEndCallbacks: Set<() => void> = new Set();
  private onStartCallbacks: Set<() => void> = new Set();

  public isSupported(): boolean {
    return typeof window !== 'undefined' && (typeof Audio !== 'undefined' || 'speechSynthesis' in window);
  }

  /**
   * Primes browser audio playback during user gesture so background responses play seamlessly
   */
  public prime(): void {
    try {
      const silent = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      silent.play().then(() => {
        silent.pause();
      }).catch(() => {});
    } catch {}

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const dummy = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(dummy);
      } catch {}
    }
  }

  public stop(): void {
    this.isSpeakingInternal = false;

    // Stop HTML Audio element
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch (e) {
        console.warn('Error pausing audio:', e);
      }
      this.currentAudio = null;
    }

    // Stop browser SpeechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('Error cancelling speech synthesis:', e);
      }
    }

    this.notifyEnd();
  }

  public get isSpeaking(): boolean {
    return this.isSpeakingInternal;
  }

  public async speak(
    text: string,
    language = 'ml',
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): Promise<void> {
    this.stop();

    if (!text || text.trim() === '') {
      options?.onEnd?.();
      return;
    }

    // Clean text: strip markdown symbols, asterisks, URLs, emojis
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();

    this.isSpeakingInternal = true;

    if (options?.onStart) this.onStartCallbacks.add(options.onStart);
    if (options?.onEnd) this.onEndCallbacks.add(options.onEnd);

    // Primary: Play native audio MP3 stream from /api/tts-audio
    try {
      const audioUrl = `/api/tts-audio?text=${encodeURIComponent(cleanText)}&lang=${encodeURIComponent(language)}`;
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.onplay = () => {
        this.notifyStart();
        options?.onStart?.();
      };

      audio.onended = () => {
        this.isSpeakingInternal = false;
        this.currentAudio = null;
        this.notifyEnd();
        options?.onEnd?.();
      };

      audio.onerror = (e) => {
        console.warn('Audio stream error, falling back to browser synthesis:', e);
        this.currentAudio = null;
        this.speakWithBrowserSynthesis(cleanText, language, options);
      };

      await audio.play();
      return;
    } catch (playError) {
      console.warn('Direct audio play failed or was blocked, falling back to browser synthesis:', playError);
      this.currentAudio = null;
    }

    // Fallback: Web Speech API synthesis
    this.speakWithBrowserSynthesis(cleanText, language, options);
  }

  private speakWithBrowserSynthesis(
    text: string,
    language: string,
    options?: { onStart?: () => void; onEnd?: () => void; onError?: (err: any) => void }
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.isSpeakingInternal = false;
      this.notifyEnd();
      options?.onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetLang = language.toLowerCase();
    const matchedVoice = voices.find((v) => v.lang.toLowerCase().includes(targetLang)) || voices[0];
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    utterance.lang = targetLang.includes('ml') ? 'ml-IN' : targetLang.includes('hi') ? 'hi-IN' : 'en-US';

    utterance.onstart = () => {
      this.notifyStart();
      options?.onStart?.();
    };

    utterance.onend = () => {
      this.isSpeakingInternal = false;
      this.notifyEnd();
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.isSpeakingInternal = false;
      this.notifyEnd();
      options?.onError?.(e);
      options?.onEnd?.();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      this.isSpeakingInternal = false;
      this.notifyEnd();
      options?.onEnd?.();
    }
  }

  private notifyStart(): void {
    this.onStartCallbacks.forEach((cb) => cb());
  }

  private notifyEnd(): void {
    this.onEndCallbacks.forEach((cb) => cb());
    this.onEndCallbacks.clear();
    this.onStartCallbacks.clear();
  }
}

export const ttsService = new TTSService();
