import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '15mb' }));

// Configurable environment variables
const AI_PROVIDER = (process.env.AI_PROVIDER || 'auto').toLowerCase();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// Initialize Gemini Client safely if key is available
let geminiClient: GoogleGenAI | null = null;
if (GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'achu-ai-assistant',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Gemini client:', err);
  }
}

const ACHU_SYSTEM_INSTRUCTION = `
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

// Helper: Call Gemini for chat
async function callGeminiChat(question: string, conversationHistory: any[] = []) {
  if (!geminiClient) throw new Error('Gemini API key is not configured');

  const contents: any[] = [];

  // Add conversation history
  conversationHistory.slice(-6).forEach((msg: any) => {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text || msg.content || '' }],
    });
  });

  contents.push({
    role: 'user',
    parts: [{ text: question }],
  });

  const candidateModels = [GEMINI_MODEL, 'gemini-3.5-flash', 'gemini-3.1-flash-lite-preview', 'gemini-3.8-flash'];
  let textOutput = '';
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await geminiClient.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: ACHU_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });
      textOutput = response.text || '';
      if (textOutput) break;
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini model ${model} unavailable: ${err?.message}`);
    }
  }

  if (!textOutput) throw lastError || new Error('All Gemini models failed');
  return parseAIOutput(textOutput);
}

// Helper: Call OpenAI for chat
async function callOpenAIChat(question: string, conversationHistory: any[] = []) {
  if (!OPENAI_API_KEY) throw new Error('OpenAI API key is not configured');

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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  return parseAIOutput(content);
}

function parseAIOutput(rawText: string) {
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      answer: parsed.answer || rawText.replace(/[*_#`]/g, '').trim(),
      detectedLanguage: parsed.detectedLanguage || 'ml',
      languageName: parsed.languageName || 'Malayalam',
      mood: parsed.mood || 'happy',
    };
  } catch {
    return {
      answer: rawText.replace(/[*_#`]/g, '').trim(),
      detectedLanguage: 'ml',
      languageName: 'Malayalam',
      mood: 'happy',
    };
  }
}

// Public configuration route (safe, no secrets exposed)
app.get('/api/config', (req, res) => {
  res.json({
    appName: 'Achu AI',
    motto: 'Love and Peace',
    creator: 'Adithyan',
    configuredProvider: AI_PROVIDER,
    hasGeminiKey: Boolean(GEMINI_API_KEY),
    hasOpenAIKey: Boolean(OPENAI_API_KEY),
    geminiModel: GEMINI_MODEL,
    openAIModel: OPENAI_MODEL,
    isOnline: true,
  });
});

// Main Chat Endpoint with Multi-Provider Support
app.post('/api/chat', async (req, res) => {
  try {
    const { question, conversationHistory = [], preferredProvider } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const targetProvider = (preferredProvider || AI_PROVIDER).toLowerCase();
    let result: any = null;
    let usedProvider = 'gemini';

    if (targetProvider === 'openai') {
      if (!OPENAI_API_KEY) {
        return res.status(400).json({
          error: 'OpenAI API key is not configured on the server. Please switch to Gemini or Auto in Settings.',
          answer: 'OpenAI കോൺഫിഗർ ചെയ്തിട്ടില്ല. ദയവായി ക്രമീകരണങ്ങളിൽ Gemini അല്ലെങ്കിൽ Auto തിരഞ്ഞെടുക്കുക.',
          detectedLanguage: 'ml',
        });
      }
      result = await callOpenAIChat(question, conversationHistory);
      usedProvider = 'openai';
    } else if (targetProvider === 'gemini') {
      if (!GEMINI_API_KEY) {
        return res.status(400).json({
          error: 'Gemini API key is not configured on the server.',
          answer: 'Gemini API കീ കോൺഫിഗർ ചെയ്തിട്ടില്ല.',
          detectedLanguage: 'ml',
        });
      }
      result = await callGeminiChat(question, conversationHistory);
      usedProvider = 'gemini';
    } else {
      // Auto mode: Primary Gemini, with OpenAI fallback
      if (GEMINI_API_KEY) {
        try {
          result = await callGeminiChat(question, conversationHistory);
          usedProvider = 'gemini';
        } catch (geminiErr: any) {
          console.warn('Gemini failed in auto mode, trying OpenAI fallback:', geminiErr?.message);
          if (OPENAI_API_KEY) {
            result = await callOpenAIChat(question, conversationHistory);
            usedProvider = 'openai';
          } else {
            throw geminiErr;
          }
        }
      } else if (OPENAI_API_KEY) {
        result = await callOpenAIChat(question, conversationHistory);
        usedProvider = 'openai';
      } else {
        return res.status(503).json({
          error: 'No AI provider API key is configured. Offline Physics Class remains fully available.',
          answer: 'ക്ഷമിക്കണം, AI സേവനം നിലവിൽ സജ്ജീകരിച്ചിട്ടില്ല. എന്നാൽ ഫിസിക്സ് ക്ലാസ്സ് നിങ്ങൾക്ക് പൂർണ്ണമായും ഓഫ്‌ലൈനായി പഠിക്കാവുന്നതാണ്.',
          detectedLanguage: 'ml',
          languageName: 'Malayalam',
          mood: 'chill',
        });
      }
    }

    res.json({
      answer: result.answer,
      detectedLanguage: result.detectedLanguage,
      languageName: result.languageName,
      mood: result.mood,
      provider: usedProvider,
    });
  } catch (err: any) {
    console.error('Error generating chat response:', err?.message || err);
    res.status(500).json({
      error: err?.message || 'Failed to process AI response',
      answer: 'ക്ഷമിക്കണം, കണക്ഷനിൽ ഒരു ചെറിയ തടസ്സം ഉണ്ടായി. ദയവായി വീണ്ടും ചോദിക്കാമോ?',
      detectedLanguage: 'ml',
      languageName: 'Malayalam',
      mood: 'chill',
    });
  }
});

// Direct Audio Speech-to-Answer Endpoint
app.post('/api/voice-query', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    if (!geminiClient) {
      return res.status(503).json({
        error: 'Gemini client is required for audio understanding.',
        question: 'ശബ്ദം ലഭിച്ചു',
        answer: 'ഓഡിയോ പ്രോസസ്സിങ്ങിനായി Gemini API കീ ആവശ്യമാണ്.',
        detectedLanguage: 'ml',
      });
    }

    const cleanMime = (mimeType || 'audio/webm').split(';')[0].trim();
    const audioPart = {
      inlineData: {
        mimeType: cleanMime,
        data: audioBase64,
      },
    };

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

    const candidateModels = [GEMINI_MODEL, 'gemini-3.5-flash', 'gemini-3.1-flash-lite-preview'];
    let textOutput = '';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await geminiClient.models.generateContent({
          model,
          contents: {
            parts: [audioPart, { text: promptText }],
          },
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
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
    res.json({
      question: (parsed as any).question || 'ചോദ്യം കേട്ടു',
      answer: parsed.answer,
      detectedLanguage: parsed.detectedLanguage,
      languageName: parsed.languageName,
      mood: parsed.mood,
    });
  } catch (err: any) {
    console.error('Error in /api/voice-query:', err?.message || err);
    res.status(500).json({
      error: err?.message,
      question: 'ശബ്ദം വ്യക്തമായില്ല',
      answer: 'ക്ഷമിക്കണം, ശബ്ദം വ്യക്തമായി കേൾക്കാൻ കഴിഞ്ഞില്ല. ദയവായി ഒന്നുകൂടി ചോദിക്കാമോ?',
      detectedLanguage: 'ml',
      languageName: 'Malayalam',
      mood: 'chill',
    });
  }
});

// Universal High-Reliability MP3 Audio Stream for Spoken Answers
app.get('/api/tts-audio', async (req, res) => {
  try {
    const rawText = String(req.query.text || '').trim();
    const rawLang = String(req.query.lang || 'ml').toLowerCase();

    if (!rawText) return res.status(400).send('Text is required');

    const cleanText = rawText
      .replace(/[*_#`~[\]]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();

    let langCode = 'ml';
    if (rawLang.startsWith('en')) langCode = 'en';
    else if (rawLang.startsWith('hi')) langCode = 'hi';
    else if (rawLang.startsWith('ta')) langCode = 'ta';
    else if (rawLang.startsWith('te')) langCode = 'te';
    else if (rawLang.startsWith('ml')) langCode = 'ml';
    else langCode = rawLang.slice(0, 2);

    // Split text into speakable sentence chunks under 160 characters
    const chunks: string[] = [];
    const sentences = cleanText.match(/[^.!?\n]+[.!?\n]+/g) || [cleanText];
    let cur = '';

    for (const s of sentences) {
      if ((cur + ' ' + s).length <= 160) {
        cur += (cur ? ' ' : '') + s.trim();
      } else {
        if (cur) chunks.push(cur);
        if (s.length <= 160) {
          cur = s.trim();
        } else {
          const words = s.split(/\s+/);
          cur = '';
          for (const w of words) {
            if ((cur + ' ' + w).length <= 160) {
              cur += (cur ? ' ' : '') + w;
            } else {
              if (cur) chunks.push(cur);
              cur = w;
            }
          }
        }
      }
    }
    if (cur) chunks.push(cur);

    // Fetch MP3 audio buffers for each chunk
    const audioBuffers: Buffer[] = [];
    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${langCode}&client=tw-ob`;
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/',
        },
      });

      if (response.ok) {
        const arrayBuf = await response.arrayBuffer();
        audioBuffers.push(Buffer.from(arrayBuf));
      }
    }

    if (audioBuffers.length === 0) {
      return res.status(500).send('Failed to generate audio');
    }

    const fullAudio = Buffer.concat(audioBuffers);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', fullAudio.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(fullAudio);
  } catch (err: any) {
    console.error('Error in /api/tts-audio:', err?.message || err);
    res.status(500).send('TTS Audio streaming error');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', app: 'Achu AI', motto: 'Love and Peace', timestamp: Date.now() });
});

// Setup Vite in Dev or Static files in Production
const distPath = path.join(__dirname, 'dist');
const hasDist = fs.existsSync(distPath);
const isProduction = process.env.NODE_ENV === 'production' || hasDist;
const PORT = Number(process.env.PORT) || 3000;

// Explicit PWA Service Worker & Manifest routes with guaranteed MIME types
app.get('/sw.js', (req, res) => {
  const filePath = hasDist && fs.existsSync(path.join(distPath, 'sw.js'))
    ? path.join(distPath, 'sw.js')
    : path.join(__dirname, 'public', 'sw.js');
  res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
  res.setHeader('Service-Worker-Allowed', '/');
  res.sendFile(filePath);
});

app.get('/registerSW.js', (req, res) => {
  const filePath = hasDist && fs.existsSync(path.join(distPath, 'registerSW.js'))
    ? path.join(distPath, 'registerSW.js')
    : path.join(__dirname, 'public', 'registerSW.js');
  res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
  res.sendFile(filePath);
});

app.get('/manifest.webmanifest', (req, res) => {
  const filePath = hasDist && fs.existsSync(path.join(distPath, 'manifest.webmanifest'))
    ? path.join(distPath, 'manifest.webmanifest')
    : path.join(__dirname, 'public', 'manifest.webmanifest');
  res.setHeader('Content-Type', 'application/manifest+json; charset=UTF-8');
  res.sendFile(filePath);
});

async function startServer() {
  if (isProduction && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Achu AI Server running on http://0.0.0.0:${PORT} [Provider: ${AI_PROVIDER}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
