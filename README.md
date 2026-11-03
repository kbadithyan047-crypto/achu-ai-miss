# Achu AI — Love and Peace

Multilingual (Malayalam / English / Hindi / Tamil / Manglish) voice AI assistant
with an offline Plus One Physics class (Units & Measurements). Created by Adithyan.

- Frontend: React 19 + Vite + Tailwind 4 (installable PWA)
- Backend: Express (`server.ts`) calling Google Gemini (optional OpenAI fallback)

**To publish it as a website (so it works on your phone), read [DEPLOY.md](./DEPLOY.md).**

Quick local run:

```bash
npm install
cp .env.example .env     # add your GEMINI_API_KEY
npm run dev              # http://localhost:3000
```
