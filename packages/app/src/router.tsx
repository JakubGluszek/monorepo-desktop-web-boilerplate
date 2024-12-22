import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserHistory,
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter as createRouterFn
} from '@tanstack/react-router';

import '@ltw/shared/types/global';
import { QueryClient } from '@tanstack/react-query';

import HomePage from './routes/home/index';

import RootRoute from './routes/root';
import { useApp } from './App';
import { useQueryClient } from '@ltw/shared/react-query';

const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootRoute,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  }
});

export const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: () => {
    return <Outlet />;
  }
});

// Actual pages

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

// Assemble the route tree
const routeTree = rootRoute.addChildren([indexRoute]);

function useAppRouter() {
  const queryClient = useQueryClient();
  const { isDesktop } = useApp();

  const history = isDesktop
    ? createMemoryHistory({
      initialEntries: ['/']
    })
    : createBrowserHistory();

  return createRouterFn({
    routeTree,
    history,
    defaultPreload: 'intent',
    // Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    defaultPreloadStaleTime: 0,
    context: {
      queryClient
    }
  });
}

export function AppRouter() {
  const router = useAppRouter();
  return <RouterProvider router={router} />;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof useAppRouter>;
  }
}
