import { createCallerFactory, createTRPCRouter, publicProcedure } from '.';

/**
 * This is the primary router for your server.
 */
export const appRouter = createTRPCRouter({
  health: createTRPCRouter({
    check: publicProcedure.query(async () => {
      return { message: 'Ok' };
    })
  })
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
