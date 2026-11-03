/**
 * Offline Lesson Audio Engine
 * Plays the 15-minute Physics lecture section-by-section or continuously.
 * Operates 100% offline via browser SpeechSynthesis with Malayalam & English support,
 * and seamlessly enhances with high-fidelity streaming when online.
 */

import { PHYSICS_SECTIONS } from '../data/physicsLesson';
import { AppLanguage } from '../types';

export type LessonAudioStatus = 'idle' | 'playing' | 'paused' | 'buffering';

export interface LessonAudioProgress {
  currentSectionIndex: number;
  sectionTitle: string;
  playbackRate: number;
  status: LessonAudioStatus;
  elapsedSeconds: number;
  totalDurationSeconds: number;
}

class OfflineLessonAudioService {
  private status: LessonAudioStatus = 'idle';
  private currentSectionIndex = 0;
  private playbackRate = 1.0;
  private language: AppLanguage = 'ml';
  private timerInterval: any = null;
  private elapsedSeconds = 0;
  private currentAudio: HTMLAudioElement | null = null;
  private onProgressListeners: Set<(progress: LessonAudioProgress) => void> = new Set();

  public subscribe(callback: (progress: LessonAudioProgress) => void): () => void {
    this.onProgressListeners.add(callback);
    callback(this.getProgress());
    return () => {
      this.onProgressListeners.delete(callback);
    };
  }

  private notify() {
    const p = this.getProgress();
    this.onProgressListeners.forEach((cb) => cb(p));
  }

  public getProgress(): LessonAudioProgress {
    const sec = PHYSICS_SECTIONS[this.currentSectionIndex] || PHYSICS_SECTIONS[0];
    return {
      currentSectionIndex: this.currentSectionIndex,
      sectionTitle: this.language === 'ml' ? sec.titleMl : sec.titleEn,
      playbackRate: this.playbackRate,
      status: this.status,
      elapsedSeconds: this.elapsedSeconds,
      totalDurationSeconds: 15 * 60, // 15 minutes
    };
  }

  public setLanguage(lang: AppLanguage) {
    if (this.language !== lang) {
      this.language = lang;
      if (this.status === 'playing') {
        // Restart current section in new language
        this.playSection(this.currentSectionIndex);
      } else {
        this.notify();
      }
    }
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.currentAudio) {
      this.currentAudio.playbackRate = rate;
    }
    this.notify();
  }

  public async playSection(index: number) {
    if (index < 0 || index >= PHYSICS_SECTIONS.length) return;
    this.stopInternal();

    this.currentSectionIndex = index;
    this.status = 'playing';
    this.startTimer();
    this.notify();

    const section = PHYSICS_SECTIONS[index];
    const textToSpeak = this.language === 'ml' ? section.audioNarrationMl : section.audioNarrationEn;

    // Try high-fidelity online stream first, with instant offline fallback
    if (navigator.onLine) {
      try {
        const streamUrl = `/api/tts-audio?text=${encodeURIComponent(textToSpeak)}&lang=${this.language}`;
        const audio = new Audio(streamUrl);
        this.currentAudio = audio;
        audio.playbackRate = this.playbackRate;

        audio.onended = () => {
          this.handleSectionEnded();
        };

        audio.onerror = () => {
          this.fallbackToOfflineSynthesis(textToSpeak);
        };

        await audio.play();
        return;
      } catch {
        // Fall through to offline synthesis
      }
    }

    // Offline mode: use native browser speech synthesis
    this.fallbackToOfflineSynthesis(textToSpeak);
  }

  private fallbackToOfflineSynthesis(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.status = 'idle';
      this.stopTimer();
      this.notify();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.playbackRate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const langCode = this.language === 'ml' ? 'ml-IN' : 'en-US';
    const targetVoice = voices.find((v) => v.lang.toLowerCase().includes(langCode.toLowerCase())) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(this.language)) ||
      voices[0];

    if (targetVoice) utterance.voice = targetVoice;
    utterance.lang = langCode;

    utterance.onend = () => {
      this.handleSectionEnded();
    };

    utterance.onerror = () => {
      this.status = 'idle';
      this.stopTimer();
      this.notify();
    };

    window.speechSynthesis.speak(utterance);
  }

  private handleSectionEnded() {
    if (this.currentSectionIndex < PHYSICS_SECTIONS.length - 1) {
      // Auto-advance to next section
      this.playSection(this.currentSectionIndex + 1);
    } else {
      // Completed entire 15-minute class
      this.status = 'idle';
      this.stopTimer();
      this.notify();
    }
  }

  public pause() {
    if (this.status === 'playing') {
      this.status = 'paused';
      if (this.currentAudio) {
        this.currentAudio.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      this.stopTimer();
      this.notify();
    }
  }

  public resume() {
    if (this.status === 'paused') {
      this.status = 'playing';
      if (this.currentAudio) {
        this.currentAudio.play().catch(() => {});
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      this.startTimer();
      this.notify();
    } else if (this.status === 'idle') {
      this.playSection(this.currentSectionIndex);
    }
  }

  public stop() {
    this.stopInternal();
    this.status = 'idle';
    this.stopTimer();
    this.notify();
  }

  public reset() {
    this.stop();
    this.currentSectionIndex = 0;
    this.elapsedSeconds = 0;
    this.notify();
  }

  private stopInternal() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.src = '';
      } catch {}
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  private startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds += 1;
      this.notify();
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}

export const offlineLessonAudio = new OfflineLessonAudioService();
