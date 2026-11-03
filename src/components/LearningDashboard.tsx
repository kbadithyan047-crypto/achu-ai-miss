import React, { useState, useEffect } from 'react';
import { PHYSICS_LESSON_INFO, PHYSICS_SECTIONS } from '../data/physicsLesson';
import { AppLanguage, QuizResult } from '../types';
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  Bookmark,
  PlayCircle,
  RotateCcw,
  Sparkles,
  FileText,
} from 'lucide-react';

interface LearningDashboardProps {
  language: AppLanguage;
  onOpenLesson: (sectionIndex?: number) => void;
  onOpenQuiz: () => void;
}

export const LearningDashboard: React.FC<LearningDashboardProps> = ({
  language,
  onOpenLesson,
  onOpenQuiz,
}) => {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);

  useEffect(() => {
    try {
      const comp = JSON.parse(localStorage.getItem('achu_physics_completed') || '[]');
      const bm = JSON.parse(localStorage.getItem('achu_physics_bookmarks') || '[]');
      const notes = JSON.parse(localStorage.getItem('achu_physics_notes') || '{}');
      const qz = JSON.parse(localStorage.getItem('achu_quiz_history') || '[]');
      setCompletedSections(comp);
      setBookmarks(bm);
      setSavedNotes(notes);
      setQuizHistory(qz);
    } catch {}
  }, []);

  const totalSections = PHYSICS_SECTIONS.length;
  const completedCount = completedSections.filter((id) => id !== 'quiz-completed').length;
  const progressPercent = Math.round((completedCount / totalSections) * 100);
  const bestQuizScore = quizHistory.reduce((max, item) => Math.max(max, item.percentage), 0);

  return (
    <div className="w-full max-w-4xl mx-auto py-3 px-3 sm:px-4 space-y-5 animate-fade-in">
      {/* Top Welcome Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#032626] via-[#053a3a] to-[#021f1f] border border-teal-500/30 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-semibold mb-2 border border-teal-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Achu AI Learning Academy</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {language === 'ml' ? 'ഫിസിക്സ് ലേണിംഗ് ഹബ്ബ്' : 'Physics Learning Dashboard'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
              {language === 'ml'
                ? 'പ്ലസ് വൺ ഫിസിക്സ് പാഠഭാഗങ്ങൾ 15 മിനിറ്റിൽ കൃത്യമായി പഠിച്ചെടുക്കൂ. ഇന്റർനെറ്റ് ഇല്ലാതെയും പൂർണ്ണമായി ലഭ്യമാണ്.'
                : 'Master Class 11 Physics syllabus in planned 15-minute lessons. Completely functional offline without internet.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onOpenLesson(0)}
              className="px-5 py-3 rounded-2xl bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm hover:bg-teal-300 transition shadow-[0_0_15px_rgba(45,212,191,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 fill-current" />
              <span>{progressPercent > 0 ? (language === 'ml' ? 'തുടരുക (Resume)' : 'Resume Class') : (language === 'ml' ? 'ക്ലാസ്സ് തുടങ്ങാം' : 'Start Class')}</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="text-center">
            <span className="text-[11px] text-slate-400 block">{language === 'ml' ? 'പൂർത്തിയായത്' : 'Progress'}</span>
            <span className="text-lg sm:text-xl font-bold text-teal-300 font-mono">{progressPercent}%</span>
          </div>
          <div className="text-center border-x border-slate-800">
            <span className="text-[11px] text-slate-400 block">{language === 'ml' ? 'ക്വിസ് റെക്കോർഡ്' : 'Best Quiz'}</span>
            <span className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">{bestQuizScore}%</span>
          </div>
          <div className="text-center">
            <span className="text-[11px] text-slate-400 block">{language === 'ml' ? 'ബുക്ക്മാർക്കുകൾ' : 'Bookmarks'}</span>
            <span className="text-lg sm:text-xl font-bold text-amber-300 font-mono">{bookmarks.length}</span>
          </div>
        </div>
      </div>

      {/* Primary Available Lesson Card: Units and Measurements */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-400" />
          <span>{language === 'ml' ? 'ലഭ്യമായ പാഠഭാഗങ്ങൾ' : 'Available Physics Lessons'}</span>
        </h3>

        <div className="p-5 rounded-3xl bg-[#042424]/90 border border-teal-500/30 text-white shadow-lg hover:border-teal-400/50 transition">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
                  Chapter 1 · Class 11
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-teal-400" />
                  15:00 Mins
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  Offline
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                {language === 'ml' ? PHYSICS_LESSON_INFO.chapterNameMl : PHYSICS_LESSON_INFO.chapterNameEn}
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                {language === 'ml'
                  ? 'ഭൗതിക അളവുകൾ, 7 അടിസ്ഥാന SI യൂണിറ്റുകൾ, ഡൈമൻഷണൽ ഫോർമുലകൾ, സിഗ്നിഫിക്കന്റ് ഫിഗറുകൾ, ഡൈമൻഷണൽ അനാലിസിസ്, 10 ചോദ്യങ്ങളുടെ ക്വിസ്.'
                  : 'Physical quantities, 7 SI base units, dimensional derivations, significant figures, dimensional consistency, and interactive quiz.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenLesson(0)}
                className="px-4 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition cursor-pointer"
              >
                {language === 'ml' ? 'പഠിക്കാം' : 'Open Lesson'}
              </button>
              <button
                onClick={onOpenQuiz}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-teal-300 hover:text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                {language === 'ml' ? 'ക്വിസ്' : 'Take Quiz'}
              </button>
            </div>
          </div>

          {/* Section Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80">
            {PHYSICS_SECTIONS.map((sec, idx) => {
              const isDone = completedSections.includes(sec.id);
              return (
                <button
                  key={sec.id}
                  onClick={() => onOpenLesson(idx)}
                  className="p-2.5 rounded-xl bg-[#021818] border border-slate-800/80 hover:border-teal-500/30 text-left text-xs transition cursor-pointer flex items-center justify-between"
                >
                  <div className="truncate mr-1">
                    <span className="text-[10px] text-teal-400 font-mono block">{sec.timeline}</span>
                    <span className="text-slate-200 font-medium truncate block">
                      {idx + 1}. {language === 'ml' ? sec.titleMl.split(':')[1] || sec.titleMl : sec.titleEn.split(':')[1] || sec.titleEn}
                    </span>
                  </div>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <PlayCircle className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bookmarked Sections & Notes Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Bookmarks */}
        <div className="p-4 rounded-3xl bg-[#042424]/80 border border-teal-500/20 text-white">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-3 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5" />
            <span>{language === 'ml' ? 'ബുക്ക്മാർക്ക് ചെയ്തവ' : 'Bookmarked Topics'}</span>
          </h4>
          {bookmarks.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              {language === 'ml' ? 'ഇതുവരെ ഒന്നും ബുക്ക്മാർക്ക് ചെയ്തിട്ടില്ല.' : 'No bookmarked topics yet.'}
            </p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {bookmarks.map((bmId) => {
                const sec = PHYSICS_SECTIONS.find((s) => s.id === bmId);
                if (!sec) return null;
                const idx = PHYSICS_SECTIONS.indexOf(sec);
                return (
                  <button
                    key={bmId}
                    onClick={() => onOpenLesson(idx)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#021818] border border-slate-800 text-xs text-slate-200 hover:border-teal-400/40 transition flex items-center justify-between"
                  >
                    <span className="truncate">{language === 'ml' ? sec.titleMl : sec.titleEn}</span>
                    <span className="text-[10px] text-teal-400 font-mono shrink-0 ml-1">{sec.timeline}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Saved Student Notes */}
        <div className="p-4 rounded-3xl bg-[#042424]/80 border border-teal-500/20 text-white">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-3 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'ml' ? 'നിങ്ങളുടെ നോട്ടുകൾ' : 'Saved Study Notes'}</span>
          </h4>
          {Object.keys(savedNotes).length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              {language === 'ml' ? 'നോട്ടുകൾ ഒന്നും രേഖപ്പെടുത്തിയിട്ടില്ല.' : 'No saved notes yet.'}
            </p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {Object.entries(savedNotes).map(([secId, noteText]) => {
                const sec = PHYSICS_SECTIONS.find((s) => s.id === secId);
                return (
                  <div key={secId} className="p-2.5 rounded-xl bg-[#021818] border border-slate-800 text-xs text-slate-200">
                    <span className="text-[10px] text-teal-400 font-mono block mb-0.5">
                      {sec ? (language === 'ml' ? sec.titleMl : sec.titleEn) : secId}
                    </span>
                    <p className="line-clamp-2 text-slate-300 italic">"{noteText}"</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
