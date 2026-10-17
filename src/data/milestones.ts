import { Flame, Gem, Medal, Rocket, Sparkles, Trophy } from 'lucide-react';
import type { MilestoneDefinition } from 'types/milestones';

/**
 * Sums `timesPlayed` across every game in a `DailyUser.stats` map.
 *
 * @param dailyUser - The user's current `DailyUser` document.
 * @returns The total number of games played, across all games.
 */
function totalGamesPlayed(dailyUser: {
  stats: Record<string, { timesPlayed: number }>;
}): number {
  return Object.values(dailyUser.stats).reduce(
    (sum, stat) => sum + stat.timesPlayed,
    0,
  );
}

/**
 * Hand-written list of achievements players can earn, evaluated against
 * their `DailyUser`. Order is display order (earned-or-not aside).
 */
export const MILESTONES: MilestoneDefinition[] = [
  {
    id: 'first-game',
    icon: Rocket,
    title: 'Primeiro Passo',
    description: 'Jogue seu primeiro jogo.',
    check: (dailyUser) => totalGamesPlayed(dailyUser) >= 1,
  },
  {
    id: 'streak-7',
    icon: Flame,
    title: 'Semana Completa',
    description: 'Alcance uma sequência de 7 dias.',
    check: (dailyUser) => dailyUser.longestStreak >= 7,
  },
  {
    id: 'streak-30',
    icon: Sparkles,
    title: 'Mês Dedicado',
    description: 'Alcance uma sequência de 30 dias.',
    check: (dailyUser) => dailyUser.longestStreak >= 30,
  },
  {
    id: 'games-50',
    icon: Medal,
    title: 'Maratonista',
    description: 'Jogue 50 partidas no total.',
    check: (dailyUser) => totalGamesPlayed(dailyUser) >= 50,
  },
  {
    id: 'games-100',
    icon: Trophy,
    title: 'Centena',
    description: 'Jogue 100 partidas no total.',
    check: (dailyUser) => totalGamesPlayed(dailyUser) >= 100,
  },
  {
    id: 'all-games',
    icon: Gem,
    title: 'Explorador',
    description: 'Jogue todos os jogos do TD Diário pelo menos uma vez.',
    check: (dailyUser, totalGameCount) =>
      totalGameCount > 0 &&
      Object.keys(dailyUser.stats).length >= totalGameCount,
  },
];
