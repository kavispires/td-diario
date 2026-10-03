import { useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '@utils/cn';
import { motion } from 'motion/react';
import { TILE_TONE_CLASSES } from '../utils/constants';
import type { PalavreadoLetter } from '../utils/types';

/**
 * Props accepted by the {@link Board} component.
 */
type BoardProps = {
  /**
   * Current board tiles in row-major order.
   */
  letters: PalavreadoLetter[];
  /**
   * Currently selected tile index, or `null`.
   */
  selection: number | null;
  /**
   * Indexes of the two most recently swapped tiles.
   */
  swap: number[];
  /**
   * Called when the player taps a tile.
   */
  onLetterSelection: (index: number) => void;
  /**
   * Submitted guesses history, used to mark previously-wrong placements.
   */
  guesses: string[][];
  /**
   * Board side length.
   */
  size: number;
  /**
   * Pixel width/height applied to each square tile.
   */
  itemWidth: number;
  /**
   * Whether every tile interaction should be disabled.
   */
  disabled?: boolean;
};

/**
 * Renders Palavreado's letter board, highlighting selected tiles, solved
 * rows, and positions already tested with the same letter.
 *
 * @param props - Board data, selection state, sizing, and tap handler.
 * @returns The rendered Palavreado board.
 */
export function Board({
  letters,
  onLetterSelection,
  selection,
  swap,
  guesses,
  size,
  itemWidth,
  disabled = false,
}: BoardProps) {
  return (
    <div
      className="grid gap-2 rounded-[2rem] bg-surface/85 p-3"
      style={{ gridTemplateColumns: `repeat(${size}, ${itemWidth}px)` }}
    >
      {letters.map((letter, index) => {
        const row = Math.floor(index / size);
        const column = index % size;
        const previousWrongPlacement =
          !letter.locked &&
          guesses.some((attempt) => attempt[row]?.[column] === letter.letter);

        return (
          <Tile
            key={letter.id}
            letter={letter}
            index={index}
            row={row}
            column={column}
            itemWidth={itemWidth}
            isSelected={selection === index}
            isRecentlySwapped={swap.includes(index)}
            previousWrongPlacement={previousWrongPlacement}
            disabled={disabled}
            onLetterSelection={onLetterSelection}
          />
        );
      })}
    </div>
  );
}

/**
 * Props accepted by the {@link Tile} component.
 */
type TileProps = {
  /**
   * The tile's current letter, state, and lock status.
   */
  letter: PalavreadoLetter;
  /**
   * The tile's flat index within the board.
   */
  index: number;
  /**
   * The tile's row, derived from `index` and the board size.
   */
  row: number;
  /**
   * The tile's column, derived from `index` and the board size.
   */
  column: number;
  /**
   * Pixel width/height applied to the tile.
   */
  itemWidth: number;
  /**
   * Whether this tile is the current tap-to-select target.
   */
  isSelected: boolean;
  /**
   * Whether this tile was part of the most recent swap.
   */
  isRecentlySwapped: boolean;
  /**
   * Whether this position was already tested with this exact letter.
   */
  previousWrongPlacement: boolean;
  /**
   * Whether every tile interaction should be disabled.
   */
  disabled: boolean;
  /**
   * Called when the player taps (rather than drags) the tile.
   */
  onLetterSelection: (index: number) => void;
};

/**
 * Renders a single Palavreado tile as both a tap target and a drag-and-drop
 * item: dragging it over another unlocked tile and releasing swaps the two,
 * while a plain tap/click falls back to the existing select-then-swap flow.
 *
 * @param props - Tile data, position, sizing, and interaction handler.
 * @returns The rendered draggable/droppable tile.
 */
function Tile({
  letter,
  index,
  row,
  column,
  itemWidth,
  isSelected,
  isRecentlySwapped,
  previousWrongPlacement,
  disabled,
  onLetterSelection,
}: TileProps) {
  const isInteractive = !letter.locked && !disabled;

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `drop-${letter.id}`,
    data: { index },
    disabled: !isInteractive,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `drag-${letter.id}`,
    data: { index },
    disabled: !isInteractive,
  });

  const isReceiving = isOver && !isDragging && isInteractive;

  return (
    <div
      ref={setDroppableRef}
      style={{ width: itemWidth, height: itemWidth }}
    >
      <motion.button
        ref={setDraggableRef}
        layout
        layoutId={letter.id}
        type="button"
        {...listeners}
        {...attributes}
        whileTap={isInteractive ? { scale: 1.06 } : undefined}
        animate={{
          x: transform ? transform.x : 0,
          y: transform ? transform.y : 0,
          scale: isDragging
            ? 1.15
            : isSelected
              ? 1.06
              : isRecentlySwapped
                ? [1, 1.08, 1]
                : 1,
          opacity: isDragging ? 0.95 : 1,
        }}
        transition={
          isDragging
            ? { type: 'tween', duration: 0 }
            : {
                layout: { type: 'spring', stiffness: 420, damping: 28 },
                scale: { duration: 0.18 },
              }
        }
        onClick={isInteractive ? () => onLetterSelection(index) : undefined}
        disabled={!isInteractive}
        aria-label={`Letra ${letter.letter}, linha ${row + 1}, coluna ${
          column + 1
        }${letter.locked ? ', fixa' : ''}`}
        aria-pressed={isSelected}
        className={cn(
          'flex items-center justify-center rounded-2xl border-2 text-2xl font-extrabold uppercase shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          TILE_TONE_CLASSES[letter.state],
          isInteractive &&
            'cursor-grab hover:border-white active:cursor-grabbing',
          letter.locked && 'cursor-not-allowed',
          previousWrongPlacement && 'border-dashed bg-white/70 text-foreground',
          isSelected && 'border-white bg-yellow-300 text-black',
          isReceiving && 'ring-2 ring-primary ring-inset',
        )}
        style={{
          width: itemWidth,
          height: itemWidth,
          zIndex: isDragging ? 50 : isReceiving ? 40 : 1,
          touchAction: 'none',
        }}
      >
        {letter.letter}
      </motion.button>
    </div>
  );
}
