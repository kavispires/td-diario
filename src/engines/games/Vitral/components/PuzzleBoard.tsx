import { cn } from '@utils/cn';
import { motion } from 'motion/react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Fragment } from 'react';
import { getPieceStyle } from '../utils/puzzleUtils';
import type { BoardMeasures, GridState, PieceBorders } from '../utils/types';
import { PuzzlePiece } from './PuzzlePiece';

const OVERLAY_BORDER_STYLE = '0.5px solid rgba(255, 255, 255, 0.85)';

/**
 * Props accepted by the {@link PuzzleBoard} component.
 */
type PuzzleBoardProps = {
  /**
   * Full image URL for the puzzle artwork.
   */
  imageUrl: string;
  /**
   * Current board arrangement by slot.
   */
  grid: GridState;
  /**
   * Current board measurements.
   */
  measures: BoardMeasures;
  /**
   * Whether the game has reached a final state.
   */
  isComplete: boolean;
  /**
   * Whether the player won the puzzle.
   */
  isWin: boolean;
  /**
   * Slot indexes belonging to the currently dragged group.
   */
  activeGroupSlotIndexes: number[];
  /**
   * Slot indexes currently targeted by the drag preview.
   */
  targetGroupSlotIndexes: number[];
  /**
   * Set of piece ids temporarily hidden because they are rendered by the drag overlay.
   */
  hiddenPieceIds: Set<number>;
  /**
   * Metadata for the drag currently in progress, if any.
   */
  activeDrag: {
    pieceId: number;
    originIndex: number;
    groupOffsets: number[];
    pointerX: number;
    pointerY: number;
    offsetX: number;
    offsetY: number;
    targetIndex: number;
  } | null;
  /**
   * Callback ref attached to the board element.
   */
  boardRef: (node: HTMLDivElement | null) => void;
  /**
   * Returns border visibility for a piece at the given slot.
   */
  getBorders: (index: number) => PieceBorders;
  /**
   * Starts dragging the piece in the given slot.
   */
  startDrag: (
    index: number,
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => void;
};

/**
 * Renders Vitral's puzzle board, including grid slots, animated pieces,
 * and a floating overlay while a connected group is being dragged.
 *
 * @param props Board state, measurements, and drag handlers.
 * @returns The rendered puzzle board.
 */
export function PuzzleBoard({
  imageUrl,
  grid,
  measures,
  isComplete,
  isWin,
  activeGroupSlotIndexes,
  targetGroupSlotIndexes,
  hiddenPieceIds,
  activeDrag,
  boardRef,
  getBorders,
  startDrag,
}: PuzzleBoardProps) {
  const highlightedTargets = new Set(
    targetGroupSlotIndexes.filter(
      (index) => index >= 0 && index < measures.totalSlots,
    ),
  );

  return (
    <div className="mx-auto w-full max-w-md">
      <div
        ref={boardRef}
        className={cn(
          'relative mx-auto overflow-hidden rounded-2xl border bg-chrome shadow-2xl transition-colors',
          isWin ? 'border-gold' : 'border-white/10',
        )}
        style={{
          width: measures.width || '100%',
          height: measures.height || undefined,
        }}
      >
        <div
          className="absolute inset-0 grid pointer-events-none"
          style={{
            gridTemplateColumns: `repeat(3, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${measures.rows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: measures.totalSlots }, (_, index) => (
            <div
              key={index}
              className={cn(
                'border border-white/6 transition-colors',
                highlightedTargets.has(index) && 'bg-white/12',
                isWin && activeGroupSlotIndexes.length === 0 && 'bg-gold/6',
              )}
            />
          ))}
        </div>

        <div className="absolute inset-0">
          {grid.map((piece, index) => {
            if (!piece) {
              return null;
            }

            return (
              <PuzzlePiece
                key={piece.id}
                pieceId={piece.id}
                currentSlotIndex={index}
                totalRows={measures.rows}
                imageUrl={imageUrl}
                cellWidth={measures.cellWidth}
                cellHeight={measures.cellHeight}
                isHidden={hiddenPieceIds.has(piece.id)}
                disabled={isComplete}
                borders={getBorders(index)}
                onPointerDown={startDrag}
              />
            );
          })}
        </div>

        {activeDrag && (
          <div
            className="absolute inset-0 z-50 pointer-events-none"
            aria-hidden="true"
          >
            <motion.div
              initial={false}
              animate={{
                left: activeDrag.pointerX - activeDrag.offsetX,
                top: activeDrag.pointerY - activeDrag.offsetY,
              }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 32,
                mass: 0.35,
              }}
              className="absolute"
              style={{
                width: measures.cellWidth,
                height: measures.cellHeight,
                filter: 'drop-shadow(0 10px 18px rgba(0, 0, 0, 0.45))',
              }}
            >
              {activeDrag.groupOffsets.map((offset) => {
                const originalIndex = activeDrag.originIndex + offset;
                const piece = grid[originalIndex];
                if (!piece) {
                  return null;
                }

                const colOffset =
                  (originalIndex % 3) - (activeDrag.originIndex % 3);
                const rowOffset =
                  Math.floor(originalIndex / 3) -
                  Math.floor(activeDrag.originIndex / 3);
                const borders = getBorders(originalIndex);

                return (
                  <Fragment key={piece.id}>
                    <div
                      className="absolute"
                      style={{
                        width: measures.cellWidth,
                        height: measures.cellHeight,
                        left: colOffset * measures.cellWidth,
                        top: rowOffset * measures.cellHeight,
                      }}
                    >
                      <div
                        className="absolute inset-0 overflow-hidden rounded-md"
                        style={getPieceStyle(piece.id, imageUrl, measures.rows)}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          borderTop: borders.top
                            ? OVERLAY_BORDER_STYLE
                            : 'none',
                          borderRight: borders.right
                            ? OVERLAY_BORDER_STYLE
                            : 'none',
                          borderBottom: borders.bottom
                            ? OVERLAY_BORDER_STYLE
                            : 'none',
                          borderLeft: borders.left
                            ? OVERLAY_BORDER_STYLE
                            : 'none',
                        }}
                      />
                    </div>
                  </Fragment>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
