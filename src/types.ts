export type AssistantState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'muted'
  | 'error';

export type PermissionStatus = 'prompt' | 'granted' | 'denied' | 'unsupported';

export type NavTab = 'assistant' | 'chat' | 'learn' | 'history' | 'settings';

export type AIProvider = 'auto' | 'gemini' | 'openai';

export type AppLanguage = 'ml' | 'en';

export type AppTheme = 'dark' | 'light';

export interface MessageItem {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
  detectedLanguage?: string;
  languageName?: string;
  mood?: 'happy' | 'thinking' | 'amazed' | 'chill' | 'empathic';
  isCurrentlySpeaking?: boolean;
  provider?: string;
}

export interface ChatResponse {
  answer: string;
  detectedLanguage: string;
  languageName: string;
  mood: 'happy' | 'thinking' | 'amazed' | 'chill' | 'empathic';
  provider?: string;
  error?: string;
}

export interface LessonSection {
  id: string;
  timeline: string; // e.g., "00:00 – 02:00"
  durationMinutes: number;
  titleEn: string;
  titleMl: string;
  summaryEn: string;
  summaryMl: string;
  contentEn: string[];
  contentMl: string[];
  keyPointsEn: string[];
  keyPointsMl: string[];
  formulas?: {
    name: string;
    symbol: string;
    formula: string;
    dimension: string;
    unit: string;
  }[];
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  audioNarrationEn: string;
  audioNarrationMl: string;
}

export interface QuizQuestion {
  id: string;
  sectionId: string;
  questionEn: string;
  questionMl: string;
  optionsEn: string[];
  optionsMl: string[];
  correctIndex: number;
  explanationEn: string;
  explanationMl: string;
  category: 'concept' | 'formula' | 'numerical' | 'si-unit';
}

export interface QuizResult {
  total: number;
  score: number;
  percentage: number;
  completedAt: number;
  answers: {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
  }[];
}

export interface LearningProgress {
  lastSectionIndex: number;
  completedSections: string[];
  bookmarks: string[];
  notes: Record<string, string>;
  quizResults: QuizResult[];
  totalStudySeconds: number;
}

export interface UserSettings {
  language: AppLanguage;
  theme: AppTheme;
  aiProvider: AIProvider;
  speechRate: number;
  wakePhraseEnabled: boolean;
  hapticFeedback: boolean;
  autoSpeak: boolean;
}
