import type { DefaultGameState } from 'types/puzzles';

/**
 * One guessed keyboard letter and the outcome it produced.
 */
export type LetterGuess = {
  /**
   * Lowercase normalized letter that was selected by the player.
   */
  letter: string;
  /**
   * Whether the chosen letter exists in today's answer.
   */
  state: 'correct' | 'incorrect';
  /**
   * Whether the key should remain disabled after being used.
   */
  disabled: boolean;
};

/**
 * Dictionary keyed by normalized letters already attempted by the player.
 */
export type LettersDictionary = Dictionary<LetterGuess>;

/**
 * Persisted per-day progress for Arte Ruim, kept in local storage so a
 * reload does not reset today's guesses.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Dictionary keyed by the unique letters that exist in the answer.
   */
  solution: Dictionary<boolean>;
  /**
   * Dictionary keyed by letters the player has already attempted.
   */
  guesses: LettersDictionary;
}>;

/**
 * Public state/actions returned by {@link useArteRuimEngine}.
 */
export type ArteRuimEngineState = {
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Dictionary keyed by letters the player has already attempted.
   */
  guesses: LettersDictionary;
  /**
   * Dictionary keyed by the unique letters that exist in the answer.
   */
  solution: Dictionary<boolean>;
  /**
   * Number of unique letters in the answer.
   */
  totalLetters: number;
  /**
   * Number of unique letters already revealed.
   */
  revealedLetters: number;
  /**
   * Number of incorrect guesses already made.
   */
  wrongGuesses: number;
  /**
   * Current score accumulated from correct guesses.
   */
  score: number;
  /**
   * Current persisted completion share, from `0` to `1`.
   */
  progress: number;
  /**
   * Whether the fullscreen results splash is currently visible.
   */
  showResults: boolean;
  /**
   * Controls the visibility of the fullscreen results splash.
   */
  setShowResults: (value: boolean) => void;
  /**
   * Whether today's challenge has been solved.
   */
  isWin: boolean;
  /**
   * Whether today's challenge ended in a loss state.
   */
  isLose: boolean;
  /**
   * Whether today's challenge reached any final lifecycle state.
   */
  isComplete: boolean;
  /**
   * Attempts the given letter and updates today's state when applicable.
   */
  guessLetter: (letter: string) => void;
};
