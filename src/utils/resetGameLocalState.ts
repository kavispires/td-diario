import {
  clearLocalToday,
  gameIdToLocalTodayKey,
} from '@hooks/useDailyLocalToday';
import { useUserPreferencesStore } from '@store/useUserPreferencesStore';

/**
 * Dev-only utility that clears a game's locally-persisted "today" state
 * (e.g. hearts, revealed tiles, found counts, flips, status), and also
 * clears `useUserPreferencesStore`'s `ongoingGame` if it currently points
 * at that game, so a stale redirect doesn't immediately reopen it.
 *
 * @param gameId - Kebab-case game id, matching a `GameInfo.id` from `gameInfos`.
 */
export function resetGameLocalState(gameId: string): void {
  clearLocalToday(gameIdToLocalTodayKey(gameId));

  const { ongoingGame, setOngoingGame } = useUserPreferencesStore.getState();
  if (ongoingGame === gameId) {
    setOngoingGame(null);
  }
}
