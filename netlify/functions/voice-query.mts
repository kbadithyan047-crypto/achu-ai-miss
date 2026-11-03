import type { Config } from '@netlify/functions';
import { GEMINI_FALLBACK_MODELS, getGemini, parseAIOutput } from '../lib/ai.mts';

export default async (req: Request) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = await req.json().catch(() => ({}));
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      return Response.json({ error: 'Audio data is required' }, { status: 400 });
    }

    const cleanMime = String(mimeType || 'audio/webm').split(';')[0].trim();
    const audioPart = { inlineData: { mimeType: cleanMime, data: audioBase64 } };

    const promptText = `
Listen to the user's spoken audio carefully.
The user is speaking to Achu AI (created by Adithyan with Love and Peace).
Language may be Malayalam, Manglish, English, Hindi, or Tamil.

TASKS:
1. Transcribe the user's spoken question accurately in "question".
   - If asked who made you, note: "Achu AI, created by Adithyan".
2. Provide a direct, conversational spoken answer in the EXACT SAME LANGUAGE and tone in "answer".
3. Return valid JSON:
{
  "question": "transcribed question",
  "answer": "spoken response",
  "detectedLanguage": "ml" | "en" | "hi" | "ta",
  "languageName": "Malayalam" | "English" | "Manglish" | etc.,
  "mood": "happy" | "thinking" | "chill"
}
`;

    let textOutput = '';
    let lastError: any = null;
    for (const model of GEMINI_FALLBACK_MODELS) {
      try {
        const response = await getGemini().models.generateContent({
          model,
          contents: { parts: [audioPart, { text: promptText }] },
          config: { responseMimeType: 'application/json', temperature: 0.7 },
        });
        textOutput = response.text || '';
        if (textOutput) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Voice query model ${model} failed (${err?.message})`);
      }
    }
    if (!textOutput) throw lastError || new Error('Failed to process voice query');

    const parsed = parseAIOutput(textOutput);
    return Response.json({
      question: parsed.question || 'ചോദ്യം കേട്ടു',
      answer: parsed.answer,
      detectedLanguage: parsed.detectedLanguage,
      languageName: parsed.languageName,
      mood: parsed.mood,
    });
  } catch (err: any) {
    console.error('Error in /api/voice-query:', err?.message || err);
    return Response.json(
      {
        error: 'Failed to process voice query',
        question: 'ശബ്ദം വ്യക്തമായില്ല',
        answer: 'ക്ഷമിക്കണം, ശബ്ദം വ്യക്തമായി കേൾക്കാൻ കഴിഞ്ഞില്ല. ദയവായി ഒന്നുകൂടി ചോദിക്കാമോ?',
        detectedLanguage: 'ml',
        languageName: 'Malayalam',
        mood: 'chill',
      },
      { status: 500 },
    );
  }
};

export const config: Config = { path: '/api/voice-query', method: 'POST' };
