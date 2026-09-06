import { AuthWrapper } from '@layouts/AuthWrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LayoutGroup } from 'motion/react';
import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
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
            <AppLayout />
          </AuthWrapper>
        </LayoutGroup>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
