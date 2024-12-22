import { useRpcClient } from '@ltw/shared/rpc';
import { trpc } from '@ltw/shared/trpc';
import { useQuery } from '@tanstack/react-query';

export default function Page() {
  const rpc = useRpcClient();

  // Test /trpc health
  trpc.health.check.useQuery();

  // Test /api/health
  useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await rpc.health.$get();
      if (!res.ok) {
        throw new Error('Failed to authorize session');
      }
      const session = await res.json();
      return session;
    },
    staleTime: 5 * (60 * 1000),
    gcTime: 10 * (60 * 1000),
    refetchOnWindowFocus: true,
    retry: false
  });

  return <div className="p-4 text-muted-foreground">Work in progress. Come back soon ^^</div>;
}
