import type { CSSProperties } from 'react';
import { COLS } from './constants';
import type { GridState, PieceBorders } from './types';

/**
 * Returns the background-image style that crops the source artwork into the
 * correct piece for `pieceId`.
 *
 * @param pieceId - Id of the piece to render.
 * @param imageUrl - Full image URL for the source artwork.
 * @param totalRows - Total row count in today's puzzle.
 * @returns Inline background style for the piece face.
 */
export function getPieceStyle(
  pieceId: number,
  imageUrl: string,
  totalRows: number,
): CSSProperties {
  const col = pieceId % COLS;
  const row = Math.floor(pieceId / COLS);
  const xPercent = COLS > 1 ? (col / (COLS - 1)) * 100 : 0;
  const yPercent = totalRows > 1 ? (row / (totalRows - 1)) * 100 : 0;

  return {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${imageUrl})`,
    backgroundPosition: `${xPercent}% ${yPercent}%`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${COLS * 100}% ${totalRows * 100}%`,
  };
}

/**
 * Checks whether two piece ids should connect along one shared edge.
 *
 * @param idA - First piece id.
 * @param idB - Second piece id.
 * @param isHorizontal - Whether the pieces are side by side horizontally.
 * @returns `true` when the pieces belong together on that edge.
 */
export function arePiecesConnectable(
  idA: number,
  idB: number,
  isHorizontal: boolean,
): boolean {
  if (isHorizontal) {
    return idB === idA + 1 && Math.floor(idA / COLS) === Math.floor(idB / COLS);
  }

  return idB === idA + COLS;
}

/**
 * Counts every currently-attached seam in the board.
 *
 * @param grid - Board arrangement to inspect.
 * @returns Total number of horizontal and vertical connections.
 */
export function countConnections(grid: GridState): number {
  let connections = 0;

  for (let index = 0; index < grid.length; index += 1) {
    const piece = grid[index];
    if (!piece) {
      continue;
    }

    const rightIndex = index + 1;
    if (
      rightIndex < grid.length &&
      Math.floor(index / COLS) === Math.floor(rightIndex / COLS)
    ) {
      const rightPiece = grid[rightIndex];
      if (rightPiece && arePiecesConnectable(piece.id, rightPiece.id, true)) {
        connections += 1;
      }
    }

    const bottomIndex = index + COLS;
    if (bottomIndex < grid.length) {
      const bottomPiece = grid[bottomIndex];
      if (
        bottomPiece &&
        arePiecesConnectable(piece.id, bottomPiece.id, false)
      ) {
        connections += 1;
      }
    }
  }

  return connections;
}

/**
 * Counts pieces already sitting in their final solved slot.
 *
 * @param grid - Board arrangement to inspect.
 * @returns Amount of correctly positioned pieces.
 */
export function countCorrectPieces(grid: GridState): number {
  return grid.filter((piece, index) => piece?.id === index).length;
}

/**
 * Computes the total number of seams in a solved puzzle with `rows` rows.
 *
 * @param rows - Number of rows in today's puzzle.
 * @returns Maximum amount of connections a solved board can have.
 */
export function getTotalPossibleConnections(rows: number): number {
  return rows * (COLS - 1) + COLS * (rows - 1);
}

/**
 * Walks the board graph to collect every piece already attached to the
 * piece at `startIndex`.
 *
 * @param grid - Current board arrangement.
 * @param startIndex - Slot where the drag started.
 * @param totalSlots - Total amount of board slots.
 * @returns Sorted slot indexes belonging to the connected group.
 */
export function getConnectedGroupIndices(
  grid: GridState,
  startIndex: number,
  totalSlots: number,
): number[] {
  const startPiece = grid[startIndex];
  if (!startPiece) {
    return [];
  }

  const queue = [startIndex];
  const group = new Set<number>([startIndex]);

  while (queue.length > 0) {
    const currentIndex = queue.shift();
    if (currentIndex === undefined) {
      continue;
    }

    const currentPiece = grid[currentIndex];
    if (!currentPiece) {
      continue;
    }

    const neighbors = [
      { index: currentIndex - 1, direction: 'horizontal' as const },
      { index: currentIndex + 1, direction: 'horizontal' as const },
      { index: currentIndex - COLS, direction: 'vertical' as const },
      { index: currentIndex + COLS, direction: 'vertical' as const },
    ];

    for (const neighbor of neighbors) {
      if (neighbor.index < 0 || neighbor.index >= totalSlots) {
        continue;
      }

      if (neighbor.direction === 'horizontal') {
        const currentRow = Math.floor(currentIndex / COLS);
        const neighborRow = Math.floor(neighbor.index / COLS);
        if (currentRow !== neighborRow) {
          continue;
        }
      }

      if (group.has(neighbor.index)) {
        continue;
      }

      const neighborPiece = grid[neighbor.index];
      if (!neighborPiece) {
        continue;
      }

      const connected =
        neighbor.direction === 'horizontal'
          ? neighbor.index > currentIndex
            ? arePiecesConnectable(currentPiece.id, neighborPiece.id, true)
            : arePiecesConnectable(neighborPiece.id, currentPiece.id, true)
          : neighbor.index > currentIndex
            ? arePiecesConnectable(currentPiece.id, neighborPiece.id, false)
            : arePiecesConnectable(neighborPiece.id, currentPiece.id, false);

      if (connected) {
        group.add(neighbor.index);
        queue.push(neighbor.index);
      }
    }
  }

  return Array.from(group).sort((left, right) => left - right);
}

/**
 * Determines which borders should stay visible for the piece at `index`,
 * hiding seams between already-attached neighboring pieces.
 *
 * @param index - Slot index to inspect.
 * @param grid - Current board arrangement.
 * @param totalSlots - Total amount of board slots.
 * @returns Border visibility for each side of the piece.
 */
export function getPieceBorders(
  index: number,
  grid: GridState,
  totalSlots: number,
): PieceBorders {
  const piece = grid[index];
  if (!piece) {
    return {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
  }

  const currentPiece = piece;

  function checkConnection(
    neighborIndex: number,
    direction: 'horizontal' | 'vertical',
  ): boolean {
    if (neighborIndex < 0 || neighborIndex >= totalSlots) {
      return false;
    }

    const neighbor = grid[neighborIndex];
    if (!neighbor) {
      return false;
    }

    return direction === 'horizontal'
      ? arePiecesConnectable(currentPiece.id, neighbor.id, true) ||
          arePiecesConnectable(neighbor.id, currentPiece.id, true)
      : arePiecesConnectable(currentPiece.id, neighbor.id, false) ||
          arePiecesConnectable(neighbor.id, currentPiece.id, false);
  }

  const topIndex = index - COLS;
  const bottomIndex = index + COLS;
  const leftIndex = index - 1;
  const rightIndex = index + 1;

  const hasTopConnection =
    topIndex >= 0 && checkConnection(topIndex, 'vertical');
  const hasBottomConnection =
    bottomIndex < totalSlots && checkConnection(bottomIndex, 'vertical');
  const hasLeftConnection =
    index % COLS !== 0 && checkConnection(leftIndex, 'horizontal');
  const hasRightConnection =
    index % COLS !== COLS - 1 && checkConnection(rightIndex, 'horizontal');

  return {
    top: !hasTopConnection,
    right: !hasRightConnection,
    bottom: !hasBottomConnection,
    left: !hasLeftConnection,
  };
}

/**
 * Moves one connected group from `sourceAnchorIndex` to `targetAnchorIndex`,
 * displacing whatever pieces occupied the target slots back into the
 * group's vacated slots, mirroring the original Vitral behavior.
 *
 * @param grid - Current board arrangement.
 * @param sourceAnchorIndex - Slot where the drag started.
 * @param targetAnchorIndex - Slot chosen on drop.
 * @param groupOffsets - Connected-group offsets relative to the source anchor.
 * @param totalSlots - Total amount of board slots.
 * @returns The new board arrangement, or `null` when the move is invalid.
 */
export function moveConnectedGroup(
  grid: GridState,
  sourceAnchorIndex: number,
  targetAnchorIndex: number,
  groupOffsets: number[],
  totalSlots: number,
): GridState | null {
  const sourceIndices = groupOffsets.map(
    (offset) => sourceAnchorIndex + offset,
  );
  const targetIndices = groupOffsets.map(
    (offset) => targetAnchorIndex + offset,
  );

  const isValidMove = targetIndices.every(
    (index) => index >= 0 && index < totalSlots,
  );

  if (!isValidMove) {
    return null;
  }

  const nextGrid = [...grid];
  const sourceSet = new Set(sourceIndices);
  const targetSet = new Set(targetIndices);
  const displacedValues = targetIndices
    .filter((index) => !sourceSet.has(index))
    .map((index) => grid[index]);
  const vacatedSlots = sourceIndices.filter((index) => !targetSet.has(index));

  vacatedSlots.forEach((slotIndex, displacedIndex) => {
    if (displacedIndex < displacedValues.length) {
      nextGrid[slotIndex] = displacedValues[displacedIndex];
    }
  });

  targetIndices.forEach((targetIndex, offsetIndex) => {
    const sourceIndex = sourceIndices[offsetIndex];
    nextGrid[targetIndex] = grid[sourceIndex];
  });

  return nextGrid;
}
