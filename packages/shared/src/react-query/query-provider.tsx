import {
  QueryClient,
  QueryClientProvider,
  useQueryClient as tanstackUseQueryClient
} from '@tanstack/react-query';
import { createContext, useContext, type ReactNode } from 'react';

import { createQueryClient } from './query-client';

// Singleton instance for the client-side QueryClient
let clientQueryClientSingleton: QueryClient | undefined = undefined;

export const getQueryClient = () => {
  return (clientQueryClientSingleton ??= createQueryClient());
};

// Define the context and provider
const QueryContext = createContext<QueryClient | undefined>(undefined);

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryContext.Provider value={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </QueryContext.Provider>
  );
}

// Custom hook to access the QueryClient
export const useQueryClient = () => {
  const queryClient = useContext(QueryContext) ?? tanstackUseQueryClient();

  if (!queryClient) {
    throw new Error('useQueryClient must be used within a QueryProvider');
  }

  return queryClient;
};
