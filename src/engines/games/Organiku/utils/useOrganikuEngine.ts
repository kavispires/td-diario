import { useDailyLocalToday } from '@hooks/useDailyLocalToday';
import { playSFX } from '@utils/soundEffects';
import { vibrate } from '@utils/vibrate';
import { useEffect, useMemo, useState } from 'react';
import type { DailyOrganikuEntry } from '../../../../types/games';
import { ORGANIKU_STORAGE_KEY } from './helpers';
import type { GameState, OrganikuTracker, SessionState } from './types';

const INITIAL_SESSION: SessionState = {
  activeTileIndex: null,
  pairActiveTileIndex: null,
};

/**
 * Drives a single day's Organiku game: tile flip/match logic, hearts,
 * win/lose detection, and per-item completion tracking. Persists progress
 * to local storage so a reload doesn't lose it within the same day.
 *
 * @param data - Today's Organiku challenge payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via {@link getInitialState}.
 * @returns Everything the Organiku screen needs to render and interact
 *   with the grid, plus the current completion/result state.
 */
export function useOrganikuEngine(
  data: DailyOrganikuEntry,
  initialState: GameState,
) {
  const [state, setState] = useState<GameState>(initialState);
  const [session, setSession] = useState<SessionState>(INITIAL_SESSION);
  const [showResults, setShowResults] = useState(false);

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: ORGANIKU_STORAGE_KEY,
    dateId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is meant to trigger persistence
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  function updateSession(next: Partial<SessionState>) {
    setSession((prev) => ({ ...prev, ...next }));
  }

  function onActivateTile(index: number) {
    // Tapping the already-flipped tile unselects it.
    if (session.activeTileIndex === index) {
      playSFX('bubbleOut');
      updateSession({ activeTileIndex: null });
      return;
    }

    const flips = state.flips + 1;

    // First tile of a new pair.
    if (session.activeTileIndex === null) {
      updateSession({ activeTileIndex: index });
      setState((prev) => ({ ...prev, flips }));
      playSFX('bubbleIn');
      return;
    }

    // Second tile: show both, then resolve the match after a short delay.
    playSFX('bubbleIn');
    const { activeTileIndex } = session;
    updateSession({ pairActiveTileIndex: index });
    setState((prev) => ({ ...prev, flips }));

    setTimeout(() => {
      const activeItemId = data.grid[activeTileIndex];
      const selectedItemId = data.grid[index];
      const isMatch = activeItemId === selectedItemId;

      updateSession({ activeTileIndex: null, pairActiveTileIndex: null });

      if (isMatch) {
        const isWin =
          Object.keys(state.revealed).length + 2 === data.grid.length;
        playSFX(isWin ? 'win' : 'wee');

        setState((prev) => ({
          ...prev,
          status: isWin ? 'win' : 'in-progress',
          revealed: {
            ...prev.revealed,
            [activeTileIndex]: true,
            [index]: true,
          },
          foundCount: {
            ...prev.foundCount,
            [activeItemId]: (prev.foundCount[activeItemId] || 0) + 2,
          },
        }));
        return;
      }

      const hearts = state.hearts - 1;
      const isLose = hearts <= 0;
      playSFX(isLose ? 'lose' : 'wrong');
      vibrate(isLose ? 'lose' : 'wrong');

      setState((prev) => ({
        ...prev,
        status: isLose ? 'lose' : 'in-progress',
        hearts,
      }));
    }, 750); // Show both tiles for 750ms before resolving the match.
  }

  const tracker = useMemo<OrganikuTracker>(() => {
    const completedItems: Dictionary<boolean> = {};
    const remainingCounts: Dictionary<number> = {};

    for (const itemId of data.itemsIds) {
      completedItems[itemId] = false;
      remainingCounts[itemId] = data.itemsIds.length;
    }

    for (const gridIndex of Object.keys(state.revealed)) {
      const itemId = data.grid[Number(gridIndex)];
      if (itemId) {
        remainingCounts[itemId] -= 1;
      }
    }

    for (const [itemId, count] of Object.entries(remainingCounts)) {
      if (count === 0) {
        completedItems[itemId] = true;
      }
    }

    return { remainingCounts, completedItems };
  }, [data, state.revealed]);

  const isWin = state.status === 'win';
  const isLose = state.status === 'lose';
  const isComplete = isWin || isLose;

  // Auto-open the results splash once the game reaches a final state.
  useEffect(() => {
    if (isComplete) {
      setShowResults(true);
    }
  }, [isComplete]);

  return {
    hearts: state.hearts,
    revealed: state.revealed,
    foundCount: state.foundCount,
    flips: state.flips,
    activeTileIndex: session.activeTileIndex,
    pairActiveTileIndex: session.pairActiveTileIndex,
    showResults,
    setShowResults,
    isWin,
    isLose,
    isComplete,
    onActivateTile,
    tracker,
  };
}
