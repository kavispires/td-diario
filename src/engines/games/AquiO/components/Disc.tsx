import { DailyItem } from '@components/games/DailyItem';
import { cn } from '@utils/cn';
import { motion } from 'motion/react';
import type { AquiODisc } from '../utils/types';

const DISC_POSITION_CLASSES: Record<number, string> = {
  0: 'col-start-2 row-start-2',
  1: 'col-start-3 row-start-2',
  2: 'col-start-4 row-start-2',
  3: 'col-start-2 row-start-3',
  4: 'col-start-3 row-start-3',
  5: 'col-start-4 row-start-3',
  6: 'col-start-2 row-start-4',
  7: 'col-start-3 row-start-4',
  8: 'col-start-4 row-start-4',
} as const;

/**
 * Props accepted by the {@link Disc} component.
 */
type DiscProps = {
  /**
   * Disc to render for the current Aqui O pair.
   */
  disc: AquiODisc;
  /**
   * Pixel width/height used for the circular disc.
   */
  width: number;
  /**
   * Called when the player selects one item from the disc.
   */
  onSelect: (itemId: string) => void;
  /**
   * Additional delay before the disc animates into place.
   */
  animationDelay?: number;
};

/**
 * Renders one interactive Aqui O disc as a 3x3 item layout inside a round
 * board, with light entrance motion for each new pair.
 *
 * @param props Disc data, its rendered size, and the item-selection handler.
 * @returns The rendered disc.
 */
export function Disc({ disc, width, onSelect, animationDelay = 0 }: DiscProps) {
  const itemWidth = Math.max(42, Math.floor(width / 4));

  return (
    <motion.div
      className="grid overflow-hidden rounded-full bg-[#9b6b3f] p-3 shadow-[0_4px_16px_rgba(0,0,0,0.28)]"
      style={{
        width,
        height: width,
        gridTemplateColumns: '1fr 2fr 2fr 2fr 1fr',
        gridTemplateRows: '1fr 2fr 2fr 2fr 1fr',
      }}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.32,
        delay: animationDelay,
        type: 'spring',
        stiffness: 220,
        damping: 20,
      }}
    >
      {disc.items.map((item) => (
        <button
          key={`${disc.id}-${item.itemId}-${item.position}`}
          type="button"
          className={cn(
            'flex items-center justify-center rounded-full bg-white/20 p-1 transition-colors duration-150 hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
            DISC_POSITION_CLASSES[item.position],
          )}
          style={{
            transform: `rotate(${item.rotation}deg) scale(${item.size / 100})`,
            zIndex: item.zIndex,
          }}
          onClick={() => onSelect(item.itemId)}
          aria-label="Selecionar item do disco"
        >
          <DailyItem
            itemId={item.itemId}
            width={itemWidth}
            padding={9}
          />
        </button>
      ))}
    </motion.div>
  );
}
