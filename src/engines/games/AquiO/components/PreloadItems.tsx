import { DailyItem } from '@components/games/DailyItem';
import { motion } from 'motion/react';

/**
 * Props accepted by the {@link PreloadItems} component.
 */
type PreloadItemsProps = {
  /**
   * Pool of item ids that can appear in today's discs.
   */
  items: string[];
  /**
   * Optional dictionary used to expose hover labels for each previewed item.
   */
  itemLabels?: Dictionary<string>;
};

/**
 * Shows a lightweight preview of today's item pool before the player starts
 * the timed round.
 *
 * @param props Today's item ids and optional item-name dictionary.
 * @returns The rendered preload grid.
 */
export function PreloadItems({ items, itemLabels }: PreloadItemsProps) {
  return (
    <motion.div
      className="grid w-full grid-cols-5 gap-2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {items.slice(0, 15).map((itemId, index) => (
        <motion.div
          key={itemId}
          className="flex items-center justify-center rounded-2xl bg-background/80 p-1 shadow-sm"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03, duration: 0.2 }}
        >
          <DailyItem
            itemId={itemId}
            width={40}
            title={itemLabels?.[itemId]}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
