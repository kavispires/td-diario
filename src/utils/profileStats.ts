import type { DailyUser, GameStat } from 'types/user';

/**
 * A single game's stats, augmented with its `gameId` for display, used by
 * {@link computeProfileStats}'s `perGameStats` list.
 */
export type ProfileGameStat = GameStat & {
  /**
   * The game's id (see `GameInfo.id`), matching the key it was stored
   * under in `DailyUser.stats`.
   */
  gameId: string;
  /**
   * This game's win rate, from `0` to `100`, rounded to the nearest whole
   * percent. `0` when the game has never been completed.
   */
  winRatePercent: number;
};

/**
 * Aggregate, derived statistics computed from a `DailyUser` for display on
 * the Profile screen.
 */
export type ProfileStats = {
  /**
   * Sum of `timesPlayed` across every game in `DailyUser.stats`.
   */
  totalGamesPlayed: number;
  /**
   * Number of distinct games the user has played at least once.
   */
  distinctGamesPlayed: number;
  /**
   * Sum of `wins` across every game in `DailyUser.stats`.
   */
  totalWins: number;
  /**
   * Sum of `losses` across every game in `DailyUser.stats`.
   */
  totalLosses: number;
  /**
   * Overall win rate across every game, from `0` to `100`, rounded to the
   * nearest whole percent. `0` when nothing has been played yet.
   */
  winRatePercent: number;
  /**
   * The id of the most-played game, or `null` when nothing has been
   * played yet. Ties are broken by whichever game appears first in
   * `DailyUser.stats`'s insertion order.
   */
  favoriteGameId: string | null;
  /**
   * Every played game's stats, sorted by `timesPlayed` descending.
   */
  perGameStats: ProfileGameStat[];
};

/**
 * Computes {@link ProfileStats} from a `DailyUser`'s `stats` map.
 *
 * @param dailyUser - The user's current `DailyUser` document.
 * @returns The derived aggregate and per-game statistics.
 */
export function computeProfileStats(dailyUser: DailyUser): ProfileStats {
  const perGameStats = Object.entries(dailyUser.stats)
    .map(([gameId, stat]) => ({
      ...stat,
      gameId,
      winRatePercent:
        stat.timesPlayed > 0
          ? Math.round((stat.wins / stat.timesPlayed) * 100)
          : 0,
    }))
    .sort((a, b) => b.timesPlayed - a.timesPlayed);

  const totalGamesPlayed = perGameStats.reduce(
    (sum, stat) => sum + stat.timesPlayed,
    0,
  );
  const totalWins = perGameStats.reduce((sum, stat) => sum + stat.wins, 0);
  const totalLosses = perGameStats.reduce((sum, stat) => sum + stat.losses, 0);

  return {
    totalGamesPlayed,
    distinctGamesPlayed: perGameStats.length,
    totalWins,
    totalLosses,
    winRatePercent:
      totalGamesPlayed > 0
        ? Math.round((totalWins / totalGamesPlayed) * 100)
        : 0,
    favoriteGameId: perGameStats[0]?.gameId ?? null,
    perGameStats,
  };
}
