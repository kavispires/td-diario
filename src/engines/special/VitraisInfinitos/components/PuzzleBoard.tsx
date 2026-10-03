import { cn } from '@utils/cn';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BOARD_ASPECT_RATIO,
  BOARD_FALLBACK_WIDTH,
  DRAG_DISTANCE_THRESHOLD,
  GRID_COLUMNS,
  PIECE_MOVE_TRANSITION,
} from '../utils/constants';
import { getConnectedGroupIndexes } from '../utils/helpers';

/**
 * Props accepted by the {@link PuzzleBoard} component.
 */
type PuzzleBoardProps = {
  /**
   * Current piece id occupying each board slot, in render order.
   */
  pieceOrder: number[];
  /**
   * Width, in pixels, available for the board.
   */
  width: number;
  /**
   * Full image URL used to crop each puzzle piece.
   */
  imageUrl: string;
  /**
   * Whether the daily puzzle is already complete.
   */
  isComplete: boolean;
  /**
   * Slot index of the currently selected anchor piece, if any.
   */
  selectedAnchorIndex: number | null;
  /**
   * Updates which anchor piece is selected for tap-to-move controls.
   */
  onSelectAnchor: (index: number) => void;
  /**
   * Attempts to move one connected group from a source anchor to a target
   * anchor.
   */
  onMoveGroup: (sourceAnchorIndex: number, targetAnchorIndex: number) => void;
};

/**
 * Pointer-drag snapshot stored while the player is moving a connected group.
 */
type DragState = {
  /**
   * Slot index where the grabbed group starts.
   */
  sourceAnchorIndex: number;
  /**
   * Slot offsets occupied by that connected group, relative to the anchor.
   */
  groupOffsets: number[];
  /**
   * Pointer coordinates captured when the interaction begins.
   */
  startPointer: {
    /**
     * Starting horizontal viewport coordinate.
     */
    x: number;
    /**
     * Starting vertical viewport coordinate.
     */
    y: number;
  };
  /**
   * Latest pointer coordinates while dragging.
   */
  pointer: {
    /**
     * Current horizontal viewport coordinate.
     */
    x: number;
    /**
     * Current vertical viewport coordinate.
     */
    y: number;
  };
  /**
   * Pointer offset inside the grabbed anchor tile, so the overlay does not
   * jump when dragging starts.
   */
  pointerOffset: {
    /**
     * Horizontal offset from tile start to pointer.
     */
    x: number;
    /**
     * Vertical offset from tile start to pointer.
     */
    y: number;
  };
  /**
   * Slot currently hovered as the drag target, if any.
   */
  hoveredAnchorIndex: number | null;
  /**
   * Whether the pointer moved far enough to count as an actual drag.
   */
  didDrag: boolean;
};

/**
 * Returns the inline image-cropping styles for one puzzle piece.
 *
 * @param pieceId - Solved-position id of the piece being rendered.
 * @param imageUrl - Full source image URL.
 * @param totalRows - Amount of rows in the current board.
 * @returns Inline background styles for that piece.
 */
function getPieceStyle(
  pieceId: number,
  imageUrl: string,
  totalRows: number,
): React.CSSProperties {
  const column = pieceId % GRID_COLUMNS;
  const row = Math.floor(pieceId / GRID_COLUMNS);
  const xOffset = GRID_COLUMNS > 1 ? column * (100 / (GRID_COLUMNS - 1)) : 0;
  const yOffset = totalRows > 1 ? row * (100 / (totalRows - 1)) : 0;

  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${GRID_COLUMNS * 100}% ${totalRows * 100}%`,
    backgroundPosition: `${xOffset}% ${yOffset}%`,
  };
}

/**
 * Renders the interactive stained-glass board used by Vitrais Infinitos,
 * supporting both drag-and-drop and tap-to-move controls for connected
 * piece groups.
 *
 * @param props Current board state plus selection and move handlers.
 * @returns The rendered puzzle board.
 */
export function PuzzleBoard({
  pieceOrder,
  width,
  imageUrl,
  isComplete,
  selectedAnchorIndex,
  onSelectAnchor,
  onMoveGroup,
}: PuzzleBoardProps) {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  const safeWidth = width > 0 ? width : BOARD_FALLBACK_WIDTH;
  const rows = Math.max(1, Math.ceil(pieceOrder.length / GRID_COLUMNS));
  const totalHeight = safeWidth * BOARD_ASPECT_RATIO;
  const cellWidth = safeWidth / GRID_COLUMNS;
  const cellHeight = totalHeight / rows;
  const draggedIndexes = useMemo(() => {
    if (!dragState) {
      return [];
    }

    return dragState.groupOffsets.map(
      (offset) => dragState.sourceAnchorIndex + offset,
    );
  }, [dragState]);
  const selectedIndexes = useMemo(() => {
    if (selectedAnchorIndex === null) {
      return [];
    }

    return getConnectedGroupIndexes(pieceOrder, selectedAnchorIndex);
  }, [pieceOrder, selectedAnchorIndex]);
  const boardRect = boardRef.current?.getBoundingClientRect() ?? null;

  useEffect(() => {
    if (!dragState) {
      return;
    }

    function getHoveredAnchor(clientX: number, clientY: number): number | null {
      const boardRect = boardRef.current?.getBoundingClientRect();

      if (!boardRect) {
        return null;
      }

      const x = clientX - boardRect.left;
      const y = clientY - boardRect.top;

      if (x < 0 || y < 0 || x > boardRect.width || y > boardRect.height) {
        return null;
      }

      const column = Math.floor(x / cellWidth);
      const row = Math.floor(y / cellHeight);
      const hoveredIndex = row * GRID_COLUMNS + column;

      return hoveredIndex < pieceOrder.length ? hoveredIndex : null;
    }

    function handlePointerMove(event: PointerEvent) {
      setDragState((prev) => {
        if (!prev) {
          return prev;
        }

        const distance = Math.hypot(
          event.clientX - prev.startPointer.x,
          event.clientY - prev.startPointer.y,
        );

        return {
          ...prev,
          pointer: { x: event.clientX, y: event.clientY },
          hoveredAnchorIndex: getHoveredAnchor(event.clientX, event.clientY),
          didDrag: prev.didDrag || distance > DRAG_DISTANCE_THRESHOLD,
        };
      });
    }

    function handlePointerUp() {
      setDragState((prev) => {
        if (!prev) {
          return prev;
        }

        if (!prev.didDrag) {
          if (
            selectedAnchorIndex !== null &&
            selectedAnchorIndex !== prev.sourceAnchorIndex
          ) {
            onMoveGroup(selectedAnchorIndex, prev.sourceAnchorIndex);
          } else {
            onSelectAnchor(prev.sourceAnchorIndex);
          }

          return null;
        }

        if (
          prev.hoveredAnchorIndex !== null &&
          prev.hoveredAnchorIndex !== prev.sourceAnchorIndex
        ) {
          onMoveGroup(prev.sourceAnchorIndex, prev.hoveredAnchorIndex);
        }

        return null;
      });
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [
    cellHeight,
    cellWidth,
    dragState,
    onMoveGroup,
    onSelectAnchor,
    pieceOrder.length,
    selectedAnchorIndex,
  ]);

  return (
    <div
      className="mx-auto w-full"
      style={{ maxWidth: safeWidth }}
    >
      <div
        ref={boardRef}
        className={cn(
          'relative overflow-hidden rounded-[2rem] bg-black/50 shadow-[0_16px_45px_-18px_rgba(0,0,0,0.65)]',
          isComplete && 'ring-4 ring-gold',
        )}
        style={{ width: safeWidth, height: totalHeight }}
      >
        <div
          className="absolute inset-0 grid pointer-events-none"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: pieceOrder.length }, (_, index) => {
            const isHovered = dragState?.hoveredAnchorIndex === index;

            return (
              <div
                key={index}
                className={cn(
                  'border border-white/8 transition-colors',
                  isHovered && 'bg-white/10',
                )}
              />
            );
          })}
        </div>

        {pieceOrder.map((pieceId, slotIndex) => {
          if (draggedIndexes.includes(slotIndex)) {
            return null;
          }

          const left = (slotIndex % GRID_COLUMNS) * cellWidth;
          const top = Math.floor(slotIndex / GRID_COLUMNS) * cellHeight;
          const isSelected = selectedIndexes.includes(slotIndex);

          return (
            <motion.button
              key={pieceId}
              type="button"
              className={cn(
                'absolute overflow-hidden border border-black/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/80',
                isSelected &&
                  !isComplete &&
                  'brightness-110 ring-2 ring-white/75',
              )}
              initial={false}
              animate={{ left, top }}
              transition={PIECE_MOVE_TRANSITION}
              style={{
                width: cellWidth,
                height: cellHeight,
                touchAction: 'none',
              }}
              aria-label={`Peça ${pieceId + 1} do quebra-cabeça`}
              onPointerDown={(event) => {
                if (isComplete) {
                  return;
                }

                event.preventDefault();
                const tileRect = event.currentTarget.getBoundingClientRect();
                const groupIndexes = getConnectedGroupIndexes(
                  pieceOrder,
                  slotIndex,
                );

                setDragState({
                  sourceAnchorIndex: slotIndex,
                  groupOffsets: groupIndexes.map((index) => index - slotIndex),
                  startPointer: { x: event.clientX, y: event.clientY },
                  pointer: { x: event.clientX, y: event.clientY },
                  pointerOffset: {
                    x: event.clientX - tileRect.left,
                    y: event.clientY - tileRect.top,
                  },
                  hoveredAnchorIndex: slotIndex,
                  didDrag: false,
                });
              }}
            >
              <div
                className="absolute inset-0"
                style={getPieceStyle(pieceId, imageUrl, rows)}
              />
              <div
                className="absolute inset-0 bg-black/5"
                aria-hidden="true"
              />
            </motion.button>
          );
        })}

        {dragState && (
          <div
            className="pointer-events-none absolute z-20"
            style={{
              left:
                dragState.pointer.x -
                dragState.pointerOffset.x -
                (boardRect?.left ?? 0),
              top:
                dragState.pointer.y -
                dragState.pointerOffset.y -
                (boardRect?.top ?? 0),
            }}
          >
            {dragState.groupOffsets.map((offset) => {
              const sourceIndex = dragState.sourceAnchorIndex + offset;
              const pieceId = pieceOrder[sourceIndex];
              const colOffset =
                (sourceIndex % GRID_COLUMNS) -
                (dragState.sourceAnchorIndex % GRID_COLUMNS);
              const rowOffset =
                Math.floor(sourceIndex / GRID_COLUMNS) -
                Math.floor(dragState.sourceAnchorIndex / GRID_COLUMNS);

              return (
                <div
                  key={pieceId}
                  className="absolute overflow-hidden border border-white/80 shadow-2xl"
                  style={{
                    width: cellWidth,
                    height: cellHeight,
                    left: colOffset * cellWidth,
                    top: rowOffset * cellHeight,
                    filter: 'drop-shadow(0 8px 18px rgba(0, 0, 0, 0.35))',
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={getPieceStyle(pieceId, imageUrl, rows)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
