import type {
  DailyInvestigacaoStatement,
  DailyInvestigacaoSuspect,
} from 'types/games';
import type { DefaultGameState } from 'types/puzzles';

/**
 * Persisted per-day progress for Investigação, kept in local storage so a
 * reload does not discard the case in progress.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining bonus clues that can still be revealed.
   */
  hearts: number;
  /**
   * Suspect ids already released by the player.
   */
  released: string[];
}>;

/**
 * Ephemeral interaction state for the currently selected suspect.
 */
export type SessionState = {
  /**
   * Suspect currently highlighted for confirmation, or `null`.
   */
  activeSuspectId: string | null;
};

/**
 * Public state and actions returned by {@link useInvestigacaoEngine}.
 */
export type InvestigacaoEngineState = {
  /**
   * Remaining extra clues available to the player.
   */
  hearts: number;
  /**
   * Suspect ids already released in today's attempt.
   */
  released: string[];
  /**
   * Suspect currently selected for release confirmation, or `null`.
   */
  activeSuspectId: string | null;
  /**
   * Whether the fullscreen results splash is visible.
   */
  showResults: boolean;
  /**
   * Controls the visibility of the fullscreen results splash.
   */
  setShowResults: (value: boolean) => void;
  /**
   * Statements currently visible in the main clue list.
   */
  visibleStatements: DailyInvestigacaoStatement[];
  /**
   * Extra statements currently revealed via hearts.
   */
  visibleAdditionalStatements: DailyInvestigacaoStatement[];
  /**
   * Current score for the case.
   */
  score: number;
  /**
   * Case-solving progress from `0` to `1`, based on suspects released.
   */
  progress: number;
  /**
   * Whether the case ended in a solved state.
   */
  isWin: boolean;
  /**
   * Whether the case ended by releasing the culprit.
   */
  isLose: boolean;
  /**
   * Whether the case reached any final state.
   */
  isComplete: boolean;
  /**
   * Spends one heart to reveal an extra clue.
   */
  onNeedClue: () => void;
  /**
   * Selects a suspect for release confirmation.
   */
  onSelectSuspect: (suspectId: DailyInvestigacaoSuspect['id']) => void;
  /**
   * Clears the currently selected suspect.
   */
  onDeselectSuspect: () => void;
  /**
   * Confirms releasing the currently selected suspect.
   */
  onRelease: () => void;
};
