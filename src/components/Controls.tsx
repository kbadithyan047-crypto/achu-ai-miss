import React, { useState } from 'react';
import { Mic, MicOff, PhoneOff, Power, Send, MessageSquare, ArrowRight, Radio } from 'lucide-react';
import { AssistantState } from '../types';

interface ControlsProps {
  state: AssistantState;
  isMuted: boolean;
  selectedLanguage: string;
  onStartLive: () => void;
  onToggleMute: () => void;
  onEndCall: () => void;
  onLanguageChange: (lang: string) => void;
  onSubmitTextQuestion: (question: string) => void;
  interimTranscript?: string;
  onImmediateSubmitInterim?: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  state,
  isMuted,
  selectedLanguage,
  onStartLive,
  onToggleMute,
  onEndCall,
  onLanguageChange,
  onSubmitTextQuestion,
  interimTranscript,
  onImmediateSubmitInterim,
}) => {
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  const isIdle = state === 'idle';

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      onSubmitTextQuestion(textInput.trim());
      setTextInput('');
      setShowTextInput(false);
    }
  };

  const sampleSuggestions = [
    { label: 'ന്യൂട്ടന്റെ നിയമം (Malayalam)', query: 'എന്താണ് ന്യൂട്ടന്റെ ഒന്നാം ചലന നിയമം?' },
    { label: 'ഒരു തമാശ പറയൂ', query: 'ഒരു കൊച്ചു തമാശ പറയൂ' },
    { label: 'Newton\'s First Law', query: "What is Newton's first law of motion?" },
    { label: 'സുഖമാണോ? ', query: 'Enthokkeyundu vishesham? Sugamaano?' },
  ];

  const languageOptions = [
    { id: 'ml-IN', label: 'മലയാളം' },
    { id: 'en-US', label: 'English' },
  ];

  if (isIdle) {
    return (
      <div className="w-full flex flex-col items-center gap-5 mt-4 pb-8">
        {/* Language selector before starting */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
          {languageOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onLanguageChange(opt.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                selectedLanguage === opt.id
                  ? 'bg-cyan-400 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sample Prompt Starters */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg px-4">
          {sampleSuggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                onStartLive();
                setTimeout(() => onSubmitTextQuestion(s.query), 600);
              }}
              className="text-xs px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all shadow-sm cursor-pointer"
            >
              ✦ {s.label}
            </button>
          ))}
        </div>

        {/* Start Live Glow Pill Button (Matches Screenshot 1) */}
        <button
          onClick={onStartLive}
          className="group relative flex items-center justify-center gap-3.5 px-10 py-4 rounded-full bg-[#00ffff] text-black font-extrabold text-lg sm:text-xl cyan-btn-glow hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer"
        >
          {/* Glowing Power Icon */}
          <div className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center">
            <Power className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>Start Live</span>
        </button>

        <p className="text-xs text-slate-400 text-center max-w-xs leading-relaxed">
          സ്റ്റാർട്ട് അമർത്തി സംസാരിക്കൂ. നിങ്ങൾ ചോദിക്കുന്ന ചോദ്യം കേട്ട് ഉടൻതന്നെ ഉത്തരം തിരിച്ചു സംസാരിക്കും ACHU .
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-3 pt-3 pb-6 border-t border-slate-800/80 bg-[#060c18]/95 backdrop-blur-md">
      {/* Active Language Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
        <span className="text-[11px] text-slate-400 px-2 font-medium hidden sm:inline">സംഭാഷണ ഭാഷ:</span>
        {languageOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onLanguageChange(opt.id)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              selectedLanguage === opt.id
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Real-Time Speech Capture Bubble */}
      {interimTranscript ? (
        <div className="max-w-lg w-full px-4 text-center animate-fade-in">
          <div className="inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 text-xs sm:text-sm text-cyan-100 shadow-[0_0_20px_rgba(6,214,235,0.2)] w-full sm:w-auto">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
              <span className="font-semibold text-cyan-300 shrink-0">കേൾക്കുന്നു:</span>
              <span className="truncate italic font-medium">"{interimTranscript}"</span>
            </div>
            {onImmediateSubmitInterim && (
              <button
                onClick={onImmediateSubmitInterim}
                className="shrink-0 flex items-center gap-1 px-3 py-1 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition-all shadow cursor-pointer"
                title="ഉടൻ ഉത്തരം ചോദിക്കൂ"
              >
                <span>ചോദിക്കൂ</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      ) : (
        state === 'listening' && !isMuted && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800/40">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-300" />
            <span>മൈക്ക് ഓൺ ആണ് · ചോദ്യം വ്യക്തമായി സംസാരിക്കൂ...</span>
          </div>
        )
      )}

      {/* Optional Text fallback drawer */}
      {showTextInput && (
        <form
          onSubmit={handleTextSubmit}
          className="w-full max-w-md px-4 flex items-center gap-2 transition-all"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യാം..."
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Main Conversation Control Bar (Matches Screenshot 2) */}
      <div className="flex items-center justify-center gap-6 sm:gap-7 mt-1">
        {/* Toggle text input mode */}
        <button
          onClick={() => setShowTextInput(!showTextInput)}
          title="Type question instead"
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-all cursor-pointer"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* Microphone Mute / Unmute Button */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'മൈക്ക് അൺമ്യൂട്ട് ചെയ്യുക' : 'മൈക്ക് മ്യൂട്ട് ചെയ്യുക'}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
            isMuted
              ? 'bg-amber-950/90 border-2 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-[#131b2e] border border-slate-700/80 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-400'
          }`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* End Call Button (Matches red button in Screenshot 2) */}
        <button
          onClick={onEndCall}
          title="സംഭാഷണം അവസാനിപ്പിക്കുക (End Call)"
          className="w-14 h-14 rounded-full bg-[#ef4444] hover:bg-[#dc2626] active:scale-95 text-white flex items-center justify-center transition-all duration-300 shadow-[0_0_25px_rgba(239,68,68,0.6)] cursor-pointer"
        >
          <PhoneOff className="w-6 h-6 stroke-[2.2]" />
        </button>
      </div>

      {/* Clear Status Label */}
      <div className="text-[12px] font-medium tracking-wide flex items-center gap-2 text-slate-400">
        {state === 'listening' && !isMuted && (
          <>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300">നിങ്ങൾ പറയുന്നത് ശ്രദ്ധിക്കുന്നു (Listening)...</span>
          </>
        )}
        {state === 'thinking' && (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-spin" />
            <span className="text-amber-300">ഉത്തരം കണ്ടെത്തുന്നു (Thinking)...</span>
          </>
        )}
        {state === 'speaking' && (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
            <span className="text-emerald-300">ഉത്തരം പറയുന്നു (Speaking)...</span>
          </>
        )}
        {isMuted && (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-amber-400">മൈക്ക് മ്യൂട്ട് ആണ് (Muted)</span>
          </>
        )}
      </div>
    </div>
  );
};
