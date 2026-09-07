import { useGetDailyUserData } from '@hooks/useGetDailyUserData';
import { MainContent } from '@layouts/MainContent';
import { LoadingScreen } from '@screens/LoadingScreen';
import { LoginScreen } from '@screens/LoginScreen';
import { useAuthStore } from '@store/useAuthStore';
import { type ReactNode, useEffect } from 'react';

type AuthWrapperProps = {
  children: ReactNode;
};

export function AuthWrapper({ children }: AuthWrapperProps) {
  // 1. Verify Auth
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const user = useAuthStore((state) => state.user);
  const initAuthListener = useAuthStore((state) => state.initAuthListener);
  const {
    isLoading: isDailyUserLoading,
    isError: isDailyUserError,
    error: dailyUserError,
  } = useGetDailyUserData();

  useEffect(() => {
    // This tells Firebase to start watching the session instantly
    initAuthListener();
  }, [initAuthListener]);

  useEffect(() => {
    // isLoading turns false on error too, so log it or it fails silently
    if (isDailyUserError) {
      console.log(
        'AuthWrapper: failed to load daily user data',
        dailyUserError,
      );
    }
  }, [isDailyUserError, dailyUserError]);

  // 2. If not logged in => Login Screen

  // 3. Fetch DailyUser

  // 4. Redirect to unfinished game if needed

  // While verifying auth
  if (isAuthLoading) {
    return <LoadingScreen message="Verificando autenticação..." />;
  }

  if (!user) {
    return (
      <MainContent fullscreen>
        <LoginScreen />
      </MainContent>
    );
  }

  // While verifying DailyUser
  if (isDailyUserLoading) {
    return <LoadingScreen message="Carregando dados do usuário..." />;
  }

  return <>{children}</>;
}
