import type { DefaultGameState } from 'types/puzzles';

/**
 * Persisted per-day progress for Mapeamento, kept in local storage so a
 * reload doesn't lose the player's guesses within the same day.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Wrong guesses already submitted by the player.
   */
  guesses: string[];
}>;

/**
 * Public state and actions returned by {@link useMapeamentoEngine}.
 */
export type MapeamentoEngineState = {
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Wrong guesses already submitted by the player.
   */
  guesses: string[];
  /**
   * All clues returned for today's location.
   */
  allClues: string[];
  /**
   * Clues currently unlocked based on the number of mistakes made.
   */
  availableClues: string[];
  /**
   * Revealed letter fragments built from previous wrong guesses.
   */
  locationFragments: string[];
  /**
   * Whether every distinct answer letter has already appeared across the
   * player's wrong guesses.
   */
  hasFoundAllLetters: boolean;
  /**
   * Whether the fullscreen results splash is currently visible.
   */
  showResults: boolean;
  /**
   * Controls the visibility of the fullscreen results splash.
   */
  setShowResults: (value: boolean) => void;
  /**
   * Current score for today's run.
   */
  score: number;
  /**
   * Fraction of the run completed, from `0` to `1`.
   */
  progress: number;
  /**
   * Whether today's run ended in a win.
   */
  isWin: boolean;
  /**
   * Whether today's run ended in a loss.
   */
  isLose: boolean;
  /**
   * Whether today's run reached any final state.
   */
  isComplete: boolean;
  /**
   * Validates and submits one typed location guess.
   */
  submitLocation: (location: string) => boolean;
};
