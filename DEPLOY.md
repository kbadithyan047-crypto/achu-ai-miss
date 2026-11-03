# Achu AI - Deploy Guide

This project deploys on **Netlify**. The frontend is built with Vite (`npm run build` → `dist`),
and the `/api/*` routes run as Netlify Functions in `netlify/functions/`.

AI requests go through **Netlify AI Gateway**, so no Gemini/OpenAI API key is needed.
(If you set your own `GEMINI_API_KEY` or `OPENAI_API_KEY` in Netlify environment variables, those are used instead.)

Optional environment variables: `AI_PROVIDER` (auto | gemini | openai), `GEMINI_MODEL`, `OPENAI_MODEL`.

## Local development
```bash
npm install
netlify dev        # http://localhost:8888
```

`server.ts` (the original Express server) is still included for running outside Netlify with `npm start`.

## Test
- `https://YOUR-SITE.netlify.app/api/health` should return `{"status":"ok",...}`.
