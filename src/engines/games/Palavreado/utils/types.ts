import type { DefaultGameState } from 'types/puzzles';

/**
 * Visual state applied to a single Palavreado tile.
 */
export type PalavreadoLetterState = 'idle' | '0' | '1' | '2' | '3' | '4';

/**
 * One selectable letter tile shown on the Palavreado board.
 */
export type PalavreadoLetter = {
  /**
   * Stable identifier used to animate this tile across swaps.
   */
  id: string;
  /**
   * Character currently shown on the tile.
   */
  letter: string;
  /**
   * Visual state describing whether the tile is still neutral or belongs
   * to one of the solved rows.
   */
  state: PalavreadoLetterState;
  /**
   * Whether this tile is permanently locked in place.
   */
  locked: boolean;
};

/**
 * Latest scoring recap produced by a submitted board.
 */
export type ScoringSummary = {
  /**
   * Fully-correct row words completed by the latest submission.
   */
  correctWords: string[];
  /**
   * Bonus words from the secret scoring list formed by the latest submission.
   */
  extraWordsFound: string[];
};

/**
 * Persisted per-day progress for Palavreado, kept in local storage so a
 * reload does not lose the current board.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining hearts (attempts) for the current day.
   */
  hearts: number;
  /**
   * Current board tiles, including their letters and solved-row styling.
   */
  letters: PalavreadoLetter[];
  /**
   * Submitted row words, one matrix per attempt.
   */
  guesses: string[][];
  /**
   * Number of swaps the player has made so far.
   */
  swaps: number;
  /**
   * Whether the smart-shuffle hint has already been consumed.
   */
  usedSmartShuffle: boolean;
}>;

/**
 * Ephemeral interaction state that should not be persisted between reloads.
 */
export type SessionState = {
  /**
   * Currently selected tile index, or `null` when nothing is selected.
   */
  selection: number | null;
  /**
   * Indexes of the two most recently swapped tiles.
   */
  swap: number[];
  /**
   * Number of newly-correct letters found by the latest submission.
   */
  latestCorrectLettersCount: number;
  /**
   * Points awarded specifically for newly-correct letters in the latest
   * submission.
   */
  letterScore: number;
  /**
   * Recap of the latest submission's completed and bonus words.
   */
  scoringSummary: ScoringSummary;
};

/**
 * Public shape returned by the Palavreado engine hook.
 */
export type PalavreadoEngineState = {
  /**
   * Remaining hearts (attempts).
   */
  hearts: number;
  /**
   * Current board tiles.
   */
  letters: PalavreadoLetter[];
  /**
   * Submitted guesses history.
   */
  guesses: string[][];
  /**
   * Number of swaps made so far.
   */
  swaps: number;
  /**
   * Whether the smart-shuffle hint has already been used.
   */
  usedSmartShuffle: boolean;
  /**
   * Index of the currently selected tile, or `null`.
   */
  selection: number | null;
  /**
   * Indexes of the two most recently swapped tiles.
   */
  swap: number[];
  /**
   * Whether the fullscreen results splash is currently visible.
   */
  showResults: boolean;
  /**
   * Updates whether the fullscreen results splash is visible.
   */
  setShowResults: (showResults: boolean) => void;
  /**
   * Whether the challenge ended in a win.
   */
  isWin: boolean;
  /**
   * Whether the challenge ended in a loss.
   */
  isLose: boolean;
  /**
   * Whether the challenge has reached any final state.
   */
  isComplete: boolean;
  /**
   * Handles selecting or swapping a tile.
   */
  selectLetter: (index: number) => void;
  /**
   * Swaps two tiles directly, bypassing the tap-to-select flow. Used by
   * drag-and-drop.
   */
  swapLetters: (firstIndex: number, secondIndex: number) => void;
  /**
   * Evaluates the current board as an attempt.
   */
  submitGrid: () => void;
  /**
   * Applies the one-time smart-shuffle hint.
   */
  smartShuffle: () => void;
  /**
   * Current diagonal keyword.
   */
  keyword: string;
  /**
   * Board size (`4` or `5`).
   */
  size: number;
  /**
   * Correct row words for today's puzzle.
   */
  words: string[];
  /**
   * Total score accumulated so far.
   */
  score: number;
  /**
   * Progress from `0` to `1`, excluding the pre-filled diagonal letters.
   */
  progress: number;
  /**
   * Number of newly-correct letters found by the latest submission.
   */
  latestCorrectLettersCount: number;
  /**
   * Latest submission's per-letter score award.
   */
  letterScore: number;
  /**
   * Latest submission's completed and bonus words recap.
   */
  scoringSummary: ScoringSummary;
};
