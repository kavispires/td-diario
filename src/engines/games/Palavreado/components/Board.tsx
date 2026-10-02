import { cn } from '@utils/cn';
import { motion } from 'motion/react';
import type { PalavreadoLetter } from '../utils/types';

const TILE_TONE_CLASSES = {
  idle: 'bg-white/85 text-foreground border-border-strong',
  0: 'bg-red-500 text-white border-red-400',
  1: 'bg-blue-500 text-white border-blue-400',
  2: 'bg-purple-500 text-white border-purple-400',
  3: 'bg-amber-700 text-white border-amber-600',
  4: 'bg-orange-500 text-white border-orange-400',
} as const;

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
        const isSelected = selection === index;
        const isRecentlySwapped = swap.includes(index);
        const previousWrongPlacement =
          !letter.locked &&
          guesses.some((attempt) => attempt[row]?.[column] === letter.letter);

        return (
          <motion.button
            key={letter.id}
            layout
            type="button"
            whileTap={letter.locked || disabled ? undefined : { scale: 1.06 }}
            animate={{
              scale: isSelected ? 1.06 : isRecentlySwapped ? [1, 1.08, 1] : 1,
            }}
            transition={{
              layout: { type: 'spring', stiffness: 420, damping: 28 },
              scale: { duration: 0.18 },
            }}
            onClick={
              letter.locked || disabled
                ? undefined
                : () => onLetterSelection(index)
            }
            disabled={letter.locked || disabled}
            aria-label={`Letra ${letter.letter}, linha ${row + 1}, coluna ${
              column + 1
            }${letter.locked ? ', fixa' : ''}`}
            aria-pressed={isSelected}
            className={cn(
              'flex items-center justify-center rounded-2xl border-2 text-2xl font-extrabold uppercase shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              TILE_TONE_CLASSES[letter.state],
              !letter.locked &&
                !disabled &&
                'cursor-pointer hover:border-white',
              letter.locked && 'cursor-not-allowed',
              previousWrongPlacement &&
                'border-dashed bg-white/70 text-foreground',
              isSelected && 'border-white bg-yellow-300 text-black',
            )}
            style={{ width: itemWidth, height: itemWidth }}
          >
            {letter.letter}
          </motion.button>
        );
      })}
    </div>
  );
}
