import { GameStatsList } from '@components/profile/GameStatsList';
import { MilestonesSection } from '@components/profile/MilestonesSection';
import { ProfileHeader } from '@components/profile/ProfileHeader';
import { StatsSummary } from '@components/profile/StatsSummary';
import { StreakCard } from '@components/profile/StreakCard';
import { Text } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { useGetDailyUserData } from '@hooks/useGetDailyUserData';
import { LoadingScreen } from '@screens/states/LoadingScreen';
import { getMilestoneStatuses } from '@utils/milestones';
import { computeProfileStats } from '@utils/profileStats';

const TOTAL_GAME_COUNT = Object.keys(gameInfos).length;

/**
 * Renders the user's profile: their avatar and join date, streaks, overall
 * stats, milestone badges, and per-game stats.
 *
 * @returns The rendered profile screen element.
 */
export function ProfileScreen() {
  const { data: dailyUser, isLoading } = useGetDailyUserData();

  if (isLoading || !dailyUser) {
    return <LoadingScreen message="Carregando perfil..." />;
  }

  const stats = computeProfileStats(dailyUser);
  const milestones = getMilestoneStatuses(dailyUser, TOTAL_GAME_COUNT);
  const hasPlayed = stats.totalGamesPlayed > 0;

  return (
    <div className="flex flex-col gap-5 pb-24">
      <ProfileHeader dailyUser={dailyUser} />

      <StreakCard
        currentStreak={dailyUser.currentStreak}
        longestStreak={dailyUser.longestStreak}
      />

      {hasPlayed ? (
        <>
          <StatsSummary
            stats={stats}
            totalGameCount={TOTAL_GAME_COUNT}
          />

          <MilestonesSection milestones={milestones} />

          <GameStatsList perGameStats={stats.perGameStats} />
        </>
      ) : (
        <div className="flex flex-col items-center gap-1 py-6 text-center">
          <Text strong>Você ainda não jogou nenhum jogo.</Text>
          <Text type="secondary">
            Volte para o Hub e jogue seu primeiro desafio do dia!
          </Text>
        </div>
      )}
    </div>
  );
}
