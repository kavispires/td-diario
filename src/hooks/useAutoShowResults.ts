import { useEffect } from 'react';

/**
 * Milliseconds to wait after a game completes before automatically
 * revealing its results splash.
 */
const AUTO_SHOW_RESULTS_DELAY_MS = 1000;

/**
 * Automatically opens a game's results splash shortly after it reaches a
 * final state, giving the player a brief moment to see their last guess
 * resolve before the splash covers the board.
 *
 * @param isComplete Whether the game has reached a win/lose final state.
 * @param setShowResults Setter that reveals the results splash.
 */
export function useAutoShowResults(
  isComplete: boolean,
  setShowResults: (show: boolean) => void,
) {
  useEffect(() => {
    if (!isComplete) {
      return;
    }

    const timeout = setTimeout(() => {
      setShowResults(true);
    }, AUTO_SHOW_RESULTS_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [isComplete, setShowResults]);
}
