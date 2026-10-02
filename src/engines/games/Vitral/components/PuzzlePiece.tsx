import { motion } from 'motion/react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { getPieceStyle } from '../utils/puzzleUtils';
import type { PieceBorders } from '../utils/types';

const BORDER_STYLE = '0.5px solid rgba(0, 0, 0, 0.55)';

/**
 * Props accepted by the {@link PuzzlePiece} component.
 */
type PuzzlePieceProps = {
  /**
   * Id of the rendered piece.
   */
  pieceId: number;
  /**
   * Slot index currently occupied by the piece.
   */
  currentSlotIndex: number;
  /**
   * Total row count in today's puzzle.
   */
  totalRows: number;
  /**
   * Full source image URL for the puzzle artwork.
   */
  imageUrl: string;
  /**
   * Board cell width, in pixels.
   */
  cellWidth: number;
  /**
   * Board cell height, in pixels.
   */
  cellHeight: number;
  /**
   * Whether this piece should be hidden while its group is rendered in the overlay.
   */
  isHidden: boolean;
  /**
   * Whether interactions should be disabled because the game is complete.
   */
  disabled: boolean;
  /**
   * Which seams should stay visible for this piece.
   */
  borders: PieceBorders;
  /**
   * Called when the player starts dragging this piece.
   */
  onPointerDown: (
    slotIndex: number,
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => void;
};

/**
 * Renders one draggable Vitral piece at its absolute board position,
 * animating between slots and hiding seams between already-connected
 * neighbors.
 *
 * @param props Piece identity, board position, sizing, and drag handler.
 * @returns The rendered puzzle piece button.
 */
export function PuzzlePiece({
  pieceId,
  currentSlotIndex,
  totalRows,
  imageUrl,
  cellWidth,
  cellHeight,
  isHidden,
  disabled,
  borders,
  onPointerDown,
}: PuzzlePieceProps) {
  const col = currentSlotIndex % 3;
  const row = Math.floor(currentSlotIndex / 3);
  const left = col * cellWidth;
  const top = row * cellHeight;

  return (
    <motion.button
      type="button"
      initial={false}
      animate={{ top, left }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="absolute overflow-hidden rounded-md bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/85 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      style={{
        width: cellWidth,
        height: cellHeight,
        opacity: isHidden ? 0 : 1,
        cursor: disabled ? 'default' : 'grab',
        zIndex: isHidden ? 0 : 10,
        touchAction: 'none',
      }}
      onPointerDown={(event) => onPointerDown(currentSlotIndex, event)}
      disabled={disabled}
      aria-label={`Peça ${pieceId + 1}`}
    >
      <div style={getPieceStyle(pieceId, imageUrl, totalRows)} />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderTop: borders.top ? BORDER_STYLE : 'none',
          borderRight: borders.right ? BORDER_STYLE : 'none',
          borderBottom: borders.bottom ? BORDER_STYLE : 'none',
          borderLeft: borders.left ? BORDER_STYLE : 'none',
        }}
      />
    </motion.button>
  );
}
