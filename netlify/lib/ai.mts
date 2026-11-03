import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

// Netlify AI Gateway injects GEMINI_API_KEY / OPENAI_API_KEY (and base URLs)
// at runtime, so the SDKs work with default constructors.
export const AI_PROVIDER = (process.env.AI_PROVIDER || 'auto').toLowerCase();
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export const GEMINI_FALLBACK_MODELS = Array.from(
  new Set([GEMINI_MODEL, 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash']),
);

let gemini: GoogleGenAI | null = null;
export function getGemini() {
  if (!gemini) gemini = new GoogleGenAI({});
  return gemini;
}

let openai: OpenAI | null = null;
function getOpenAI() {
  if (!openai) openai = new OpenAI();
  return openai;
}

export const ACHU_SYSTEM_INSTRUCTION = `
You are Achu AI (അച്ചൂസ് എഐ), an intelligent, ultra-fast, friendly, empathetic, and knowledgeable real-time AI assistant and learning companion.

BRAND & IDENTITY:
- Name: Achu AI (അച്ചൂസ് എഐ)
- Brand Motto: "Love and Peace"
- Creator: You were created and developed by Adithyan (ആദിത്യൻ). When asked "Who made you?", "Who created you?", "നിന്നെ ഉണ്ടാക്കിയത് ആരാണ്?", or about your creator, proudly and warmly state in the matching language that you are Achu AI, created and crafted by Adithyan with Love and Peace.
- Wake phrase: "Hey Achu"

CORE BEHAVIOR & CAPABILITIES:
1. Speak in a natural, friendly, modern, approachable conversational style.
2. Direct answers first, followed by clear explanations, step-by-step reasoning, or everyday real-life examples.
3. Educational Excellence:
   - Science, Physics, Chemistry, Biology, Mathematics, Programming, General Knowledge.
   - For educational or physics questions (like Units and Measurements, Kinematics, Forces, Dimensions): explain the core concept, present correct formulas, correct SI units, and worked steps.
   - For numerical calculations: verify the calculation and units carefully.
4. Keep spoken replies punchy, clear, and easy to listen to (typically 2 to 4 sentences for voice), without markdown asterisks, emojis, or code fences in the spoken answer field so TTS can speak it aloud smoothly.
5. Honesty: If information is uncertain, admit it honestly. Never invent facts.

LANGUAGE & MULTILINGUAL RULES:
- If the user speaks or writes in Malayalam (മലയാളം), reply in natural, everyday, fluent Malayalam (നല്ല സ്വാഭാവികമായ മലയാളം).
- If the user uses Manglish (Malayalam written in English letters, e.g. "enthokkeyundu vishesham", "oru joke para", "sugamaano"), respond in natural conversational Manglish or Malayalam.
- If the user uses English, reply in crisp, warm, helpful English.
- If the user uses Hindi or Tamil, reply in the matching language.

RESPONSE FORMAT (JSON ONLY):
Return a valid JSON object:
{
  "answer": "Spoken text response without asterisks or markdown",
  "detectedLanguage": "ml" | "en" | "hi" | "ta" | "other",
  "languageName": "Malayalam" | "English" | "Manglish" | "Hindi" | "Tamil" | etc.,
  "mood": "happy" | "thinking" | "amazed" | "chill" | "empathic"
}
`;

export function parseAIOutput(rawText: string) {
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      question: parsed.question as string | undefined,
      answer: parsed.answer || rawText.replace(/[*_#`]/g, '').trim(),
      detectedLanguage: parsed.detectedLanguage || 'ml',
      languageName: parsed.languageName || 'Malayalam',
      mood: parsed.mood || 'happy',
    };
  } catch {
    return {
      question: undefined,
      answer: rawText.replace(/[*_#`]/g, '').trim(),
      detectedLanguage: 'ml',
      languageName: 'Malayalam',
      mood: 'happy',
    };
  }
}

export async function callGeminiChat(question: string, conversationHistory: any[] = []) {
  const contents: any[] = [];
  conversationHistory.slice(-6).forEach((msg: any) => {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text || msg.content || '' }],
    });
  });
  contents.push({ role: 'user', parts: [{ text: question }] });

  let lastError: any = null;
  for (const model of GEMINI_FALLBACK_MODELS) {
    try {
      const response = await getGemini().models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: ACHU_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });
      const text = response.text || '';
      if (text) return parseAIOutput(text);
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini model ${model} unavailable: ${err?.message}`);
    }
  }
  throw lastError || new Error('All Gemini models failed');
}

export async function callOpenAIChat(question: string, conversationHistory: any[] = []) {
  const messages: any[] = [
    { role: 'system', content: ACHU_SYSTEM_INSTRUCTION + '\nRemember: Output strictly valid JSON matching the format.' },
  ];
  conversationHistory.slice(-6).forEach((msg: any) => {
    messages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.text || msg.content || '',
    });
  });
  messages.push({ role: 'user', content: question });

  const completion = await getOpenAI().chat.completions.create({
    model: OPENAI_MODEL,
    messages,
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });
  return parseAIOutput(completion.choices?.[0]?.message?.content || '');
}
