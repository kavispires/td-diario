import { queryClient } from '@services/queryClient';
import { useAuthStore } from '@store/useAuthStore';
import { getToday } from '@utils/helpers';
import { differenceInCalendarDays } from 'date-fns';
import { doc, updateDoc } from 'firebase/firestore';
import type { DailyUser, GameCompletionStatus, GameStat } from 'types/user';
import { firestore } from './firebase';

/**
 * Computes the next `DailyUser` object after a single game completion,
 * advancing the daily streak at most once per day (on the first game
 * completed that day, regardless of outcome) and updating the per-game
 * `stats` counters.
 *
 * @param current - The user's current, cached `DailyUser`.
 * @param gameId - Kebab-case game id, matching a `GameInfo.id`.
 * @param status - Whether the game was won or lost.
 * @param today - Today's date (`YYYY-MM-DD`).
 * @returns The full, updated `DailyUser` object.
 */
export function buildDailyUserUpdate(
  current: DailyUser,
  gameId: string,
  status: GameCompletionStatus,
  today: string,
): DailyUser {
  // A new day resets today's results instead of merging into a stale day.
  const todayResultsBeforeThisGame =
    current.today.date === today ? current.today.results : {};

  const isFirstCompletionToday =
    Object.keys(todayResultsBeforeThisGame).length === 0;

  let { currentStreak, longestStreak, lastPlayedDate } = current;

  if (isFirstCompletionToday) {
    const isConsecutiveDay =
      current.lastPlayedDate !== '' &&
      differenceInCalendarDays(
        new Date(today),
        new Date(current.lastPlayedDate),
      ) === 1;

    currentStreak = isConsecutiveDay ? current.currentStreak + 1 : 1;
    longestStreak = Math.max(current.longestStreak, currentStreak);
    lastPlayedDate = today;
  }

  const previousStat = current.stats[gameId];
  const nextStat: GameStat = {
    timesPlayed: (previousStat?.timesPlayed ?? 0) + 1,
    wins: (previousStat?.wins ?? 0) + (status === 'win' ? 1 : 0),
    losses: (previousStat?.losses ?? 0) + (status === 'lose' ? 1 : 0),
    lastPlayedDate: today,
  };

  return {
    ...current,
    currentStreak,
    longestStreak,
    lastPlayedDate,
    today: {
      date: today,
      results: { ...todayResultsBeforeThisGame, [gameId]: status },
    },
    stats: { ...current.stats, [gameId]: nextStat },
  };
}

/**
 * Records a single game's completion against the current user's
 * `DailyUser` document: advances their daily streak (at most once per
 * day) and bumps that game's play stats. Performs exactly one Firestore
 * write, then optimistically updates the cached React Query data in
 * place rather than refetching.
 *
 * Silently no-ops if there's no signed-in user or the `DailyUser` hasn't
 * been loaded into the query cache yet (it's always loaded by the Hub
 * before any game can be played). Write failures are logged but otherwise
 * swallowed, since this tracking is purely supplementary to local
 * gameplay state.
 *
 * The duplicate-write guard (`cloudSynced`) lives on the caller's own
 * per-day `GameState` (see `DefaultGameState`) rather than a dedicated
 * localStorage key, so it resets for free every day with the rest of
 * that state instead of accumulating indefinitely.
 *
 * @param gameId - Kebab-case game id, matching a `GameInfo.id`.
 * @param status - Whether the game was won or lost.
 * @param cloudSynced - The caller's current `GameState.cloudSynced` flag;
 *   when truthy, this call no-ops.
 * @param markSynced - Callback that persists `cloudSynced: true` onto the
 *   caller's `GameState` (typically `updateLocalStorage`), called before
 *   the Firestore write to prevent a duplicate in-flight retry.
 */
export async function recordGameCompletion(
  gameId: string,
  status: GameCompletionStatus,
  cloudSynced: boolean | undefined,
  markSynced: () => void,
): Promise<void> {
  if (cloudSynced) return;

  const uid = useAuthStore.getState().user?.uid;
  if (!uid) return;

  const queryKey = ['dailyUser', uid];
  const current = queryClient.getQueryData<DailyUser>(queryKey);
  if (!current) {
    // biome-ignore lint/suspicious/noConsole: supplementary tracking, non-fatal
    console.warn(
      `recordGameCompletion: no cached DailyUser for ${uid}, skipping.`,
    );
    return;
  }

  markSynced();

  const today = getToday();
  const next = buildDailyUserUpdate(current, gameId, status, today);

  try {
    await updateDoc(doc(firestore, 'dailyUsers', uid), {
      currentStreak: next.currentStreak,
      longestStreak: next.longestStreak,
      lastPlayedDate: next.lastPlayedDate,
      today: next.today,
      [`stats.${gameId}`]: next.stats[gameId],
    });
    queryClient.setQueryData(queryKey, next);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: supplementary tracking, non-fatal
    console.warn('recordGameCompletion: failed to persist', error);
  }
}
