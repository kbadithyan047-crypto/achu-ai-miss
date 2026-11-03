import type { Config } from '@netlify/functions';

export default async (req: Request) => {
  try {
    const params = new URL(req.url).searchParams;
    const rawText = String(params.get('text') || '').trim();
    const rawLang = String(params.get('lang') || 'ml').toLowerCase();

    if (!rawText) return new Response('Text is required', { status: 400 });

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
      return new Response('Failed to generate audio', { status: 500 });
    }

    const fullAudio = Buffer.concat(audioBuffers);
    return new Response(fullAudio, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(fullAudio.length),
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: any) {
    console.error('Error in /api/tts-audio:', err?.message || err);
    return new Response('TTS Audio streaming error', { status: 500 });
  }
};

export const config: Config = { path: '/api/tts-audio', method: 'GET' };
