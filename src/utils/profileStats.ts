import type { GameInfo } from 'types/puzzles';
import type { DailyUser, GameStat } from 'types/user';

/**
 * A single game's stats, augmented with its `gameKey` for display, used by
 * {@link computeProfileStats}'s `perGameStats` list.
 */
export type ProfileGameStat = GameStat & {
  /**
   * The game's short key (see `GameInfo.key`, e.g. `'CNX'`), matching the
   * key it was stored under in `DailyUser.stats` (see
   * `recordGameCompletion`'s call sites). Look up the full `GameInfo` via
   * `findByGameKey`.
   */
  gameKey: string;
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
   * The key (see `GameInfo.key`) of the most-played game, or `null` when
   * nothing has been played yet. Ties are broken by whichever game
   * appears first in `DailyUser.stats`'s insertion order.
   */
  favoriteGameKey: string | null;
  /**
   * Every played game's stats, sorted by `timesPlayed` descending.
   */
  perGameStats: ProfileGameStat[];
};

/**
 * Release stages excluded from the "games explored" denominator: games
 * that aren't out yet, are pulled, or are only a demo.
 */
const UNEXPLORABLE_RELEASE_STAGES: ReadonlySet<GameInfo['release']> = new Set([
  'soon',
  'disabled',
  'demo',
]);

/**
 * Whether a game should count toward the "games explored" total: its
 * `releaseDate` has passed and its `release` stage isn't `'soon'`,
 * `'disabled'`, or `'demo'`.
 *
 * @param info - The game's `GameInfo`, as found in `gameInfos`.
 * @param today - Today's date (`YYYY-MM-DD`), e.g. from `getToday()`.
 * @returns `true` when the game counts toward the total.
 */
export function isGameExplorable(info: GameInfo, today: string): boolean {
  return (
    info.releaseDate < today && !UNEXPLORABLE_RELEASE_STAGES.has(info.release)
  );
}

/**
 * Computes {@link ProfileStats} from a `DailyUser`'s `stats` map.
 *
 * @param dailyUser - The user's current `DailyUser` document.
 * @returns The derived aggregate and per-game statistics.
 */
export function computeProfileStats(dailyUser: DailyUser): ProfileStats {
  const perGameStats = Object.entries(dailyUser.stats)
    .map(([gameKey, stat]) => ({
      ...stat,
      gameKey,
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
    favoriteGameKey: perGameStats[0]?.gameKey ?? null,
    perGameStats,
  };
}
