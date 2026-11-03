import React, { useState } from 'react';
import { UserSettings, AppLanguage, AIProvider, AppTheme } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import {
  Globe,
  Moon,
  Sun,
  Cpu,
  Volume2,
  Trash2,
  Sparkles,
  Info,
  Heart,
  Shield,
  HelpCircle,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onClearChatHistory: () => void;
  onClearLearningProgress: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onClearChatHistory,
  onClearLearningProgress,
}) => {
  const isOnline = useOnlineStatus();
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  const [showClearProgressConfirm, setShowClearProgressConfirm] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 2500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-fade-in pb-10">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-teal-400 text-slate-950 text-xs font-bold shadow-xl animate-bounce">
          {successToast}
        </div>
      )}

      {/* Brand Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#032626] via-[#053232] to-[#021f1f] border border-teal-500/30 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.3)]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Achu AI</h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-400 text-slate-950">
                Love and Peace
              </span>
            </div>
            <p className="text-xs text-teal-300 font-medium">
              {settings.language === 'ml' ? 'നിർമ്മിച്ചത്: ആദിത്യൻ' : 'Created by Adithyan'}
            </p>
          </div>
        </div>

        {/* Online / Offline badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#021818] border border-slate-800 text-xs font-mono">
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 font-semibold">Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Language Preference */}
      <div className="p-4 rounded-3xl bg-[#042424]/80 border border-teal-500/25 text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs sm:text-sm font-bold">
              {settings.language === 'ml' ? 'ആപ്പ് ഭാഷ (Language)' : 'App Language'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {settings.language === 'ml' ? 'മലയാളം & English' : 'Malayalam & English'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onUpdateSettings({ language: 'ml' });
              triggerToast('ഭാഷ മലയാളം ആക്കി');
            }}
            className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              settings.language === 'ml'
                ? 'bg-teal-500 text-slate-950 border-teal-300 shadow'
                : 'bg-[#021818] border-slate-800 text-slate-300 hover:border-teal-500/40'
            }`}
          >
            <span>മലയാളം (Malayalam)</span>
          </button>
          <button
            onClick={() => {
              onUpdateSettings({ language: 'en' });
              triggerToast('Language changed to English');
            }}
            className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              settings.language === 'en'
                ? 'bg-teal-500 text-slate-950 border-teal-300 shadow'
                : 'bg-[#021818] border-slate-800 text-slate-300 hover:border-teal-500/40'
            }`}
          >
            <span>English</span>
          </button>
        </div>
      </div>

      {/* Theme Preference */}
      <div className="p-4 rounded-3xl bg-[#042424]/80 border border-teal-500/25 text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs sm:text-sm font-bold">
              {settings.language === 'ml' ? 'തീം ക്രമീകരണം (Theme)' : 'Theme Selection'}
            </h3>
          </div>
          <span className="text-[11px] text-teal-300 font-mono">
            {settings.theme === 'dark' ? 'Dark Teal (Default)' : 'Light Theme'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdateSettings({ theme: 'dark' })}
            className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              settings.theme === 'dark'
                ? 'bg-teal-500 text-slate-950 border-teal-300 shadow'
                : 'bg-[#021818] border-slate-800 text-slate-300 hover:border-teal-500/40'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Dark Teal</span>
          </button>
          <button
            onClick={() => onUpdateSettings({ theme: 'light' })}
            className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              settings.theme === 'light'
                ? 'bg-teal-500 text-slate-950 border-teal-300 shadow'
                : 'bg-[#021818] border-slate-800 text-slate-300 hover:border-teal-500/40'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Light Theme</span>
          </button>
        </div>
      </div>

      {/* AI Provider Config */}
      <div className="p-4 rounded-3xl bg-[#042424]/80 border border-teal-500/25 text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs sm:text-sm font-bold">
              {settings.language === 'ml' ? 'എഐ പ്രൊവൈഡർ (AI Engine)' : 'AI Provider'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Secure Server Proxy</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['auto', 'gemini', 'openai'] as AIProvider[]).map((prov) => (
            <button
              key={prov}
              onClick={() => {
                onUpdateSettings({ aiProvider: prov });
                triggerToast(`Provider set to ${prov}`);
              }}
              className={`p-3 rounded-2xl border text-xs font-bold capitalize transition cursor-pointer ${
                settings.aiProvider === prov
                  ? 'bg-teal-500 text-slate-950 border-teal-300 shadow'
                  : 'bg-[#021818] border-slate-800 text-slate-300 hover:border-teal-500/40'
              }`}
            >
              {prov === 'auto' ? 'Auto (Recommended)' : prov}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {settings.language === 'ml'
            ? 'ഓട്ടോ മോഡ് പ്രൈമറിയായി ഗൂഗിൾ ജെമിനിയെയും ബാക്കപ്പായി ഓപ്പൺഎഐയെയും ഉപയോഗിക്കുന്നു. രഹസ്യ കോഡുകൾ സുരക്ഷിതമായി സെർവറിലാണ് സൂക്ഷിക്കുന്നത്.'
            : 'Auto mode utilizes Gemini with fallback support. API keys are safely maintained server-side and never exposed to the browser.'}
        </p>
      </div>

      {/* Voice & Speech Controls */}
      <div className="p-4 rounded-3xl bg-[#042424]/80 border border-teal-500/25 text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs sm:text-sm font-bold">
              {settings.language === 'ml' ? 'സംസാര വേഗത (Voice Speed)' : 'Speech Playback Speed'}
            </h3>
          </div>
          <span className="text-xs text-teal-300 font-mono font-bold">{settings.speechRate}x</span>
        </div>

        <div className="flex items-center gap-2">
          {[0.8, 1.0, 1.2, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => onUpdateSettings({ speechRate: rate })}
              className={`flex-1 py-2 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                settings.speechRate === rate
                  ? 'bg-teal-500 text-slate-950 border-teal-300 shadow'
                  : 'bg-[#021818] border-slate-800 text-slate-300 hover:border-teal-500/40'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Data Management & Privacy */}
      <div className="p-4 rounded-3xl bg-[#042424]/80 border border-teal-500/25 text-white space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-400" />
          <h3 className="text-xs sm:text-sm font-bold">
            {settings.language === 'ml' ? 'സ്വകാര്യതയും ഡാറ്റയും' : 'Data & Privacy'}
          </h3>
        </div>

        <div className="space-y-2">
          {/* Clear Chat History */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#021818] border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                {settings.language === 'ml' ? 'ചാറ്റ് ഹിസ്റ്ററി മായ്ക്കുക' : 'Clear Chat History'}
              </span>
              <span className="text-[10px] text-slate-400">
                {settings.language === 'ml' ? 'ലോക്കൽ ഫോൺ മെമ്മറിയിൽ നിന്ന് നീക്കും' : 'Deletes local message logs'}
              </span>
            </div>
            {showClearHistoryConfirm ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    onClearChatHistory();
                    setShowClearHistoryConfirm(false);
                    triggerToast('ചാറ്റ് ഹിസ്റ്ററി മായ്ച്ചു');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowClearHistoryConfirm(false)}
                  className="px-2 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearHistoryConfirm(true)}
                className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-xl transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Clear Learning Progress */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#021818] border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                {settings.language === 'ml' ? 'പഠന വിവരങ്ങളും നോട്ടുകളും മായ്ക്കുക' : 'Clear Learning Progress'}
              </span>
              <span className="text-[10px] text-slate-400">
                {settings.language === 'ml' ? 'ക്വിസ് സ്കോറുകളും ബുക്ക്മാർക്കുകളും റീസെറ്റ് ചെയ്യും' : 'Resets quiz scores & bookmarks'}
              </span>
            </div>
            {showClearProgressConfirm ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    onClearLearningProgress();
                    setShowClearProgressConfirm(false);
                    triggerToast('പഠന വിവരങ്ങൾ റീസെറ്റ് ചെയ്തു');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowClearProgressConfirm(false)}
                  className="px-2 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearProgressConfirm(true)}
                className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-xl transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* About Achu AI */}
      <div className="p-4 rounded-3xl bg-[#042424]/60 border border-teal-500/20 text-center space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-teal-300">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
          <span>Love and Peace — Achu AI</span>
        </div>
        <p className="text-xs text-slate-300">
          {settings.language === 'ml'
            ? 'ആദിത്യൻ നിർമ്മിച്ച സ്മാർട്ട് മൾട്ടി-ലിംഗ്വൽ എഐ അസിസ്റ്റന്റും ഫിസിക്സ് പഠന സഹായിയും.'
            : 'Crafted by Adithyan as a smart multilingual AI voice assistant & Class 11 physics companion.'}
        </p>
        <span className="text-[10px] font-mono text-slate-500 block">Version 2.0 · Progressive Web App</span>
      </div>
    </div>
  );
};
