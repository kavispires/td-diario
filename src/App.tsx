import { AuthWrapper } from '@layouts/AuthWrapper';
import { queryClient } from '@services/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { LayoutGroup } from 'motion/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthenticatedApp } from './layouts/AuthenticatedApp';

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
