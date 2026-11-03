import type { Config } from '@netlify/functions';

export default async () =>
  Response.json({ status: 'ok', app: 'Achu AI', motto: 'Love and Peace', timestamp: Date.now() });

export const config: Config = { path: '/api/health' };
