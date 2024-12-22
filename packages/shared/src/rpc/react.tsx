import { createContext, useContext, useMemo } from 'react';

import { createClient, type ClientType } from './client';

interface RpcClientContextProps {
  rpc: ClientType;
}

const RpcClientContext = createContext<RpcClientContextProps | undefined>(undefined);

export const RPCProvider: React.FC<{
  children: React.ReactNode;
  url: string;
}> = ({ children, url }) => {
  const rpc = useMemo(() => createClient(url, {}), [url]);

  return <RpcClientContext.Provider value={{ rpc }}> {children}</RpcClientContext.Provider>;
};

export const useRpcClient = () => {
  const context = useContext(RpcClientContext);
  if (!context) {
    throw new Error('useRpcClient must be used within a RPCProvider');
  }
  return context.rpc;
};
