import { useGetDailyUserData } from '@hooks/useGetDailyUserData';
import { MainContent } from '@layouts/MainContent';
import { ErrorScreen } from '@screens/ErrorScreen';
import { LoadingScreen } from '@screens/LoadingScreen';
import { LoginScreen } from '@screens/LoginScreen';
import { useAuthStore } from '@store/useAuthStore';
import { print } from '@utils/helpers';
import { type ReactNode, useEffect } from 'react';

type AuthWrapperProps = {
  children: ReactNode;
};

export function AuthWrapper({ children }: AuthWrapperProps) {
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const user = useAuthStore((state) => state.user);
  const initAuthListener = useAuthStore((state) => state.initAuthListener);
  const {
    isLoading: isDailyUserLoading,
    isError: isDailyUserError,
    // error: dailyUserError,
  } = useGetDailyUserData();

  useEffect(() => {
    // This tells Firebase to start watching the session instantly
    print('Initializing auth listener...', 'count');
    initAuthListener();
  }, [initAuthListener]);

  // While verifying auth
  if (isAuthLoading) {
    return <LoadingScreen message="Verificando autenticação..." />;
  }

  // User is not authenticated
  if (!user) {
    return (
      <MainContent fullscreen>
        <LoginScreen />
      </MainContent>
    );
  }

  // While fetching DailyUser
  if (isDailyUserLoading) {
    return <LoadingScreen message="Carregando dados do usuário..." />;
  }

  // Daily user error
  if (isDailyUserError) {
    return (
      <MainContent fullscreen>
        <ErrorScreen message="Erro ao carregar dados do usuário." />
      </MainContent>
    );
  }

  return <MainContent>{children}</MainContent>;
}
