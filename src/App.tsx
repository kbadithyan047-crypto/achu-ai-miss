/**
 * Achu AI — Complete Premium Multilingual AI Assistant & Learning App
 * Brand: "Love and Peace" — Achu AI
 * Creator: Adithyan
 * Wake Phrase: "Hey Achu"
 */

import React, { useState, useEffect, useRef } from 'react';
import { AchuOrb } from './components/AchuOrb';
import { AnswerCard } from './components/AnswerCard';
import { Controls } from './components/Controls';
import { PermissionModal } from './components/PermissionModal';
import { ChatView } from './components/ChatView';
import { LearningDashboard } from './components/LearningDashboard';
import { PhysicsClassView } from './components/PhysicsClassView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

import { AssistantState, MessageItem, NavTab, UserSettings, AppLanguage, AIProvider, AppTheme } from './types';
import { audioVoiceManager } from './services/audioVoiceManager';
import { ttsService } from './services/speechSynthesis';
import { useOnlineStatus } from './hooks/useOnlineStatus';

import {
  Sparkles,
  Bot,
  MessageSquare,
  GraduationCap,
  History,
  Settings,
  BookOpen,
  Volume2,
  Trash2,
  Radio,
  Heart,
} from 'lucide-react';

const DEFAULT_SETTINGS: UserSettings = {
  language: 'ml',
  theme: 'dark',
  aiProvider: 'auto',
  speechRate: 1.0,
  wakePhraseEnabled: true,
  hapticFeedback: true,
  autoSpeak: true,
};

export default function App() {
  const isOnline = useOnlineStatus();

  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('assistant');
  const [openSpecificLessonIndex, setOpenSpecificLessonIndex] = useState<number | null>(null);

  // Settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('achu_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Assistant & Voice states
  const [state, setState] = useState<AssistantState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>(() => {
    try {
      const saved = localStorage.getItem('achu_chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [liveVolume, setLiveVolume] = useState(0);

  // Microphone Permission
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissionError, setPermissionError] = useState('');

  // Refs for tracking active session & prevent overlapping calls
  const isProcessingRef = useRef(false);
  const activeSessionRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('achu_chat_history', JSON.stringify(messages.slice(-30)));
    } catch {}
  }, [messages]);

  // Save settings
  const handleUpdateSettings = (updated: Partial<UserSettings>) => {
    const next = { ...settings, ...updated };
    setSettings(next);
    try {
      localStorage.setItem('achu_settings', JSON.stringify(next));
    } catch {}
  };

  // Auto-scroll to latest answer card
  useEffect(() => {
    if (messages.length > 0 && activeTab === 'assistant') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentlySpeakingId, activeTab]);

  // Process question through server API (supports Gemini / OpenAI / Auto)
  const handleProcessQuestion = async (questionText: string) => {
    const trimmed = (questionText || '').trim();
    if (!trimmed || isProcessingRef.current) return;
    isProcessingRef.current = true;

    setState('thinking');
    audioVoiceManager.setAssistantSpeaking(true);
    setInterimTranscript('');

    try {
      // Check offline mode
      if (!navigator.onLine) {
        throw new Error('You are currently offline. Physics lessons remain available.');
      }

      const historyPayload = messages.slice(-5).map((m) => ({
        role: 'user',
        text: m.question,
      })).concat(
        messages.slice(-5).map((m) => ({
          role: 'assistant',
          text: m.answer,
        }))
      );

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          conversationHistory: historyPayload,
          preferredProvider: settings.aiProvider,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Server error generating response');
      }

      const data = await response.json();
      const newId = `msg-${Date.now()}`;
      const answerText = data.answer || "I understood your question, but couldn't form an answer.";
      const detectedLang = data.detectedLanguage || (settings.language === 'ml' ? 'ml' : 'en');
      const langName = data.languageName || (settings.language === 'ml' ? 'Malayalam' : 'English');
      const mood = data.mood || 'happy';

      const newMessage: MessageItem = {
        id: newId,
        question: trimmed,
        answer: answerText,
        timestamp: Date.now(),
        detectedLanguage: detectedLang,
        languageName: langName,
        mood: mood,
        provider: data.provider,
        isCurrentlySpeaking: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setCurrentlySpeakingId(newId);
      setState('speaking');

      // Speak answer aloud
      if (settings.autoSpeak) {
        await ttsService.speak(answerText, detectedLang, {
          onStart: () => {
            setState('speaking');
            setCurrentlySpeakingId(newId);
          },
          onEnd: () => {
            setCurrentlySpeakingId(null);
            audioVoiceManager.setAssistantSpeaking(false);
            isProcessingRef.current = false;
            if (activeSessionRef.current) {
              setState(isMuted ? 'muted' : 'listening');
            } else {
              setState('idle');
            }
          },
          onError: () => {
            setCurrentlySpeakingId(null);
            audioVoiceManager.setAssistantSpeaking(false);
            isProcessingRef.current = false;
            if (activeSessionRef.current) {
              setState(isMuted ? 'muted' : 'listening');
            } else {
              setState('idle');
            }
          },
        });
      } else {
        setState(activeSessionRef.current ? (isMuted ? 'muted' : 'listening') : 'idle');
        setCurrentlySpeakingId(null);
        audioVoiceManager.setAssistantSpeaking(false);
        isProcessingRef.current = false;
      }
    } catch (err: any) {
      console.error('Error handling question:', err);
      const fallbackId = `err-${Date.now()}`;
      const isOfflineError = !navigator.onLine || err.message?.includes('offline');

      const fallbackMsg = isOfflineError
        ? settings.language === 'ml'
          ? 'ഇന്റർനെറ്റ് കണക്ഷൻ ലഭ്യമല്ല. എന്നാൽ യൂണിറ്റ്സ് ആൻഡ് മെഷർമെന്റ് ഫിസിക്സ് ക്ലാസ്സും ക്വിസ്സും നിങ്ങൾക്ക് ഓഫ്‌ലൈനായി തന്നെ ഉപയോഗിക്കാവുന്നതാണ്.'
          : 'You are currently offline. The 15-Minute Physics Class & Quiz remain fully available offline.'
        : settings.language === 'ml'
        ? 'ക്ഷമിക്കണം, കണക്ഷനിൽ ഒരു തടസ്സമുണ്ടായി. ദയവായി ചോദ്യം ഒന്നുകൂടി ചോദിക്കാമോ?'
        : "I couldn't connect to the AI service right now. Please try asking again.";

      setMessages((prev) => [
        ...prev,
        {
          id: fallbackId,
          question: trimmed,
          answer: fallbackMsg,
          timestamp: Date.now(),
          languageName: settings.language === 'ml' ? 'Malayalam' : 'English',
        },
      ]);
      setCurrentlySpeakingId(null);
      audioVoiceManager.setAssistantSpeaking(false);
      isProcessingRef.current = false;
      if (activeSessionRef.current) {
        setState(isMuted ? 'muted' : 'listening');
      } else {
        setState('idle');
      }
    }
  };

  // Process voice audio snippet from audioVoiceManager
  const handleProcessAudio = async (audioBase64: string, mimeType: string) => {
    if (isProcessingRef.current || !activeSessionRef.current) return;
    isProcessingRef.current = true;

    setState('thinking');
    audioVoiceManager.setAssistantSpeaking(true);
    setInterimTranscript(settings.language === 'ml' ? 'ശബ്ദം പ്രോസസ്സ് ചെയ്യുന്നു...' : 'Processing voice query...');

    try {
      const response = await fetch('/api/voice-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64, mimeType }),
      });

      if (!response.ok) {
        throw new Error('Failed to process voice query');
      }

      const data = await response.json();
      const questionText = data.question || (settings.language === 'ml' ? 'ശബ്ദ സന്ദേശം' : 'Voice Query');
      const answerText = data.answer || 'മറുപടി ലഭിച്ചില്ല';
      const detectedLang = data.detectedLanguage || settings.language;
      const langName = data.languageName || (detectedLang === 'ml' ? 'Malayalam' : 'English');

      setInterimTranscript('');

      const newId = `msg-${Date.now()}`;
      const newMessage: MessageItem = {
        id: newId,
        question: questionText,
        answer: answerText,
        timestamp: Date.now(),
        detectedLanguage: detectedLang,
        languageName: langName,
        mood: data.mood || 'happy',
        isCurrentlySpeaking: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setCurrentlySpeakingId(newId);
      setState('speaking');

      // Speak answer aloud
      await ttsService.speak(answerText, detectedLang, {
        onStart: () => {
          setState('speaking');
          setCurrentlySpeakingId(newId);
        },
        onEnd: () => {
          setCurrentlySpeakingId(null);
          audioVoiceManager.setAssistantSpeaking(false);
          isProcessingRef.current = false;
          if (activeSessionRef.current) {
            setState(isMuted ? 'muted' : 'listening');
          }
        },
        onError: () => {
          setCurrentlySpeakingId(null);
          audioVoiceManager.setAssistantSpeaking(false);
          isProcessingRef.current = false;
          if (activeSessionRef.current) {
            setState(isMuted ? 'muted' : 'listening');
          }
        },
      });
    } catch (err: any) {
      console.error('Error handling voice query:', err);
      setInterimTranscript('');
      const fallbackId = `err-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: fallbackId,
          question: settings.language === 'ml' ? 'ശബ്ദം വ്യക്തമായില്ല' : 'Audio not recognized',
          answer:
            settings.language === 'ml'
              ? 'ക്ഷമിക്കണം, ശബ്ദം വ്യക്തമായി കേൾക്കാൻ കഴിഞ്ഞില്ല. ദയവായി ഒന്നുകൂടി ചോദിക്കാമോ?'
              : 'Could not clearly capture audio. Please ask again.',
          timestamp: Date.now(),
          languageName: 'Malayalam',
        },
      ]);
      setCurrentlySpeakingId(null);
      audioVoiceManager.setAssistantSpeaking(false);
      isProcessingRef.current = false;
      if (activeSessionRef.current) {
        setState(isMuted ? 'muted' : 'listening');
      }
    }
  };

  // Start Live Voice Interaction
  const handleStartLive = async () => {
    // Unlock browser audio context on user gesture
    ttsService.prime();

    activeSessionRef.current = true;
    setIsMuted(false);
    setState('listening');
    setInterimTranscript('');

    const started = await audioVoiceManager.start({
      onAudioReady: (base64, mime) => {
        handleProcessAudio(base64, mime);
      },
      onVolumeChange: (vol) => {
        setLiveVolume(vol);
      },
      onSpeechStateChange: (talking) => {
        setIsUserTalking(talking);
        if (talking) {
          setInterimTranscript(
            settings.language === 'ml' ? 'നിങ്ങൾ സംസാരിക്കുന്നു... കേൾക്കുന്നു' : 'Hearing your voice...'
          );
        } else {
          setInterimTranscript('');
        }
      },
      onError: (err) => {
        setPermissionError(err);
        setIsPermissionModalOpen(true);
        activeSessionRef.current = false;
        setState('idle');
      },
    });

    if (!started) {
      setState('idle');
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioVoiceManager.setMuted(nextMuted);
    if (nextMuted) {
      ttsService.stop();
      setCurrentlySpeakingId(null);
      setState('muted');
    } else {
      setState('listening');
    }
  };

  // End Call
  const handleEndCall = () => {
    activeSessionRef.current = false;
    audioVoiceManager.stop();
    ttsService.stop();
    setCurrentlySpeakingId(null);
    setInterimTranscript('');
    setIsUserTalking(false);
    setLiveVolume(0);
    setIsMuted(false);
    setState('idle');
    isProcessingRef.current = false;
  };

  // Replay Answer
  const handleReplay = (message: MessageItem) => {
    ttsService.stop();
    setCurrentlySpeakingId(message.id);
    setState('speaking');
    ttsService.speak(message.answer, message.detectedLanguage || settings.language, {
      onEnd: () => {
        setCurrentlySpeakingId(null);
        if (activeSessionRef.current) {
          setState(isMuted ? 'muted' : 'listening');
        } else {
          setState('idle');
        }
      },
      onError: () => {
        setCurrentlySpeakingId(null);
        if (activeSessionRef.current) {
          setState(isMuted ? 'muted' : 'listening');
        } else {
          setState('idle');
        }
      },
    });
  };

  // Stop speaking
  const handleStopSpeaking = () => {
    ttsService.stop();
    setCurrentlySpeakingId(null);
    audioVoiceManager.setAssistantSpeaking(false);
    isProcessingRef.current = false;
    if (activeSessionRef.current) {
      setState(isMuted ? 'muted' : 'listening');
    } else {
      setState('idle');
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem('achu_chat_history');
  };

  const handleClearLearningProgress = () => {
    localStorage.removeItem('achu_physics_completed');
    localStorage.removeItem('achu_physics_bookmarks');
    localStorage.removeItem('achu_physics_notes');
    localStorage.removeItem('achu_quiz_history');
  };

  const isDark = settings.theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col justify-between selection:bg-teal-500 selection:text-slate-950 transition-colors duration-300 ${
        isDark ? 'bg-[#021314] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Offline Status Floating Banner */}
      <OfflineIndicator language={settings.language} />

      {/* Top Application Header */}
      <header
        className={`w-full border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#021314]/90 border-teal-900/40 text-slate-100'
            : 'bg-white/90 border-slate-200 text-slate-800'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => setActiveTab('assistant')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.3)] group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-400 text-slate-950">
                  Love and Peace
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight flex items-center gap-2">
                Achu AI
                <span className="text-[10px] font-mono text-teal-400 font-bold hidden sm:inline">
                  · by Adithyan
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Header Actions: 15-Min Class Quick Button + PWA Install + Status */}
          <div className="flex items-center gap-2">
            {/* Quick 15-Min Physics Class Button (User specifically requested prominent button) */}
            <button
              onClick={() => {
                setActiveTab('learn');
                setOpenSpecificLessonIndex(0);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(45,212,191,0.4)] hover:brightness-110 active:scale-95 transition cursor-pointer"
              title="Open 15-Minute Physics Class (Units & Measurements)"
            >
              <BookOpen className="w-3.5 h-3.5 fill-current" />
              <span className="hidden xs:inline">15 Min Physics</span>
              <span className="xs:hidden">Physics</span>
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton language={settings.language} />

            {/* Clear History Button if present */}
            {messages.length > 0 && activeTab === 'assistant' && (
              <button
                onClick={handleClearHistory}
                title="Clear conversation"
                className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800/40 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'assistant', labelMl: 'അസിസ്റ്റന്റ്', labelEn: 'Assistant', icon: Bot },
            { id: 'chat', labelMl: 'ചാറ്റ്', labelEn: 'Chat', icon: MessageSquare },
            { id: 'learn', labelMl: 'ഫിസിക്സ് ക്ലാസ്സ്', labelEn: '15-Min Physics', icon: GraduationCap },
            { id: 'history', labelMl: 'ഹിസ്റ്ററി', labelEn: 'History', icon: History },
            { id: 'settings', labelMl: 'സെറ്റിംഗ്സ്', labelEn: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as NavTab);
                  if (tab.id === 'learn') setOpenSpecificLessonIndex(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-teal-950/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{settings.language === 'ml' ? tab.labelMl : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main App Content View Switcher */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-4 flex flex-col justify-center py-2 sm:py-4">
        {/* TAB 1: ASSISTANT (Real-Time Voice Orb & Interactive Answer Cards) */}
        {activeTab === 'assistant' && (
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center space-y-4">
            {/* Animated AI Orb (Centered, Glowing, Sound reactive) */}
            <div className="w-full flex flex-col items-center justify-center pt-2 sm:pt-4 pb-2">
              <AchuOrb
                state={state}
                audioLevel={liveVolume / 100}
                onClick={() => {
                  if (state === 'idle') handleStartLive();
                  else if (state === 'speaking') handleStopSpeaking();
                  else handleToggleMute();
                }}
              />
            </div>

            {/* Live Volume Meter when listening */}
            {state === 'listening' && !isMuted && (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#032020] border border-teal-500/40 text-xs text-teal-300 shadow-sm animate-fade-in">
                <Radio className={`w-3.5 h-3.5 ${isUserTalking ? 'text-emerald-400 animate-pulse' : 'text-teal-400'}`} />
                <span>
                  {isUserTalking
                    ? settings.language === 'ml'
                      ? 'നിങ്ങൾ സംസാരിക്കുന്നു... കേൾക്കുന്നു'
                      : 'Listening to your question...'
                    : settings.language === 'ml'
                    ? 'മൈക്ക് ഓൺ ആണ് · ചോദിക്കൂ ("Hey Achu")'
                    : 'Mic is ready · Ask anything ("Hey Achu")'}
                </span>
                {/* Visualizer bars */}
                <div className="flex items-center gap-0.5 ml-2 h-3">
                  {[4, 8, 14, 20, 12, 6].map((baseHeight, i) => {
                    const activeHeight = Math.max(3, Math.min(18, liveVolume * (baseHeight / 10)));
                    return (
                      <span
                        key={i}
                        style={{ height: `${activeHeight}px` }}
                        className={`w-1 rounded-full transition-all duration-75 ${
                          isUserTalking ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-teal-500/50'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Answer Cards Display Container */}
            {messages.length > 0 && (
              <div className="w-full max-w-2xl max-h-[38vh] sm:max-h-[44vh] overflow-y-auto pr-1 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
                  <span className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-teal-400" />
                    {settings.language === 'ml'
                      ? `സംഭാഷണങ്ങൾ (${messages.length})`
                      : `Conversations (${messages.length})`}
                  </span>
                  <span className="text-[11px] text-teal-400 flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    {settings.language === 'ml' ? 'ശബ്ദത്തിൽ മറുപടി നൽകുന്നു' : 'Spoken Aloud'}
                  </span>
                </div>

                {messages.map((item) => (
                  <AnswerCard
                    key={item.id}
                    message={item}
                    isCurrentlySpeaking={currentlySpeakingId === item.id}
                    onReplay={handleReplay}
                    onStopSpeaking={handleStopSpeaking}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CHAT INTERFACE */}
        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            isProcessing={state === 'thinking'}
            language={settings.language}
            aiProvider={settings.aiProvider}
            onSendMessage={handleProcessQuestion}
            onClearHistory={handleClearHistory}
            onTriggerVoice={handleStartLive}
          />
        )}

        {/* TAB 3: LEARN (Offline 15-Minute Physics Class & Learning Dashboard) */}
        {activeTab === 'learn' && (
          <div className="w-full">
            {openSpecificLessonIndex !== null ? (
              <PhysicsClassView
                initialLanguage={settings.language}
                onAskAchu={(topic) => {
                  setActiveTab('chat');
                  setTimeout(() => handleProcessQuestion(topic), 200);
                }}
              />
            ) : (
              <LearningDashboard
                language={settings.language}
                onOpenLesson={(idx = 0) => setOpenSpecificLessonIndex(idx)}
                onOpenQuiz={() => setOpenSpecificLessonIndex(0)}
              />
            )}
          </div>
        )}

        {/* TAB 4: CONVERSATION HISTORY */}
        {activeTab === 'history' && (
          <HistoryView
            messages={messages}
            language={settings.language}
            onClearHistory={handleClearHistory}
            onDeleteMessage={(id) => setMessages((prev) => prev.filter((m) => m.id !== id))}
            onSelectQuestion={(q) => {
              setActiveTab('assistant');
              handleProcessQuestion(q);
            }}
          />
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onClearChatHistory={handleClearHistory}
            onClearLearningProgress={handleClearLearningProgress}
          />
        )}
      </main>

      {/* Floating Call Controls (only displayed when on Assistant tab) */}
      {activeTab === 'assistant' && (
        <footer className="w-full shrink-0">
          <Controls
            state={state}
            isMuted={isMuted}
            selectedLanguage={settings.language === 'ml' ? 'ml-IN' : 'en-US'}
            onStartLive={handleStartLive}
            onToggleMute={handleToggleMute}
            onEndCall={handleEndCall}
            onLanguageChange={(l) => handleUpdateSettings({ language: l.startsWith('ml') ? 'ml' : 'en' })}
            onSubmitTextQuestion={handleProcessQuestion}
            interimTranscript={interimTranscript}
            onImmediateSubmitInterim={
              isUserTalking
                ? () => {
                    audioVoiceManager.finishCurrentRecordingManually();
                  }
                : undefined
            }
          />
        </footer>
      )}

      {/* Microphone Permission Modal */}
      <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        onRetry={() => {
          setIsPermissionModalOpen(false);
          handleStartLive();
        }}
        errorMessage={permissionError}
      />
    </div>
  );
}
