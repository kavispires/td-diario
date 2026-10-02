import type { Dispatch, SetStateAction } from 'react';
import type { DefaultGameState } from 'types/puzzles';

/**
 * Assessment marker the player can assign to each kid while taking notes.
 */
export type KidAssessment = 'culprit' | 'liar' | 'innocent' | 'unknown';

/**
 * Persisted per-day Pirralhos progress, kept in local storage so a reload
 * preserves the player's notes and accusations for the current day.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining accusation attempts before the player loses.
   */
  hearts: number;
  /**
   * Kid ids already accused unsuccessfully, used to disable repeat guesses.
   */
  guesses: string[];
  /**
   * Player-authored note markers for each visible kid.
   */
  assessments: Dictionary<KidAssessment>;
}>;

/**
 * Public state/actions returned by {@link usePirralhosEngine}.
 */
export type PirralhosEngineState = {
  /**
   * Remaining accusation attempts before the game ends.
   */
  hearts: number;
  /**
   * Kid ids already accused unsuccessfully.
   */
  guesses: string[];
  /**
   * Player-authored note markers for each visible kid.
   */
  assessments: Dictionary<KidAssessment>;
  /**
   * Whether the fullscreen results splash is currently visible.
   */
  showResults: boolean;
  /**
   * Controls the visibility of the fullscreen results splash.
   */
  setShowResults: Dispatch<SetStateAction<boolean>>;
  /**
   * Fraction of today's mystery that has been meaningfully resolved, from
   * `0` to `1`.
   */
  progress: number;
  /**
   * Current score for today's run.
   */
  score: number;
  /**
   * Whether the player solved today's mystery.
   */
  isWin: boolean;
  /**
   * Whether the player exhausted every attempt.
   */
  isLose: boolean;
  /**
   * Whether the game has reached any final state.
   */
  isComplete: boolean;
  /**
   * Cycles the player's note marker for the given kid.
   */
  assessKid: (kidId: string) => void;
  /**
   * Clears every note marker back to `unknown`.
   */
  resetAssessments: () => void;
  /**
   * Accuses the given kid and resolves the game state accordingly.
   */
  submitKid: (kidId: string) => boolean;
};
