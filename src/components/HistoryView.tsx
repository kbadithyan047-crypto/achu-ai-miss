import React, { useState } from 'react';
import { MessageItem, AppLanguage } from '../types';
import { History, Search, Volume2, Copy, Check, Trash2, Clock, Sparkles } from 'lucide-react';
import { ttsService } from '../services/speechSynthesis';

interface HistoryViewProps {
  messages: MessageItem[];
  language: AppLanguage;
  onClearHistory: () => void;
  onDeleteMessage?: (id: string) => void;
  onSelectQuestion?: (question: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  messages,
  language,
  onClearHistory,
  onDeleteMessage,
  onSelectQuestion,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const filtered = messages.filter(
    (m) =>
      m.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-fade-in pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-[#042424]/90 border border-teal-500/30 text-white shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {language === 'ml' ? 'സംഭാഷണ ചരിത്രം' : 'Conversation History'}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              {messages.length} {language === 'ml' ? 'സംഭാഷണങ്ങൾ സേവ് ചെയ്തു' : 'saved entries'}
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-semibold self-start sm:self-auto cursor-pointer transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === 'ml' ? 'എല്ലാം മായ്ക്കുക' : 'Clear All'}</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      {messages.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              language === 'ml'
                ? 'ചോദ്യങ്ങളോ ഉത്തരങ്ങളോ തിരയുക...'
                : 'Search past questions or answers...'
            }
            className="w-full bg-[#021818] border border-slate-800 focus:border-teal-400 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none"
          />
        </div>
      )}

      {/* Message List */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#042424]/40 border border-teal-500/10 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 italic">
            {messages.length === 0
              ? language === 'ml'
                ? 'ഇതുവരെ സംഭാഷണങ്ങൾ ഒന്നും നടന്നിട്ടില്ല. അസിസ്റ്റന്റിൽ സംസാരിച്ചു തുടങ്ങൂ.'
                : 'No conversation history yet. Start speaking with Achu AI!'
              : language === 'ml'
              ? 'തിരഞ്ഞ വാക്ക് അടങ്ങിയ സംഭാഷണങ്ങൾ ഒന്നും കണ്ടെത്തിയില്ല.'
              : 'No matching entries found.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-[#042424]/80 border border-teal-500/25 text-slate-100 shadow-md space-y-2 hover:border-teal-400/40 transition"
            >
              {/* Question */}
              <div className="flex items-start justify-between gap-2">
                <div
                  onClick={() => onSelectQuestion?.(item.question)}
                  className="font-bold text-xs sm:text-sm text-teal-300 cursor-pointer hover:underline"
                >
                  Q: {item.question}
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-[10px] text-slate-500 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(item.timestamp)}</span>
                </div>
              </div>

              {/* Answer */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-[#021818]/60 p-3 rounded-2xl border border-slate-900">
                {item.answer}
              </p>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span className="font-mono text-teal-400/80">{item.languageName || 'Achu AI'}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeak(item.id, item.answer, item.detectedLanguage)}
                    className={`p-1.5 rounded-lg border transition ${
                      speakingId === item.id
                        ? 'bg-teal-500 text-slate-950 border-teal-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title="Speak answer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleCopy(item.id, `Q: ${item.question}\n\nA: ${item.answer}`)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
                    title="Copy to clipboard"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  {onDeleteMessage && (
                    <button
                      onClick={() => onDeleteMessage(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
