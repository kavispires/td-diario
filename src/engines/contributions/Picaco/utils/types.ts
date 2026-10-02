import type { Dispatch, SetStateAction } from 'react';
import type { DailyPicacoCard } from 'types/games';
import type { DefaultGameState } from 'types/puzzles';

/**
 * A single freehand stroke, stored as a flat `[x1, y1, x2, y2, ...]`
 * coordinate list in the original Picaco format.
 */
export type CanvasLine = number[];

/**
 * State setter used by the drawing canvas to update the current sketch.
 */
export type CanvasLinesSetter = Dispatch<SetStateAction<CanvasLine[]>>;

/**
 * One finished Picaco sketch aligned to a specific prompt card.
 */
export type PicacoDrawing = {
  /**
   * Id of the prompt card this drawing belongs to.
   */
  cardId: string;
  /**
   * Serialized array of canvas lines in the same JSON format used by the
   * original Picaco implementation.
   */
  drawing: string;
};

/**
 * Persisted per-day progress for Picaco, kept in local storage so the
 * player can resume the same prompt order after a reload.
 */
export type GameState = DefaultGameState<{
  /**
   * Ids of the prompt cards selected for today's run, in play order.
   */
  selectedCardIds: string[];
  /**
   * Zero-based index of the prompt currently being drawn, which also equals
   * the number of finished prompts so far.
   */
  currentCardIndex: number;
  /**
   * Finished drawings already collected for today's run.
   */
  drawings: PicacoDrawing[];
}>;

/**
 * Payload sent to the daily save endpoint for one drawing that is worth
 * contributing to the shared database.
 */
export type DrawingToSave = {
  /**
   * Serialized drawing data captured from the canvas.
   */
  drawing: string;
  /**
   * Id of the card the player drew.
   */
  cardId: string;
  /**
   * Difficulty level of the card, forwarded to the backend unchanged.
   */
  level: number;
  /**
   * Firebase uid of the authenticated player who submitted the drawing.
   */
  playerId: string;
  /**
   * Placeholder score kept for compatibility with the original payload.
   */
  successRate: number;
  /**
   * Prompt text shown to the player while drawing.
   */
  text: string;
};

/**
 * Public state/actions returned by {@link usePicacoEngine}.
 */
export type PicacoEngineState = {
  /**
   * Resolved prompt cards selected for today's run, in play order.
   */
  selectedCards: DailyPicacoCard[];
  /**
   * Prompt card currently being drawn, or `null` once all prompts are done.
   */
  currentCard: DailyPicacoCard | null;
  /**
   * One-based number of the current prompt shown to the player.
   */
  currentCardNumber: number;
  /**
   * Finished drawings already collected for today's run.
   */
  completedDrawings: PicacoDrawing[];
  /**
   * Whether the fullscreen results splash is currently visible.
   */
  showResults: boolean;
  /**
   * Controls the visibility of the fullscreen results splash.
   */
  setShowResults: (value: boolean) => void;
  /**
   * Fraction of prompts already completed, from `0` to `1`.
   */
  progress: number;
  /**
   * Score accumulated so far from drawings with enough strokes to be saved.
   */
  score: number;
  /**
   * Whether the player has not started today's run yet.
   */
  isIdle: boolean;
  /**
   * Whether the player is currently drawing a prompt.
   */
  isPlaying: boolean;
  /**
   * Whether the finished drawings are being saved to the backend.
   */
  isSaving: boolean;
  /**
   * Whether saving failed after the last prompt and can be retried.
   */
  isRetryable: boolean;
  /**
   * Whether today's run has been saved successfully.
   */
  isWin: boolean;
  /**
   * Whether today's run ended in a loss state.
   */
  isLose: boolean;
  /**
   * Whether today's run reached any final lifecycle state.
   */
  isComplete: boolean;
  /**
   * Moves Picaco from the intro state into the timed drawing flow.
   */
  startGame: () => void;
  /**
   * Finalizes the current prompt with the drawing that was produced when the
   * round timer ended.
   */
  submitDrawing: (lines: CanvasLine[]) => void;
  /**
   * Retries saving the already-finished drawings after a backend failure.
   */
  retrySave: () => void;
};
