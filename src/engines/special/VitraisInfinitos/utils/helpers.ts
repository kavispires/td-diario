import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { DailyVitraisInfinitosEntry } from 'types/games';
import { gameInfo } from '../info';
import { GRID_COLUMNS, SCORE_PER_CORRECT_PIECE } from './constants';
import type { GameState } from './types';

/**
 * Counts how many pieces are currently sitting in their correct board slots.
 *
 * @param pieceOrder - Current piece id occupying each board slot.
 * @returns The amount of correctly placed pieces.
 */
export function countCorrectPlacements(pieceOrder: number[]): number {
  return pieceOrder.reduce(
    (correctCount, pieceId, index) =>
      correctCount + (pieceId === index ? 1 : 0),
    0,
  );
}

/**
 * Converts a count of correctly placed pieces into the persisted progress
 * share used by the shared game shell.
 *
 * @param solvedPieces - Amount of correctly placed pieces.
 * @param totalPieces - Total amount of pieces in today's puzzle.
 * @returns A number between `0` and `1`.
 */
export function getProgress(solvedPieces: number, totalPieces: number): number {
  if (totalPieces <= 0) {
    return 0;
  }

  return solvedPieces / totalPieces;
}

/**
 * Converts the current amount of correctly placed pieces into a lightweight
 * score for today's puzzle.
 *
 * @param solvedPieces - Amount of correctly placed pieces.
 * @returns The derived score.
 */
export function getScore(solvedPieces: number): number {
  return solvedPieces * SCORE_PER_CORRECT_PIECE;
}

/**
 * Builds the default `GameState` for a fresh Vitrais Infinitos day.
 *
 * @param data - Today's Vitrais Infinitos payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyVitraisInfinitosEntry): GameState {
  const solvedPieces = countCorrectPlacements(data.pieces);
  const isSolved = solvedPieces === data.pieces.length;

  return {
    id: data.id,
    status: isSolved ? GAME_LIFECYCLE_STATUS.WIN : GAME_LIFECYCLE_STATUS.IDLE,
    progress: getProgress(solvedPieces, data.pieces.length),
    score: getScore(solvedPieces),
    pieceOrder: [...data.pieces],
    moveCount: 0,
    pieceCount: data.pieces.length,
  };
}

/**
 * Validates that a restored local Vitrais Infinitos state still matches
 * today's puzzle and represents a coherent permutation of its pieces.
 *
 * @param state - Restored local state to validate.
 * @param data - Today's Vitrais Infinitos payload.
 * @returns Whether the restored state is safe to reuse.
 */
function isValidState(
  state: GameState,
  data: DailyVitraisInfinitosEntry,
): boolean {
  if (
    state.pieceCount !== data.pieces.length ||
    state.pieceOrder.length !== data.pieces.length ||
    state.moveCount < 0
  ) {
    return false;
  }

  const sortedPieceOrder = [...state.pieceOrder].sort((a, b) => a - b);

  return sortedPieceOrder.every((pieceId, index) => pieceId === index);
}

/**
 * Retrieves today's Vitrais Infinitos state, restoring it from local
 * storage when it still matches today's entry, or rebuilding a fresh state
 * otherwise.
 *
 * @param data - Today's Vitrais Infinitos payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyVitraisInfinitosEntry): GameState {
  const defaultState = getDefaultState(data);
  const restoredState = loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: defaultState,
  });

  return isValidState(restoredState, data) ? restoredState : defaultState;
}

/**
 * Determines whether two piece ids belong next to each other in the solved
 * image, either horizontally or vertically.
 *
 * @param leftOrTopId - Piece id on the left/top side of the relation.
 * @param rightOrBottomId - Piece id on the right/bottom side of the relation.
 * @param isHorizontal - Whether to test a horizontal adjacency.
 * @returns Whether the two pieces connect in the solved board.
 */
export function arePiecesConnectable(
  leftOrTopId: number,
  rightOrBottomId: number,
  isHorizontal: boolean,
): boolean {
  if (isHorizontal) {
    return (
      rightOrBottomId === leftOrTopId + 1 &&
      Math.floor(leftOrTopId / GRID_COLUMNS) ===
        Math.floor(rightOrBottomId / GRID_COLUMNS)
    );
  }

  return rightOrBottomId === leftOrTopId + GRID_COLUMNS;
}

/**
 * Lists every slot index in the connected group that should move together
 * when the player grabs the piece currently occupying `startIndex`.
 *
 * @param pieceOrder - Current piece id occupying each board slot.
 * @param startIndex - Board slot where the grabbed piece sits.
 * @returns Connected slot indexes, sorted in ascending order.
 */
export function getConnectedGroupIndexes(
  pieceOrder: number[],
  startIndex: number,
): number[] {
  const totalSlots = pieceOrder.length;

  if (startIndex < 0 || startIndex >= totalSlots) {
    return [];
  }

  const visited = new Set<number>([startIndex]);
  const queue = [startIndex];

  while (queue.length > 0) {
    const currentIndex = queue.shift();

    if (currentIndex === undefined) {
      continue;
    }

    const currentPieceId = pieceOrder[currentIndex];
    const neighbors = [
      { index: currentIndex - 1, direction: 'horizontal' as const },
      { index: currentIndex + 1, direction: 'horizontal' as const },
      { index: currentIndex - GRID_COLUMNS, direction: 'vertical' as const },
      { index: currentIndex + GRID_COLUMNS, direction: 'vertical' as const },
    ];

    for (const { index, direction } of neighbors) {
      if (index < 0 || index >= totalSlots || visited.has(index)) {
        continue;
      }

      if (
        direction === 'horizontal' &&
        Math.floor(currentIndex / GRID_COLUMNS) !==
          Math.floor(index / GRID_COLUMNS)
      ) {
        continue;
      }

      const neighborPieceId = pieceOrder[index];
      const isForward = index > currentIndex;
      const isConnected =
        direction === 'horizontal'
          ? isForward
            ? arePiecesConnectable(currentPieceId, neighborPieceId, true)
            : arePiecesConnectable(neighborPieceId, currentPieceId, true)
          : isForward
            ? arePiecesConnectable(currentPieceId, neighborPieceId, false)
            : arePiecesConnectable(neighborPieceId, currentPieceId, false);

      if (!isConnected) {
        continue;
      }

      visited.add(index);
      queue.push(index);
    }
  }

  return Array.from(visited).sort((left, right) => left - right);
}

/**
 * Attempts to move one connected group from `sourceAnchorIndex` to
 * `targetAnchorIndex`, swapping whatever pieces are displaced by the move.
 *
 * @param pieceOrder - Current piece id occupying each board slot.
 * @param sourceAnchorIndex - Slot where the dragged group starts.
 * @param targetAnchorIndex - Slot where that same shape should land.
 * @returns The next piece order when the move is valid, otherwise `null`.
 */
export function moveConnectedGroup(
  pieceOrder: number[],
  sourceAnchorIndex: number,
  targetAnchorIndex: number,
): number[] | null {
  if (sourceAnchorIndex === targetAnchorIndex) {
    return null;
  }

  const groupIndexes = getConnectedGroupIndexes(pieceOrder, sourceAnchorIndex);
  const groupOffsets = groupIndexes.map((index) => index - sourceAnchorIndex);
  const targetIndexes = groupOffsets.map(
    (offset) => targetAnchorIndex + offset,
  );

  if (targetIndexes.some((index) => index < 0 || index >= pieceOrder.length)) {
    return null;
  }

  const sourceSet = new Set(groupIndexes);
  const targetSet = new Set(targetIndexes);
  const nextPieceOrder = [...pieceOrder];

  const displacedValues = targetIndexes
    .filter((index) => !sourceSet.has(index))
    .map((index) => pieceOrder[index]);

  const vacatedSlots = groupIndexes.filter((index) => !targetSet.has(index));

  vacatedSlots.forEach((slotIndex, displacedIndex) => {
    const displacedPieceId = displacedValues[displacedIndex];

    if (displacedPieceId !== undefined) {
      nextPieceOrder[slotIndex] = displacedPieceId;
    }
  });

  targetIndexes.forEach((targetIndex, groupIndex) => {
    nextPieceOrder[targetIndex] = pieceOrder[groupIndexes[groupIndex]];
  });

  const isChanged = nextPieceOrder.some(
    (pieceId, index) => pieceId !== pieceOrder[index],
  );

  return isChanged ? nextPieceOrder : null;
}
