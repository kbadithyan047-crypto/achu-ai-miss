import React, { useState } from 'react';
import { PHYSICS_QUIZ_QUESTIONS } from '../data/physicsLesson';
import { AppLanguage, QuizResult } from '../types';
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PhysicsQuizProps {
  language: AppLanguage;
  onQuizComplete?: (result: QuizResult) => void;
  onClose?: () => void;
}

export const PhysicsQuiz: React.FC<PhysicsQuizProps> = ({
  language,
  onQuizComplete,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = PHYSICS_QUIZ_QUESTIONS[currentIndex];
  const total = PHYSICS_QUIZ_QUESTIONS.length;

  const handleSelectOption = (optionIndex: number) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // already answered
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
    setShowExplanation((prev) => ({ ...prev, [currentIndex]: true }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let score = 0;
    const answerDetails = PHYSICS_QUIZ_QUESTIONS.map((q, idx) => {
      const selected = selectedAnswers[idx] ?? -1;
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) score += 1;
      return {
        questionId: q.id,
        selectedIndex: selected,
        isCorrect,
      };
    });

    const percentage = Math.round((score / total) * 100);
    const result: QuizResult = {
      total,
      score,
      percentage,
      completedAt: Date.now(),
      answers: answerDetails,
    };

    setIsCompleted(true);
    onQuizComplete?.(result);

    // Save in localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('achu_quiz_history') || '[]');
      saved.unshift(result);
      localStorage.setItem('achu_quiz_history', JSON.stringify(saved.slice(0, 10)));
    } catch {}

    if (percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  // Result view
  if (isCompleted) {
    let score = 0;
    PHYSICS_QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) score += 1;
    });
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="w-full max-w-2xl mx-auto p-5 sm:p-6 rounded-3xl bg-[#042424]/90 border border-teal-500/30 text-slate-100 shadow-2xl animate-fade-in">
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 mb-3 shadow-[0_0_20px_rgba(45,212,191,0.3)]">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
            {language === 'ml' ? 'ക്വിസ് ഫലം (Quiz Summary)' : 'Quiz Results'}
          </h2>
          <p className="text-xs text-teal-300 font-mono">
            {language === 'ml' ? 'യൂണിറ്റുകളും അളവുകളും — പ്ലസ് വൺ ഫിസിക്സ്' : 'Units & Measurements — Class 11'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-4 rounded-2xl bg-[#021818] border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block">{language === 'ml' ? 'ലഭിച്ച മാർക്ക്' : 'Score'}</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-400">{score} / {total}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#021818] border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block">{language === 'ml' ? 'ശതമാനം' : 'Percentage'}</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-300">{percentage}%</span>
          </div>
        </div>

        {/* Feedback message */}
        <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/20 text-xs sm:text-sm text-teal-200 text-center mb-5">
          {percentage >= 80
            ? language === 'ml'
              ? 'ഗംഭീരം! കോൺസെപ്റ്റുകൾ എല്ലാം വ്യക്തമായി മനസ്സിലായിട്ടുണ്ട്.'
              : 'Excellent! You have mastered the fundamentals of this chapter.'
            : percentage >= 50
            ? language === 'ml'
              ? 'നല്ല പ്രകടനം! ഫോർമുലകളും സിഗ്നിഫിക്കന്റ് ഫിഗർ നിയമങ്ങളും ഒന്നുകൂടി റിവൈസ് ചെയ്യുക.'
              : 'Good job! A quick revision of formulas will get you top marks.'
            : language === 'ml'
              ? 'ഫിസിക്സ് 15-മിനിറ്റ് ക്ലാസ്സ് ഒന്നുകൂടി ശ്രദ്ധയോടെ വായിച്ച ശേഷം വീണ്ടും ശ്രമിക്കൂ.'
              : 'Review the 15-minute physics lecture and try again.'}
        </div>

        {/* Question Review Section */}
        <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {language === 'ml' ? 'ഉത്തരങ്ങളുടെ പരിശോധന' : 'Question Breakdown'}
          </h4>
          {PHYSICS_QUIZ_QUESTIONS.map((q, idx) => {
            const userChoice = selectedAnswers[idx];
            const isCorrect = userChoice === q.correctIndex;
            return (
              <div
                key={q.id}
                className={`p-3 rounded-xl border text-xs ${
                  isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                }`}
              >
                <div className="flex items-start gap-2 font-medium">
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">{idx + 1}. {language === 'ml' ? q.questionMl : q.questionEn}</p>
                    <p className="text-[11px] text-slate-300 mt-1">
                      {language === 'ml' ? 'ശരിയായ ഉത്തരം' : 'Correct Answer'}:{' '}
                      <span className="text-teal-300 font-bold">
                        {language === 'ml' ? q.optionsMl[q.correctIndex] : q.optionsEn[q.correctIndex]}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 italic">
                      {language === 'ml' ? q.explanationMl : q.explanationEn}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRetake}
            className="flex-1 py-3 rounded-2xl bg-teal-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-teal-400 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'ml' ? 'വീണ്ടും എഴുതാം (Retake)' : 'Retake Quiz'}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-800 transition cursor-pointer"
            >
              {language === 'ml' ? 'പൂർത്തിയാക്കുക' : 'Close'}
            </button>
          )}
        </div>
      </div>
    );
  }

  const hasAnswered = selectedAnswers[currentIndex] !== undefined;
  const selectedOption = selectedAnswers[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto p-5 sm:p-6 rounded-3xl bg-[#042424]/90 border border-teal-500/30 text-slate-100 shadow-2xl animate-fade-in">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold border border-teal-400/30">
            {currentIndex + 1} / {total}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {language === 'ml' ? 'സ്വയം വിലയിരുത്തൽ ക്വിസ്' : 'Self-Assessment Quiz'}
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-white">
            {language === 'ml' ? 'ക്ലാസ്സിലേക്ക് മടങ്ങുക' : 'Back to Lesson'}
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question Text */}
      <div className="mb-5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 block mb-1">
          {currentQ.category.toUpperCase()}
        </span>
        <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
          {language === 'ml' ? currentQ.questionMl : currentQ.questionEn}
        </h3>
      </div>

      {/* Options List */}
      <div className="space-y-2.5 mb-5">
        {(language === 'ml' ? currentQ.optionsMl : currentQ.optionsEn).map((optionText, optIdx) => {
          const isSelected = selectedOption === optIdx;
          const isCorrect = optIdx === currentQ.correctIndex;
          let btnStyle = 'bg-[#021818] border-slate-800 hover:border-teal-500/40 text-slate-200';

          if (hasAnswered) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
            } else if (isSelected) {
              btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
            } else {
              btnStyle = 'bg-[#021818]/60 border-slate-900 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={optIdx}
              onClick={() => handleSelectOption(optIdx)}
              disabled={hasAnswered}
              className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all text-xs sm:text-sm flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span>{optionText}</span>
              {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
              {hasAnswered && isSelected && !isCorrect && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Instant Explanation Box */}
      {hasAnswered && (
        <div className="p-3.5 rounded-2xl bg-teal-950/50 border border-teal-500/30 text-xs sm:text-sm text-teal-100 mb-5 animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 font-bold text-teal-300 mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{language === 'ml' ? 'വിശദീകരണം' : 'Explanation'}:</span>
          </div>
          <p className="leading-relaxed">
            {language === 'ml' ? currentQ.explanationMl : currentQ.explanationEn}
          </p>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-slate-400">
          {hasAnswered
            ? language === 'ml'
              ? 'അടുത്ത ചോദ്യത്തിലേക്ക് പോകാം'
              : 'Ready for next question'
            : language === 'ml'
            ? 'ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക'
            : 'Select an option to check'}
        </span>
        {hasAnswered && (
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm hover:bg-teal-300 flex items-center gap-1.5 transition shadow cursor-pointer"
          >
            <span>{currentIndex < total - 1 ? (language === 'ml' ? 'അടുത്തത്' : 'Next') : language === 'ml' ? 'ഫലം കാണുക' : 'Finish'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
