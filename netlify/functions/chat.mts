import type { Config } from '@netlify/functions';
import { AI_PROVIDER, callGeminiChat, callOpenAIChat } from '../lib/ai.mts';

export default async (req: Request) => {
  try {
    const { question, conversationHistory = [], preferredProvider } = await req.json().catch(() => ({}));
    if (!question || typeof question !== 'string') {
      return Response.json({ error: 'Question is required' }, { status: 400 });
    }

    const target = String(preferredProvider || AI_PROVIDER).toLowerCase();
    let result;
    let provider = 'gemini';

    if (target === 'openai') {
      result = await callOpenAIChat(question, conversationHistory);
      provider = 'openai';
    } else if (target === 'gemini') {
      result = await callGeminiChat(question, conversationHistory);
    } else {
      // Auto: Gemini first, OpenAI fallback
      try {
        result = await callGeminiChat(question, conversationHistory);
      } catch (geminiErr: any) {
        console.warn('Gemini failed in auto mode, trying OpenAI fallback:', geminiErr?.message);
        result = await callOpenAIChat(question, conversationHistory);
        provider = 'openai';
      }
    }

    return Response.json({
      answer: result.answer,
      detectedLanguage: result.detectedLanguage,
      languageName: result.languageName,
      mood: result.mood,
      provider,
    });
  } catch (err: any) {
    console.error('Error generating chat response:', err?.message || err);
    return Response.json(
      {
        error: 'Failed to process AI response',
        answer: 'ക്ഷമിക്കണം, കണക്ഷനിൽ ഒരു ചെറിയ തടസ്സം ഉണ്ടായി. ദയവായി വീണ്ടും ചോദിക്കാമോ?',
        detectedLanguage: 'ml',
        languageName: 'Malayalam',
        mood: 'chill',
      },
      { status: 500 },
    );
  }
};

export const config: Config = { path: '/api/chat', method: 'POST' };
