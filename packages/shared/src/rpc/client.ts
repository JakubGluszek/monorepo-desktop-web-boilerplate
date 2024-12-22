import { type ClientRequestOptions, hc } from 'hono/client';
import type { ApiRouter } from 'backend';

export const createClient = (url: string, options: ClientRequestOptions) => {
  const { init, headers } = options;
  return hc<ApiRouter>(url, {
    init: init ?? {
      credentials: 'include'
    },
    headers: headers
  });
};

export type ClientType = ReturnType<typeof createClient>;
