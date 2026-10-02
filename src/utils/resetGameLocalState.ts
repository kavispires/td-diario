import { clearLocalToday } from '@hooks/useDailyLocalToday';
import { useUserPreferencesStore } from '@store/useUserPreferencesStore';
import type { GameInfo } from 'types/puzzles';

/**
 * Dev-only utility that clears a game's locally-persisted "today" state
 * (e.g. hearts, revealed tiles, found counts, flips, status), and also
 * clears `useUserPreferencesStore`'s `ongoingGame` if it currently points
 * at that game, so a stale redirect doesn't immediately reopen it.
 *
 * @param gameInfo - The game's `GameInfo`, as found in `gameInfos`.
 */
export function resetGameLocalState(gameInfo: GameInfo): void {
  clearLocalToday(gameInfo.key);

  const { ongoingGame, setOngoingGame } = useUserPreferencesStore.getState();
  if (ongoingGame === gameInfo.id) {
    setOngoingGame(null);
  }
}
