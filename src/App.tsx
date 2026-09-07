import { AuthWrapper } from '@layouts/AuthWrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LayoutGroup } from 'motion/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthenticatedApp } from './layouts/AuthenticatedApp';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LayoutGroup id="app">
          <AuthWrapper>
            <AuthenticatedApp />
          </AuthWrapper>
        </LayoutGroup>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
