import { DailyItem } from '@components/games/DailyItem';
import { cn } from '@utils/cn';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import type { DailyOrganikuEntry } from '../../../../types/games';
import { ORGANIKU_PLACEHOLDER_ITEM_ID } from '../utils/constants';
import { getRowAndColumnIndexes } from '../utils/helpers';

/**
 * Props accepted by the {@link TableGrid} component.
 */
type TableGridProps = {
  /**
   * Flattened grid of item ids from today's challenge.
   */
  grid: DailyOrganikuEntry['grid'];
  /**
   * Grid indexes already revealed (matched).
   */
  revealed: Dictionary<boolean>;
  /**
   * Index of the first tile flipped in the current pair, or `null`.
   */
  activeTileIndex: number | null;
  /**
   * Index of the second tile flipped in the current pair, or `null`.
   */
  pairActiveTileIndex: number | null;
  /**
   * Called when a clickable tile is tapped.
   */
  onSelectTile: (index: number) => void;
  /**
   * Count of revealed tiles per item id.
   */
  foundCount: Dictionary<number>;
  /**
   * Pixel width/height applied to each square tile.
   */
  itemWidth: number;
  /**
   * Grid indexes revealed from the start.
   */
  defaultRevealedIndexes: number[];
};

/**
 * Renders the game's `gridSize x gridSize` grid of face-down/revealed
 * tiles, blocking tiles that share a row/column with the active tile
 * (since no item repeats within a row or column).
 *
 * @param props Grid data, reveal/selection state, and sizing.
 * @returns The rendered tile grid.
 */
export function TableGrid({
  grid,
  revealed,
  activeTileIndex,
  onSelectTile,
  foundCount,
  itemWidth,
  defaultRevealedIndexes,
  pairActiveTileIndex,
}: TableGridProps) {
  const gridSize = Math.sqrt(grid.length);
  const unavailableIndexes = useMemo(
    () =>
      activeTileIndex !== null
        ? getRowAndColumnIndexes(activeTileIndex, gridSize)
        : [],
    [activeTileIndex, gridSize],
  );
  const disableButton =
    activeTileIndex !== null && pairActiveTileIndex !== null;

  return (
    <div
      className="grid gap-1 rounded-2xl bg-surface/85 p-2"
      style={{ gridTemplateColumns: `repeat(${gridSize}, ${itemWidth}px)` }}
    >
      {grid.map((itemId, index) => {
        const isVisible =
          revealed[index] ||
          activeTileIndex === index ||
          pairActiveTileIndex === index;
        const isClickable =
          !revealed[index] &&
          (!disableButton || !unavailableIndexes.includes(index));
        const isBlocked = unavailableIndexes.includes(index);
        const isActive =
          activeTileIndex === index || pairActiveTileIndex === index;
        const isAllRevealed = foundCount[itemId] === gridSize;
        const key = `${itemId}-${index}-${isActive}`;

        return (
          <motion.button
            key={key}
            type="button"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            disabled={!isClickable}
            onClick={isClickable ? () => onSelectTile(index) : undefined}
            className={cn(
              'flex items-center justify-center rounded-xl bg-surface-raised transition-colors',
              // Listed in increasing priority: tailwind-merge keeps only the
              // last conflicting `bg-*`/state class applied here.
              isActive &&
                'z-10 bg-secondary-soft outline outline-2 outline-secondary',
              isBlocked && 'cursor-not-allowed bg-border',
              defaultRevealedIndexes.includes(index) && 'bg-secondary',
              isAllRevealed && 'bg-gold',
            )}
            style={{ width: itemWidth, height: itemWidth }}
          >
            {isVisible ? (
              <DailyItem
                itemId={itemId}
                width={itemWidth}
              />
            ) : (
              <DailyItem
                itemId={ORGANIKU_PLACEHOLDER_ITEM_ID}
                width={itemWidth / 1.75}
                className="opacity-50 grayscale-50"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
