import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { ShareResult } from '@utils/shareResults';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyVitralEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  COLS,
  HEART_LOSS_INTERVAL_SECONDS,
  VITRAL_TOTAL_HEARTS,
} from './constants';
import { countConnections, getTotalPossibleConnections } from './puzzleUtils';
import type { GameState, GridState } from './types';

/**
 * Formats an elapsed time in seconds as `MM:SS`.
 *
 * @param totalSeconds - Elapsed time in seconds.
 * @returns Formatted time string.
 */
export function formatElapsedTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Builds the shareable result for today's Vitral run: the
 * standard header/hearts lines plus the original score/time suffix and a
 * deliberate blank line before the site link.
 *
 * @param options - Today's challenge number and final run state.
 * @returns The assembled `{ title, text, url }` share result.
 */
export function buildShare({
  challengeNumber,
  hearts,
  timeElapsed,
  score,
}: {
  challengeNumber: number;
  hearts: number;
  timeElapsed: number;
  score: number;
}): ShareResult {
  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts: VITRAL_TOTAL_HEARTS,
    remainingHearts: hearts,
    heartsSuffix: `(${score} pts em ${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}s)`,
    additionalLines: [' '],
  });
}

/**
 * Builds today's Vitral share result directly from the persisted challenge
 * payload and stored game progress, without mounting the engine or results
 * UI.
 *
 * @param data - Today's Vitral challenge payload.
 * @param state - Persisted Vitral progress for today's challenge.
 * @returns The assembled `{ title, text, url }` share result.
 */
export function buildShareFromProgress(
  data: DailyVitralEntry,
  state: GameState,
): ShareResult {
  return buildShare({
    challengeNumber: data.number,
    hearts: state.hearts,
    timeElapsed: state.timeElapsed,
    score: state.score,
  });
}

/**
 * Rebuilds the transient grid shape from the persisted `piecesOrder`.
 *
 * @param piecesOrder - Ordered piece ids by slot index.
 * @returns Grid array used by the board renderer and drag engine.
 */
export function buildGridFromPiecesOrder(piecesOrder: number[]): GridState {
  return piecesOrder.map((id) => ({ id }));
}

/**
 * Validates a persisted piece order against today's puzzle payload.
 *
 * @param piecesOrder - Stored piece order loaded from local storage.
 * @param pieceCount - Number of pieces expected by today's puzzle.
 * @returns `true` when the order contains every expected piece exactly once.
 */
export function isPiecesOrderValid(
  piecesOrder: number[],
  pieceCount: number,
): boolean {
  if (piecesOrder.length !== pieceCount) {
    return false;
  }

  const pieceIds = new Set(piecesOrder);
  if (pieceIds.size !== pieceCount) {
    return false;
  }

  return Array.from({ length: pieceCount }, (_, index) =>
    pieceIds.has(index),
  ).every(Boolean);
}

/**
 * Computes Vitral's progress ratio from the current board arrangement.
 *
 * @param piecesOrder - Ordered piece ids by slot index.
 * @returns Ratio from `0` to `1`.
 */
export function getProgressFromPiecesOrder(piecesOrder: number[]): number {
  const rows = Math.ceil(piecesOrder.length / COLS);
  const totalPossibleConnections = getTotalPossibleConnections(rows);
  const currentConnections = countConnections(
    buildGridFromPiecesOrder(piecesOrder),
  );

  if (totalPossibleConnections === 0) {
    return 1;
  }

  return currentConnections / totalPossibleConnections;
}

/**
 * Builds the fresh default state for a new Vitral day.
 *
 * @param data - Today's Vitral payload.
 * @returns Initial state before any progress is made.
 */
function getDefaultState(data: DailyVitralEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: VITRAL_TOTAL_HEARTS,
    timeElapsed: 0,
    piecesOrder: [...data.pieces],
    score: 0,
    progress: getProgressFromPiecesOrder(data.pieces),
    swapCount: 0,
  };
}

/**
 * Loads today's persisted Vitral progress when valid, otherwise resets to
 * the day's default state.
 *
 * @param data - Today's Vitral payload.
 * @returns Initial state for the engine.
 */
export function getInitialState(data: DailyVitralEntry): GameState {
  const defaultValue = getDefaultState(data);
  const storedState = loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue,
  });

  const piecesOrder = isPiecesOrderValid(
    storedState.piecesOrder,
    data.pieces.length,
  )
    ? [...storedState.piecesOrder]
    : [...data.pieces];

  const hearts = Math.min(
    VITRAL_TOTAL_HEARTS,
    Math.max(0, storedState.hearts ?? VITRAL_TOTAL_HEARTS),
  );
  const rows = Math.ceil(piecesOrder.length / COLS);
  const totalPossibleConnections = getTotalPossibleConnections(rows);
  const currentConnections = countConnections(
    buildGridFromPiecesOrder(piecesOrder),
  );
  const isSolved =
    totalPossibleConnections > 0 &&
    currentConnections === totalPossibleConnections;
  const elapsedHeartLosses = Math.floor(
    Math.max(0, storedState.timeElapsed ?? 0) /
      (HEART_LOSS_INTERVAL_SECONDS + data.pieces.length),
  );
  const normalizedHearts = Math.min(
    hearts,
    Math.max(0, VITRAL_TOTAL_HEARTS - elapsedHeartLosses),
  );
  const normalizedStatus = isSolved
    ? GAME_LIFECYCLE_STATUS.WIN
    : normalizedHearts <= 0
      ? GAME_LIFECYCLE_STATUS.LOSE
      : storedState.swapCount > 0 || storedState.timeElapsed > 0
        ? GAME_LIFECYCLE_STATUS.IN_PROGRESS
        : GAME_LIFECYCLE_STATUS.IDLE;

  return {
    id: data.id,
    status: normalizedStatus,
    hearts: normalizedHearts,
    timeElapsed: Math.max(0, storedState.timeElapsed ?? 0),
    piecesOrder,
    score: Math.max(0, storedState.score ?? 0),
    progress:
      totalPossibleConnections > 0
        ? currentConnections / totalPossibleConnections
        : 1,
    swapCount: Math.max(0, storedState.swapCount ?? 0),
  };
}
