import { type ReactNode, useCallback } from 'react';
import SuperJSON from 'superjson';
import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { createTRPCReact } from '@trpc/react-query';

import { type AppRouter } from 'backend';

import { useQueryClient } from '../react-query/query-provider';

export const trpc: ReturnType<typeof createTRPCReact<AppRouter>> = createTRPCReact<AppRouter>();

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

interface TRPCProviderProps {
  children: ReactNode;
  url: string;
}

export function TRPCProvider({ children, url }: TRPCProviderProps) {
  const queryClient = useQueryClient();

  const createClient = useCallback(
    () =>
      trpc.createClient({
        links: [
          loggerLink({
            enabled: (op) =>
              process.env.NODE_ENV === 'development' ||
              (op.direction === 'down' && op.result instanceof Error)
          }),
          unstable_httpBatchStreamLink({
            transformer: SuperJSON,
            url,
            fetch(url, options) {
              return fetch(url, {
                ...options,
                credentials: 'include'
              });
            }
          })
        ]
      }),
    []
  );

  const trpcClient = createClient();

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
}
