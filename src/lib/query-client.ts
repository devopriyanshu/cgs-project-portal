// src/lib/query-client.ts

import { QueryClient } from '@tanstack/react-query';
import type { NormalizedError } from '@/lib/api/error-handler';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // 5 minutes
      gcTime: 1000 * 60 * 30,          // 30 minutes
      refetchOnWindowFocus: true,
      retry: (failureCount, error: unknown) => {
        const err = error as NormalizedError;
        if (err?.status >= 400 && err?.status < 500) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
