import { QueryClient } from '@tanstack/react-query';

/**
 * Shared React Query client, used both by `App.tsx` (as the
 * `QueryClientProvider`'s client) and by non-component service code (e.g.
 * `services/dailyUser.ts`) that needs to read or optimistically update
 * cached query data without going through a hook.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
