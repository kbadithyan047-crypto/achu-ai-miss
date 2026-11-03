import React, { useState } from 'react';
import { MessageItem } from '../types';
import { Volume2, VolumeX, Copy, Check, RotateCcw } from 'lucide-react';

interface AnswerCardProps {
  message: MessageItem;
  isCurrentlySpeaking: boolean;
  onReplay: (message: MessageItem) => void;
  onStopSpeaking: () => void;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  message,
  isCurrentlySpeaking,
  onReplay,
  onStopSpeaking,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-300 border backdrop-blur-md mb-4 ${
        isCurrentlySpeaking
          ? 'bg-slate-900/90 border-cyan-400/80 shadow-[0_0_25px_rgba(6,214,235,0.25)] ring-1 ring-cyan-400/50'
          : 'bg-[#0a101d]/80 border-slate-800/80 hover:border-slate-700/80 shadow-lg'
      }`}
    >
      {/* Question section */}
      <div className="flex items-start justify-between gap-3 pb-3 mb-3 border-b border-slate-800/70">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-cyan-400">
            Q
          </div>
          <div>
            <p className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
              {message.question}
            </p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              {message.languageName && (
                <span className="text-cyan-400/90 font-medium">
                  {message.languageName}
                </span>
              )}
              <span>·</span>
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleCopy}
            title="Copy answer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {isCurrentlySpeaking ? (
            <button
              onClick={onStopSpeaking}
              title="Stop speaking"
              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
            >
              <VolumeX className="w-4 h-4 animate-pulse" />
            </button>
          ) : (
            <button
              onClick={() => onReplay(message)}
              title="Listen again"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Answer Body */}
      <div className="flex items-start gap-2.5">
        <div className="w-6 h-6 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-emerald-400">
          AI
        </div>
        <div className="flex-1">
          <p className="text-sm sm:text-[15px] leading-relaxed text-slate-200 font-normal whitespace-pre-wrap">
            {message.answer}
          </p>

          {/* Active Speaking Wave Indicator */}
          {isCurrentlySpeaking && (
            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-cyan-900/40">
              <div className="flex items-center gap-1">
                <span className="w-1 h-3.5 bg-cyan-400 rounded-full animate-pulse" />
                <span className="w-1 h-5 bg-cyan-300 rounded-full animate-pulse [animation-delay:150ms]" />
                <span className="w-1 h-2.5 bg-cyan-400 rounded-full animate-pulse [animation-delay:300ms]" />
                <span className="w-1 h-4 bg-teal-300 rounded-full animate-pulse [animation-delay:450ms]" />
              </div>
              <span className="text-xs font-medium text-cyan-300 tracking-wide">
                Speaking aloud now...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
