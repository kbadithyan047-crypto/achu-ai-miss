import React, { useState, useEffect } from 'react';
import { PHYSICS_SECTIONS, PHYSICS_LESSON_INFO } from '../data/physicsLesson';
import { AppLanguage, QuizResult } from '../types';
import { offlineLessonAudio, LessonAudioProgress } from '../services/offlineLessonAudio';
import { PhysicsQuiz } from './PhysicsQuiz';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Award,
  Globe,
} from 'lucide-react';

interface PhysicsClassViewProps {
  initialLanguage?: AppLanguage;
  onAskAchu?: (topic: string) => void;
}

export const PhysicsClassView: React.FC<PhysicsClassViewProps> = ({
  initialLanguage = 'ml',
  onAskAchu,
}) => {
  const [language, setLanguage] = useState<AppLanguage>(initialLanguage);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [audioProgress, setAudioProgress] = useState<LessonAudioProgress>(offlineLessonAudio.getProgress());
  const [bookmarkedSections, setBookmarkedSections] = useState<string[]>([]);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [studentNote, setStudentNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  // Sync with offline audio service
  useEffect(() => {
    offlineLessonAudio.setLanguage(language);
    const unsubscribe = offlineLessonAudio.subscribe((p) => {
      setAudioProgress(p);
      if (p.status === 'playing') {
        setActiveSectionIndex(p.currentSectionIndex);
      }
    });
    return unsubscribe;
  }, [language]);

  // Load saved progress from localStorage
  useEffect(() => {
    try {
      const bm = JSON.parse(localStorage.getItem('achu_physics_bookmarks') || '[]');
      const comp = JSON.parse(localStorage.getItem('achu_physics_completed') || '[]');
      const notes = JSON.parse(localStorage.getItem('achu_physics_notes') || '{}');
      setBookmarkedSections(bm);
      setCompletedSections(comp);
      setSavedNotes(notes);
    } catch {}
  }, []);

  const currentSection = PHYSICS_SECTIONS[activeSectionIndex];

  // Update note when active section changes
  useEffect(() => {
    setStudentNote(savedNotes[currentSection.id] || '');
  }, [activeSectionIndex, savedNotes, currentSection.id]);

  const toggleBookmark = (id: string) => {
    setBookmarkedSections((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('achu_physics_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const toggleCompleted = (id: string) => {
    setCompletedSections((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('achu_physics_completed', JSON.stringify(next));
      return next;
    });
  };

  const handleSaveNote = () => {
    const next = { ...savedNotes, [currentSection.id]: studentNote };
    setSavedNotes(next);
    localStorage.setItem('achu_physics_notes', JSON.stringify(next));
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (showQuiz) {
    return (
      <div className="w-full max-w-4xl mx-auto py-4 px-3 sm:px-4">
        <PhysicsQuiz
          language={language}
          onClose={() => setShowQuiz(false)}
          onQuizComplete={(_res: QuizResult) => {
            toggleCompleted('quiz-completed');
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-3 px-3 sm:px-4 space-y-4">
      {/* Chapter Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#032424] via-[#053232] to-[#021f1f] border border-teal-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 font-mono text-[11px] font-bold border border-teal-400/30">
                NCERT Plus One Physics
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                15 {language === 'ml' ? 'മിനിറ്റ് ക്ലാസ്സ്' : 'Min Class'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {language === 'ml' ? PHYSICS_LESSON_INFO.chapterNameMl : PHYSICS_LESSON_INFO.chapterNameEn}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {language === 'ml' ? 'കേരള ഹയർ സെക്കൻഡറി സിലബസ് അടിസ്ഥാനമാക്കിയുള്ള ലളിത പഠനം' : 'Simple interactive physics lecture designed for Class 11'}
            </p>
          </div>

          {/* Language Toggle & Quiz Button */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center bg-[#021818] p-1 rounded-2xl border border-teal-500/30">
              <button
                onClick={() => setLanguage('ml')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  language === 'ml' ? 'bg-teal-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                മലയാളം
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  language === 'en' ? 'bg-teal-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={() => setShowQuiz(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition shadow-md cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>{language === 'ml' ? 'ക്വിസ് (Quiz)' : 'Quiz'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 15-Minute Audio Lecture Player Box (Requested specifically by user) */}
      <div className="p-4 rounded-3xl bg-[#042424]/90 border border-teal-400/40 text-slate-100 shadow-lg backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {language === 'ml' ? '15 മിനിറ്റ് ലെക്ചർ ഓഡിയോ (Lecture Audio)' : '15-Minute Lecture Audio'}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800 font-mono">
                  Offline Ready
                </span>
              </div>
              <p className="text-[11px] text-teal-300 font-medium truncate max-w-xs sm:max-w-md">
                {audioProgress.sectionTitle}
              </p>
            </div>
          </div>

          {/* Controls: Play/Pause, Reset, Speed */}
          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="flex items-center bg-[#021818] px-1.5 py-0.5 rounded-xl border border-slate-800 text-[11px] font-mono">
              {[1.0, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => offlineLessonAudio.setPlaybackRate(rate)}
                  className={`px-2 py-1 rounded-lg transition ${
                    audioProgress.playbackRate === rate
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Reset Button */}
            <button
              onClick={() => offlineLessonAudio.reset()}
              title="Reset Lecture Timer"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={() => {
                if (audioProgress.status === 'playing') {
                  offlineLessonAudio.pause();
                } else if (audioProgress.status === 'paused') {
                  offlineLessonAudio.resume();
                } else {
                  offlineLessonAudio.playSection(activeSectionIndex);
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm hover:bg-teal-300 transition shadow-[0_0_15px_rgba(45,212,191,0.4)] cursor-pointer"
            >
              {audioProgress.status === 'playing' ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>{language === 'ml' ? 'നിർത്തുക' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>{language === 'ml' ? 'കേൾക്കാം (Play)' : 'Play Lecture'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="space-y-1">
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300"
              style={{
                width: `${Math.min(100, (audioProgress.elapsedSeconds / (15 * 60)) * 100)}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>{formatTime(audioProgress.elapsedSeconds)}</span>
            <span>{language === 'ml' ? 'ആകെ ക്ലാസ്സ്: 15:00 മിനിറ്റ്' : 'Planned Duration: 15:00'}</span>
          </div>
        </div>
      </div>

      {/* Section Navigation Timeline Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {PHYSICS_SECTIONS.map((sec, idx) => {
          const isActive = idx === activeSectionIndex;
          const isDone = completedSections.includes(sec.id);
          const isMarked = bookmarkedSections.includes(sec.id);

          return (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSectionIndex(idx);
                if (audioProgress.status === 'playing') {
                  offlineLessonAudio.playSection(idx);
                }
              }}
              className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-teal-500 text-slate-950 font-bold border-teal-300 shadow-md'
                  : 'bg-[#021818] border-slate-800 text-slate-300 hover:border-teal-500/40'
              }`}
            >
              {isDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              {isMarked && !isDone && <Bookmark className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-current" />}
              <span>{idx + 1}. {sec.timeline}</span>
            </button>
          );
        })}
      </div>

      {/* Active Section Reading Content */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#042424]/80 border border-teal-500/30 text-slate-100 shadow-xl space-y-4">
        {/* Section Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <span className="text-[11px] font-mono text-teal-400 uppercase font-bold tracking-wider">
              {currentSection.timeline}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {language === 'ml' ? currentSection.titleMl : currentSection.titleEn}
            </h3>
            <p className="text-xs text-slate-300 mt-1 italic">
              {language === 'ml' ? currentSection.summaryMl : currentSection.summaryEn}
            </p>
          </div>

          {/* Bookmark & Mark Complete Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => toggleBookmark(currentSection.id)}
              className={`p-2 rounded-xl border transition ${
                bookmarkedSections.includes(currentSection.id)
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Bookmark this section"
            >
              {bookmarkedSections.includes(currentSection.id) ? (
                <BookmarkCheck className="w-4 h-4 fill-current" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => toggleCompleted(currentSection.id)}
              className={`p-2 rounded-xl border transition ${
                completedSections.includes(currentSection.id)
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Mark as completed"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Text Content */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
          {(language === 'ml' ? currentSection.contentMl : currentSection.contentEn).map((paragraph, pIdx) => (
            <p key={pIdx} className="whitespace-pre-line bg-[#021818]/60 p-3.5 rounded-2xl border border-slate-900/60">
              {paragraph}
            </p>
          ))}
        </div>

        {/* SI Base Units Table if present */}
        {currentSection.tableData && (
          <div className="overflow-x-auto rounded-2xl border border-teal-500/30 my-4 shadow-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#021b1b] text-teal-300 font-bold border-b border-teal-500/30">
                <tr>
                  {currentSection.tableData.headers.map((h, i) => (
                    <th key={i} className="p-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#021415]/90 text-slate-200">
                {currentSection.tableData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-teal-950/20 transition">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 font-mono text-xs">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Formulas & Dimensions Table if present */}
        {currentSection.formulas && (
          <div className="space-y-2 my-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              {language === 'ml' ? 'പ്രധാന ഡൈമൻഷണൽ ഫോർമുലകൾ' : 'Key Dimensional Formulae'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentSection.formulas.map((f, i) => (
                <div key={i} className="p-3 rounded-2xl bg-[#021818] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{f.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">Formula: {f.formula}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-teal-400 font-mono block">{f.dimension}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{f.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Takeaways Box */}
        <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/20">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ml' ? 'പ്രധാന പോയിന്റുകൾ (Key Points)' : 'Key Takeaways'}</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4">
            {(language === 'ml' ? currentSection.keyPointsMl : currentSection.keyPointsEn).map((pt, kIdx) => (
              <li key={kIdx}>{pt}</li>
            ))}
          </ul>
        </div>

        {/* Ask Achu AI About This Section */}
        {onAskAchu && (
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() =>
                onAskAchu(
                  language === 'ml'
                    ? `യൂണിറ്റ്സ് ആൻഡ് മെഷർമെന്റിലെ "${currentSection.titleMl}" നെക്കുറിച്ച് കൂടുതൽ വിശദീകരിക്കാമോ?`
                    : `Can you explain more about "${currentSection.titleEn}" from Class 11 Physics?`
                )
              }
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ml' ? 'ഇതിനെക്കുറിച്ച് അച്ചൂസിനോട് ചോദിക്കൂ' : 'Ask Achu AI to explain this topic'}</span>
            </button>

            {/* Quick Next Section */}
            {activeSectionIndex < PHYSICS_SECTIONS.length - 1 ? (
              <button
                onClick={() => setActiveSectionIndex(activeSectionIndex + 1)}
                className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/30 text-teal-300 text-xs font-bold transition"
              >
                {language === 'ml' ? 'അടുത്ത ഭാഗം ➔' : 'Next Section ➔'}
              </button>
            ) : (
              <button
                onClick={() => setShowQuiz(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition"
              >
                {language === 'ml' ? 'ക്വിസ് ആരംഭിക്കുക ➔' : 'Start Quiz ➔'}
              </button>
            )}
          </div>
        )}

        {/* Student Notes Drawer */}
        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">
              {language === 'ml' ? 'ഈ ഭാഗത്തെക്കുറിച്ചുള്ള നിങ്ങളുടെ നോട്ടുകൾ' : 'Personal Study Notes'}
            </span>
            <button
              onClick={handleSaveNote}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 font-semibold"
            >
              {language === 'ml' ? 'സേവ് ചെയ്യുക' : 'Save Note'}
            </button>
          </div>
          <textarea
            value={studentNote}
            onChange={(e) => setStudentNote(e.target.value)}
            placeholder={
              language === 'ml'
                ? 'നിങ്ങളുടെ പ്രധാന പോയിന്റുകൾ ഇവിടെ കുറിച്ചുവെക്കാം...'
                : 'Write your notes or memory tricks here...'
            }
            className="w-full bg-[#021818] border border-slate-800 focus:border-teal-400 rounded-xl p-3 text-xs text-slate-200 outline-none resize-none h-20"
          />
        </div>
      </div>
    </div>
  );
};
