import { Hono } from 'hono';

export const api = new Hono().get('/health', async (c) => {
  return c.json({ message: 'Ok' }, 200);
});

export type ApiRouter = typeof api;
