import { createContext, useContext, ReactNode } from 'react';
import { AppRouter } from './router';
import { Toaster } from '@ltw/ui/components/ui/sonner';
import { QueryProvider } from '@ltw/shared/react-query';
import { RPCProvider } from '@ltw/shared/rpc';
import { TRPCProvider } from '@ltw/shared/trpc';

export type AppConfig = {
  client: 'desktop.ltw' | 'app.ltw';
  commitSHA?: string;
  isDev: boolean;
  backendURL: string;
  webURL?: string;
};

const AppContext = createContext<(AppConfig & { isDesktop: boolean }) | undefined>(undefined);

export const AppProvider: React.FC<{ config: AppConfig; children: ReactNode }> = (props) => {
  const { children, config } = props;
  return (
    <AppContext.Provider value={{ ...config, isDesktop: config.client === 'desktop.ltw' }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};

interface Props {
  config: AppConfig;
}

export default function App(props: Props) {
  const rpcURL = props.config.backendURL + '/api';
  const trpcURL = props.config.backendURL + '/trpc';

  return (
    <>
      <AppProvider {...props}>
        <QueryProvider>
          <RPCProvider url={rpcURL}>
            <TRPCProvider url={trpcURL}>
              <AppRouter />
            </TRPCProvider>
          </RPCProvider>
        </QueryProvider>
      </AppProvider>

      <Toaster />
    </>
  );
}
