import React from 'react';
import { AssistantState } from '../types';

interface AchuOrbProps {
  state: AssistantState;
  audioLevel?: number; // 0 to 1
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const AchuOrb: React.FC<AchuOrbProps> = ({
  state,
  audioLevel = 0,
  onClick,
  size = 'md',
}) => {
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';
  const isSpeaking = state === 'speaking';
  const isMuted = state === 'muted';
  const isError = state === 'error';

  // Responsive diameter
  const dim = size === 'sm' ? 'w-24 h-24' : size === 'lg' ? 'w-64 h-64 sm:w-72 sm:h-72' : 'w-48 h-48 sm:w-56 sm:h-56';

  // Dynamic scale pulse based on real-time audio volume
  const scaleEffect = isListening
    ? 1 + audioLevel * 0.25
    : isSpeaking
    ? 1 + Math.sin(Date.now() / 150) * 0.08
    : 1;

  return (
    <div
      onClick={onClick}
      className={`relative ${dim} flex items-center justify-center cursor-pointer select-none group transition-transform duration-200`}
      style={{ transform: `scale(${scaleEffect})` }}
      title={state}
    >
      {/* Outer ambient glow field */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
          isSpeaking
            ? 'bg-teal-400/40 scale-125'
            : isListening
            ? 'bg-emerald-400/35 scale-120'
            : isThinking
            ? 'bg-amber-400/30 scale-115 animate-pulse'
            : isMuted
            ? 'bg-rose-500/20 scale-100'
            : 'bg-teal-500/20 scale-100 group-hover:bg-teal-400/30'
        }`}
      />

      {/* Outer energy orbit ring */}
      <div
        className={`absolute -inset-3 sm:-inset-4 rounded-full border border-dashed transition-all duration-1000 ${
          isThinking
            ? 'border-amber-400/60 animate-spin'
            : isSpeaking
            ? 'border-teal-300/60 animate-[spin_8s_linear_infinite]'
            : isListening
            ? 'border-emerald-400/60 animate-[spin_12s_linear_infinite]'
            : 'border-teal-500/25'
        }`}
      />

      {/* Secondary glowing ring */}
      <div
        className={`absolute -inset-1 rounded-full border transition-all duration-500 ${
          isSpeaking
            ? 'border-teal-300/80 shadow-[0_0_20px_rgba(45,212,191,0.5)]'
            : isListening
            ? 'border-emerald-400/80 shadow-[0_0_25px_rgba(52,211,153,0.5)]'
            : isThinking
            ? 'border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.4)]'
            : isMuted
            ? 'border-rose-500/40'
            : 'border-teal-500/40 group-hover:border-teal-400/60'
        }`}
      />

      {/* Main Core Orb Body */}
      <div
        className={`relative w-4/5 h-4/5 rounded-full flex flex-col items-center justify-center overflow-hidden transition-all duration-500 shadow-2xl ${
          isSpeaking
            ? 'bg-gradient-to-tr from-[#021f1f] via-[#083a3a] to-[#0df5c4]'
            : isListening
            ? 'bg-gradient-to-tr from-[#021d1b] via-[#09413c] to-[#34d399]'
            : isThinking
            ? 'bg-gradient-to-tr from-[#1b1907] via-[#3d330c] to-[#f59e0b]'
            : isMuted
            ? 'bg-gradient-to-tr from-[#1b0808] via-[#3b1212] to-[#f43f5e]'
            : 'bg-gradient-to-tr from-[#011415] via-[#042828] to-[#00bfa5] group-hover:scale-[1.02]'
        }`}
      >
        {/* Shimmer wave across surface */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/30 pointer-events-none" />

        {/* Center Graphic: A-letter futuristic emblem & sound pulses */}
        <div className="relative flex flex-col items-center justify-center">
          {isThinking ? (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-bounce" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.15s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.3s]" />
            </div>
          ) : isSpeaking ? (
            <div className="flex items-center gap-1 h-8">
              {[8, 18, 28, 20, 12].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}px` }}
                  className="w-1.5 rounded-full bg-teal-200 animate-pulse shadow-[0_0_8px_#2dd4bf]"
                />
              ))}
            </div>
          ) : isListening ? (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 h-7">
                {[6, 14, 24, 16, 8].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${Math.max(4, h * (audioLevel * 1.5 + 0.3))}px` }}
                    className="w-1.5 rounded-full bg-emerald-300 transition-all duration-75 shadow-[0_0_8px_#34d399]"
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-300 uppercase font-bold">
                Listening
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {/* Futuristic Achu AI Emblem */}
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="text-[11px] font-extrabold tracking-wider text-teal-200 mt-1 uppercase font-mono">
                ACHU
              </span>
            </div>
          )}
        </div>

        {/* Orbiting tiny spark dot */}
        <div
          className={`absolute w-2 h-2 rounded-full ${
            isSpeaking ? 'bg-teal-200 shadow-[0_0_10px_#fff]' : 'bg-teal-400'
          } animate-ping opacity-75`}
          style={{ top: '20%', right: '22%' }}
        />
      </div>

      {/* Status Badge below Orb */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-teal-500/30 text-[11px] font-medium text-teal-300 shadow-md backdrop-blur-sm">
          <span
            className={`w-2 h-2 rounded-full ${
              isSpeaking
                ? 'bg-teal-400 animate-pulse'
                : isListening
                ? 'bg-emerald-400 animate-ping'
                : isThinking
                ? 'bg-amber-400 animate-spin'
                : isMuted
                ? 'bg-rose-500'
                : isError
                ? 'bg-red-500'
                : 'bg-teal-500'
            }`}
          />
          <span className="capitalize font-mono">
            {isSpeaking
              ? 'Speaking answer'
              : isListening
              ? 'Hearing you...'
              : isThinking
              ? 'Thinking...'
              : isMuted
              ? 'Muted'
              : 'Tap to Talk'}
          </span>
        </div>
      </div>
    </div>
  );
};
