import React, { useState, useRef, useEffect } from 'react';
import { MessageItem, AppLanguage, AIProvider } from '../types';
import { Send, Volume2, Copy, Check, Trash2, Sparkles, User, CornerDownLeft } from 'lucide-react';
import { ttsService } from '../services/speechSynthesis';

interface ChatViewProps {
  messages: MessageItem[];
  isProcessing: boolean;
  language: AppLanguage;
  aiProvider: AIProvider;
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
  onTriggerVoice?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  isProcessing,
  language,
  aiProvider,
  onSendMessage,
  onClearHistory,
  onTriggerVoice,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isProcessing) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string, lang = 'ml') => {
    if (speakingId === id) {
      ttsService.stop();
      setSpeakingId(null);
      return;
    }
    ttsService.stop();
    setSpeakingId(id);
    ttsService.speak(text, lang, {
      onEnd: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    });
  };

  const quickPrompts = [
    { label: language === 'ml' ? 'ആരാണ് അച്ചൂസ് എഐ?' : 'Who made Achu AI?', query: 'നിന്നെ ആരാണ് ഉണ്ടാക്കിയത്? അച്ചൂസ് എഐയെക്കുറിച്ച് പറയൂ' },
    { label: language === 'ml' ? 'ഡൈമൻഷൻ ഓഫ് ഫോഴ്സ്' : 'Dimension of Force', query: 'What is the dimensional formula of Force and how is it derived?' },
    { label: language === 'ml' ? 'ന്യൂട്ടന്റെ ഒന്നാം നിയമം' : "Newton's 1st Law", query: 'എന്താണ് ന്യൂട്ടന്റെ ഒന്നാം ചലന നിയമം? ലളിതമായി പറയൂ' },
    { label: language === 'ml' ? 'ഒരു നല്ല തമാശ' : 'Tell a Joke', query: 'മലയാളത്തിൽ ഒരു കൊച്ചു തമാശ പറയൂ' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[75vh] sm:h-[78vh] rounded-3xl bg-[#042424]/80 border border-teal-500/30 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Chat Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800/80 bg-[#021818]/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Achu AI Conversation</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800 font-mono capitalize">
                {aiProvider}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {language === 'ml' ? 'സംശയങ്ങളും ചോദ്യങ്ങളും ചോദിക്കാം' : 'Ask any questions or study topics'}
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearHistory}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-900 transition cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.2)]">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                {language === 'ml' ? 'നമസ്കാരം! ഞാൻ അച്ചൂസ് എഐ' : 'Hello! I am Achu AI'}
              </h4>
              <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                {language === 'ml'
                  ? 'ആദിത്യൻ നിർമ്മിച്ച അച്ചൂസ് എഐയിലേക്ക് സ്വാഗതം. ഫിസിക്സ്, സയൻസ്, കണക്ക്, അല്ലെങ്കിൽ എന്തും എന്നോട് ചോദിക്കാം.'
                  : 'Welcome to Achu AI, created by Adithyan with Love and Peace. Ask any physics, science, math, or conversational question.'}
              </p>
            </div>

            {/* Quick Prompt Starters */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-md pt-2">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(qp.query)}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#021818] hover:bg-teal-950/60 border border-slate-800 hover:border-teal-500/40 text-slate-300 hover:text-teal-200 transition shadow-sm cursor-pointer"
                >
                  ✦ {qp.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="space-y-3 animate-fade-in">
              {/* User Question Bubble */}
              <div className="flex items-start justify-end gap-2.5">
                <div className="max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl rounded-tr-sm bg-teal-500 text-slate-950 font-medium text-xs sm:text-sm shadow-md">
                  <p className="whitespace-pre-wrap">{m.question}</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-teal-500/30 border border-teal-400/40 flex items-center justify-center text-teal-200 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              </div>

              {/* Achu AI Response Bubble */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_10px_rgba(45,212,191,0.4)]">
                  A
                </div>
                <div className="max-w-[88%] sm:max-w-[80%] p-4 rounded-2xl rounded-tl-sm bg-[#021b1b] border border-teal-500/25 text-slate-100 text-xs sm:text-sm shadow-md space-y-2">
                  <p className="whitespace-pre-line leading-relaxed">{m.answer}</p>

                  {/* Actions: Copy, Speak, Language */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="font-mono text-teal-400/80">{m.languageName || 'Achu AI'}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSpeak(m.id, m.answer, m.detectedLanguage)}
                        className={`p-1.5 rounded-lg border transition ${
                          speakingId === m.id
                            ? 'bg-teal-500 text-slate-950 border-teal-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Read answer aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(m.id, m.answer)}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
                        title="Copy answer"
                      >
                        {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {isProcessing && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#021818] border border-teal-500/20 max-w-xs animate-pulse">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span className="text-xs text-teal-300 font-medium">
              {language === 'ml' ? 'അച്ചൂസ് ആലോചിക്കുന്നു...' : 'Achu AI is thinking...'}
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Message Input Bar */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#021415] border-t border-slate-800/80 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            language === 'ml'
              ? 'ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക (മലയാളം / English)...'
              : 'Ask Achu AI anything (Malayalam / English)...'
          }
          className="flex-1 bg-[#032020] border border-slate-700/80 focus:border-teal-400 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          className="p-3 rounded-2xl bg-teal-400 text-slate-950 font-bold hover:bg-teal-300 disabled:opacity-40 disabled:hover:bg-teal-400 transition shadow cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
