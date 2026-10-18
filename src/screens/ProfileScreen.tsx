import { GameStatsList } from '@components/profile/GameStatsList';
import { MilestonesSection } from '@components/profile/MilestonesSection';
import { ProfileHeader } from '@components/profile/ProfileHeader';
import { StatsSummary } from '@components/profile/StatsSummary';
import { StreakCard } from '@components/profile/StreakCard';
import { Text } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { useGetDailyUserData } from '@hooks/useGetDailyUserData';
import { LoadingScreen } from '@screens/states/LoadingScreen';
import { getToday } from '@utils/helpers';
import { getMilestoneStatuses } from '@utils/milestones';
import { computeProfileStats, isGameExplorable } from '@utils/profileStats';

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

  // Recomputed per render (rather than once at module load) so it stays
  // accurate if a game's release date arrives while the app stays open.
  const today = getToday();
  const totalGameCount = Object.values(gameInfos).filter((info) =>
    isGameExplorable(info, today),
  ).length;

  const stats = computeProfileStats(dailyUser);
  const milestones = getMilestoneStatuses(dailyUser, totalGameCount);
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
            totalGameCount={totalGameCount}
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
