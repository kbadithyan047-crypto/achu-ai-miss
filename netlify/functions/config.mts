import type { Config } from '@netlify/functions';
import { AI_PROVIDER, GEMINI_MODEL, OPENAI_MODEL } from '../lib/ai.mts';

// Public configuration route (no secrets exposed)
export default async () =>
  Response.json({
    appName: 'Achu AI',
    motto: 'Love and Peace',
    creator: 'Adithyan',
    configuredProvider: AI_PROVIDER,
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    geminiModel: GEMINI_MODEL,
    openAIModel: OPENAI_MODEL,
    isOnline: true,
  });

export const config: Config = { path: '/api/config' };
