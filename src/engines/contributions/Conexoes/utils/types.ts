import type { Dispatch, SetStateAction } from 'react';
import type { DefaultGameState } from 'types/puzzles';

/**
 * One unordered image pair shown to the player for evaluation.
 */
export type PairToEvaluate = {
  /**
   * Stable id derived from the two image ids, used to avoid repeats.
   */
  pairId: string;
  /**
   * Id of the first image rendered in the pair.
   */
  imageId1: string;
  /**
   * Id of the second image rendered in the pair.
   */
  imageId2: string;
};

/**
 * One pair the player marked as related and that can be saved to the
 * backend contribution database.
 */
export type RelatedPair = {
  /**
   * Id of the first image in the saved relationship.
   */
  imageId1: string;
  /**
   * Id of the second image in the saved relationship.
   */
  imageId2: string;
};

/**
 * Persisted per-day Conexões progress, kept in local storage so a reload
 * does not lose the player's queue, answers, or pending contribution.
 */
export type GameState = DefaultGameState<{
  /**
   * All pairs already generated for today's run, in play order.
   */
  pairs: PairToEvaluate[];
  /**
   * Zero-based index of the pair currently being evaluated.
   */
  currentPairIndex: number;
  /**
   * Pairs the player marked as related and can eventually save.
   */
  relatedPairs: RelatedPair[];
  /**
   * Ids of every pair already generated for today's run, used to prevent
   * repeats when more pairs need to be appended.
   */
  generatedPairIds: string[];
  /**
   * Number of pairs the player has already evaluated.
   */
  evaluatedCount: number;
}>;

/**
 * Ephemeral, non-persisted UI state for Conexões.
 */
export type SessionState = {
  /**
   * Whether the fullscreen results splash is currently visible.
   */
  showResults: boolean;
  /**
   * Whether the last save attempt failed and can be retried.
   */
  saveFailed: boolean;
};

/**
 * Partial session-state setter used by the engine's helpers.
 */
export type SessionSetter = Dispatch<SetStateAction<SessionState>>;

/**
 * Payload expected by the `SAVE_CONEXOES` daily action.
 */
export type SavePayload = {
  /**
   * Related image pairs to persist for future challenge generation.
   */
  pairs: RelatedPair[];
};

/**
 * Public state and actions returned by {@link useConexoesEngine}.
 */
export type ConexoesEngineState = {
  /**
   * Pair currently being evaluated, or `null` once no generated pair
   * remains available.
   */
  currentPair: PairToEvaluate | null;
  /**
   * Pairs already marked as related.
   */
  relatedPairs: RelatedPair[];
  /**
   * Number of pairs evaluated so far.
   */
  evaluatedCount: number;
  /**
   * Whether the fullscreen results splash is currently visible.
   */
  showResults: boolean;
  /**
   * Controls the visibility of the fullscreen results splash.
   */
  setShowResults: (value: boolean) => void;
  /**
   * Fraction of the minimum evaluation quota already completed.
   */
  progress: number;
  /**
   * Score accumulated from saved-worthy related pairs.
   */
  score: number;
  /**
   * Whether the player has not started today's run yet.
   */
  isIdle: boolean;
  /**
   * Whether the player is actively evaluating pairs.
   */
  isPlaying: boolean;
  /**
   * Whether a contribution save is currently in flight.
   */
  isSaving: boolean;
  /**
   * Whether the last save attempt failed and can be retried.
   */
  isRetryable: boolean;
  /**
   * Whether today's run was saved successfully.
   */
  isWin: boolean;
  /**
   * Whether today's run was ended without any relationship to save.
   */
  isLose: boolean;
  /**
   * Whether today's run reached any final lifecycle state.
   */
  isComplete: boolean;
  /**
   * Whether the current answers are enough to save a contribution.
   */
  canSave: boolean;
  /**
   * Whether the player can stop today's run without saving anything.
   */
  canComplete: boolean;
  /**
   * Moves Conexões from the intro screen into the evaluation flow.
   */
  startGame: () => void;
  /**
   * Records whether the current pair feels related or unrelated.
   */
  evaluatePair: (isRelated: boolean) => void;
  /**
   * Sends the currently marked related pairs to the backend.
   */
  savePairs: () => void;
  /**
   * Retries the last failed save using the already stored related pairs.
   */
  retrySave: () => void;
  /**
   * Ends today's run without saving because no useful relationships were
   * found.
   */
  finishWithoutSaving: () => void;
};
