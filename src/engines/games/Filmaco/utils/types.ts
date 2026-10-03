import type { DefaultGameState } from 'types/puzzles';

/**
 * Visual feedback state stored for one guessed keyboard key.
 */
export type LetterState = 'correct' | 'incorrect';

/**
 * Persisted state for a single guessed keyboard key.
 */
export type LetterGuess = {
  /**
   * Normalized character that was guessed.
   */
  letter: string;
  /**
   * Whether that guess belongs to the movie title.
   */
  state: LetterState;
  /**
   * Whether the key should stay disabled in the on-screen keyboard.
   */
  disabled: boolean;
};

/**
 * Filmaco's on-screen keyboard state, keyed by normalized character.
 */
export type LettersDictionary = Dictionary<LetterGuess>;

/**
 * Persisted per-day progress for Filmaco, kept in local storage so a page
 * reload does not lose the player's guesses within the same day.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Normalized solution characters already discovered by the player.
   */
  solution: Dictionary<boolean>;
  /**
   * Visual state of every guessed keyboard key.
   */
  guesses: LettersDictionary;
}>;

/**
 * Public state/actions returned by {@link useFilmacoEngine}.
 */
export type FilmacoEngineState = {
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Visual state of every guessed keyboard key.
   */
  guesses: LettersDictionary;
  /**
   * Normalized solution characters already discovered by the player.
   */
  solution: Dictionary<boolean>;
  /**
   * Whether the fullscreen results splash is currently visible.
   */
  showResults: boolean;
  /**
   * Controls the visibility of the fullscreen results splash.
   */
  setShowResults: (value: boolean) => void;
  /**
   * Fraction of all guessable letter/digit occurrences already discovered
   * (counting repeats), from `0` to `1`.
   */
  progress: number;
  /**
   * Hearts-weighted score accumulated from correct guesses.
   */
  score: number;
  /**
   * Whether today's puzzle has ended in a win.
   */
  isWin: boolean;
  /**
   * Whether today's puzzle has ended in a loss.
   */
  isLose: boolean;
  /**
   * Whether today's puzzle has reached any final lifecycle state.
   */
  isComplete: boolean;
  /**
   * Handles one guessed letter or digit from the on-screen/physical
   * keyboard.
   */
  guessLetter: (letter: string) => void;
};
