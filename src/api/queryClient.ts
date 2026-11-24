import { QueryClient } from '@tanstack/react-query';

/**
 * Central TanStack QueryClient configured with production-grade defaults.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data fresh for 5 minutes
      gcTime: 1000 * 60 * 15,    // Cache garbage collected after 15 minutes
      retry: (failureCount, error: unknown) => {
        const status = (error as { statusCode?: number })?.statusCode;
        // Do not retry on 401, 403, or 404
        if (status === 401 || status === 403 || status === 404) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, // Prevent jarring refetches
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 0,
    },
  },
});
