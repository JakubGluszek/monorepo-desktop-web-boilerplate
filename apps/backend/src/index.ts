import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';

import { api } from './api';
import { createTRPCContext } from './trpc';
import { appRouter } from './trpc/root';

const app = new Hono()
  .use(
    cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:4321',
        'http://localhost:4173',
        'http://localhost:5173',
        'http://192.168.2.56:3000',
        'http://192.168.2.56:4321',
        'http://192.168.2.56:4173',
        'http://192.168.2.56:5173',
        'https://logtheway.com',
        'https://dev.logtheway.com',
        'https://app.logtheway.com',
        'https://app.dev.logtheway.com'
      ],
      credentials: true
    })
  )
  .route('/api', api)
  .use('/trpc/*', trpcServer({ router: appRouter, createContext: createTRPCContext }));

app.onError((_, c) => {
  return c.json({ error: 'Internal Server Error' }, 500);
});

export { type ApiRouter } from './api';
export { type AppRouter } from './trpc/root';

export default {
  fetch: app.fetch,
  port: 8000
};
