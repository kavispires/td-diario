import { useGetDailyChallenges } from '@hooks/useGetDailyChallenges';
import { ErrorScreen } from '@screens/ErrorScreen';
import { LoadingScreen } from '@screens/LoadingScreen';
import { useUserPreferencesStore } from '@store/useUserPreferencesStore';
import { Navigate } from 'react-router-dom';
import { AppLayout } from './AppLayout';

export function AuthenticatedApp() {
  const { isPending, isError } = useGetDailyChallenges();
  const ongoingGame = useUserPreferencesStore((state) => state.ongoingGame);

  if (isPending) {
    return <LoadingScreen message="Carregando desafios..." />;
  }

  if (isError) {
    return <ErrorScreen />;
  }

  if (ongoingGame) {
    return (
      <Navigate
        to={`/game/${ongoingGame}`}
        replace
      />
    );
  }

  return <AppLayout />;
}
