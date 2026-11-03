import React, { useEffect, useState } from 'react';
import { AssistantState } from '../types';

interface BotFaceProps {
  state: AssistantState;
  detectedMood?: 'happy' | 'thinking' | 'amazed' | 'chill' | 'empathic';
  audioLevel?: number; // Optional volume level 0 - 1
}

export const BotFace: React.FC<BotFaceProps> = ({ state, detectedMood = 'happy', audioLevel = 0 }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural blinking effect for active circular eyes
  useEffect(() => {
    if (state === 'idle') return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [state]);

  const isIdle = state === 'idle';
  const isSpeaking = state === 'speaking';
  const isThinking = state === 'thinking';
  const isListening = state === 'listening';
  const isMuted = state === 'muted';

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      {/* Outer Glow Halo */}
      <div
        className={`absolute inset-0 rounded-[38px] transition-all duration-700 pointer-events-none ${
          isIdle
            ? 'opacity-40 blur-2xl bg-cyan-600/30'
            : isSpeaking
            ? 'opacity-80 blur-3xl bg-cyan-400/40 animate-pulse'
            : isThinking
            ? 'opacity-70 blur-2xl bg-teal-500/35'
            : isMuted
            ? 'opacity-30 blur-xl bg-slate-600/30'
            : 'opacity-60 blur-2xl bg-cyan-500/35'
        }`}
      />

      {/* Main Bot Screen Frame */}
      <div
        className={`relative w-[310px] h-[260px] sm:w-[350px] sm:h-[285px] bg-[#070b12] rounded-[36px] border transition-all duration-500 flex flex-col items-center justify-center overflow-hidden ${
          isIdle
            ? 'border-cyan-500/40 bot-screen-glow shadow-[0_0_40px_rgba(6,214,235,0.35)]'
            : isSpeaking
            ? 'border-cyan-400 bot-screen-active-glow shadow-[0_0_65px_rgba(6,214,235,0.65)]'
            : isThinking
            ? 'border-teal-400/80 shadow-[0_0_45px_rgba(20,184,166,0.5)]'
            : isMuted
            ? 'border-slate-600/50 shadow-[0_0_20px_rgba(100,116,139,0.3)]'
            : 'border-cyan-400/80 shadow-[0_0_50px_rgba(6,214,235,0.55)]'
        }`}
      >
        {/* Subtle Screen Scanline Reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-black/[0.4] pointer-events-none rounded-[35px]" />
        
        {/* Subtle grid pattern overlay for high-tech monitor feel */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* EYES CONTAINER */}
        <div className="relative flex items-center justify-center gap-12 sm:gap-14 my-auto">
          {/* LEFT EYE */}
          <div className="relative flex items-center justify-center">
            {isIdle ? (
              // Idle sleeping eye: Glowing horizontal slit
              <div className="w-12 sm:w-14 h-1.5 sm:h-2 rounded-full bg-[#00e5db] shadow-[0_0_15px_#00e5db,0_0_30px_#00a8a0] transition-all duration-500" />
            ) : (
              // Active round eye: bright circular glowing orb
              <div
                className={`rounded-full bg-[#00d0c6] transition-all duration-300 relative flex items-center justify-center ${
                  isBlinking ? 'h-1 scale-y-10' : 'w-11 h-11 sm:w-13 sm:h-13'
                } ${
                  isSpeaking
                    ? 'shadow-[0_0_28px_#00fff5,0_0_55px_#00d0c6] scale-105'
                    : isThinking
                    ? 'shadow-[0_0_20px_#14b8a6,0_0_40px_#0d9488] opacity-90'
                    : isMuted
                    ? 'shadow-[0_0_12px_#64748b] bg-slate-400 opacity-60 scale-90'
                    : 'shadow-[0_0_25px_#00f0e6,0_0_45px_#00c4ba]'
                }`}
              >
                {/* Pupil highlight */}
                {!isBlinking && !isMuted && (
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-white/70 top-2 left-2 blur-[0.5px]" />
                )}
              </div>
            )}
          </div>

          {/* RIGHT EYE */}
          <div className="relative flex items-center justify-center">
            {isIdle ? (
              // Idle sleeping eye: Glowing horizontal slit
              <div className="w-12 sm:w-14 h-1.5 sm:h-2 rounded-full bg-[#00e5db] shadow-[0_0_15px_#00e5db,0_0_30px_#00a8a0] transition-all duration-500" />
            ) : (
              // Active round eye: bright circular glowing orb
              <div
                className={`rounded-full bg-[#00d0c6] transition-all duration-300 relative flex items-center justify-center ${
                  isBlinking ? 'h-1 scale-y-10' : 'w-11 h-11 sm:w-13 sm:h-13'
                } ${
                  isSpeaking
                    ? 'shadow-[0_0_28px_#00fff5,0_0_55px_#00d0c6] scale-105'
                    : isThinking
                    ? 'shadow-[0_0_20px_#14b8a6,0_0_40px_#0d9488] opacity-90'
                    : isMuted
                    ? 'shadow-[0_0_12px_#64748b] bg-slate-400 opacity-60 scale-90'
                    : 'shadow-[0_0_25px_#00f0e6,0_0_45px_#00c4ba]'
                }`}
              >
                {/* Pupil highlight */}
                {!isBlinking && !isMuted && (
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-white/70 top-2 left-2 blur-[0.5px]" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* MOUTH COMPONENT */}
        <div className="relative mb-8 sm:mb-10 flex items-center justify-center">
          {isSpeaking ? (
            // Animated expressive mouth while speaking
            <div className="mouth-speaking flex items-center justify-center">
              <div className="w-12 sm:w-14 h-3.5 sm:h-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 shadow-[0_0_15px_#f59e0b,0_0_28px_#d97706]" />
            </div>
          ) : isThinking ? (
            // Subtle wave/thinking mouth
            <div className="w-8 sm:w-10 h-1.5 rounded-full bg-amber-500/70 shadow-[0_0_10px_#f59e0b] animate-pulse" />
          ) : isMuted ? (
            // Calm line
            <div className="w-8 h-1 rounded-full bg-slate-600/70" />
          ) : (
            // Calm subtle amber line mouth matching user image
            <div className="w-10 sm:w-12 h-1.5 rounded-full bg-[#c98028] shadow-[0_0_10px_#c98028,0_0_18px_#b46f1e] transition-all duration-300" />
          )}
        </div>

        {/* Minimal status tag at bottom of screen */}
        <div className="absolute bottom-2.5 text-[11px] tracking-wider font-mono uppercase text-cyan-400/70 transition-opacity">
          {isIdle && 'Standby'}
          {isListening && '● Listening'}
          {isThinking && '✦ Thinking'}
          {isSpeaking && '▶ Speaking'}
          {isMuted && '✕ Muted'}
        </div>
      </div>
    </div>
  );
};
