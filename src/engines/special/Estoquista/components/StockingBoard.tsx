import { Package2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { GameState } from '../utils/types';
import { WarehouseGoodCard } from './WarehouseGoodCard';

/**
 * Props accepted by the {@link StockingBoard} component.
 */
type StockingBoardProps = {
  /**
   * Current warehouse shelf contents.
   */
  warehouse: GameState['warehouse'];
  /**
   * Called when the player chooses an empty shelf for the current good.
   */
  onPlaceGood: (shelfIndex: number) => void;
  /**
   * Id of the most recently placed good, kept visible as placement feedback.
   */
  lastPlacedGoodId: string | null;
  /**
   * Square width and height of each shelf cell, in pixels.
   */
  width: number;
};

/**
 * Renders Estoquista's stocking-phase 4x4 shelf grid, where empty shelves
 * are selectable and stocked shelves turn into anonymous boxes after the
 * latest placement.
 *
 * @param props Warehouse state, placement handler, latest good, and sizing.
 * @returns The rendered stocking board.
 */
export function StockingBoard({
  warehouse,
  onPlaceGood,
  lastPlacedGoodId,
  width,
}: StockingBoardProps) {
  return (
    <div className="grid grid-cols-4 gap-2 rounded-[2rem] bg-amber-900/80 p-3 shadow-inner">
      {warehouse.map((goodId, index) => {
        if (!goodId) {
          return (
            <button
              key={index}
              type="button"
              aria-label={`Colocar produto na prateleira ${index + 1}`}
              onClick={() => onPlaceGood(index)}
              className="flex items-center justify-center rounded-2xl border-2 border-dashed border-amber-100/60 bg-black/25 text-xl font-semibold text-white transition-colors hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              style={{ width, height: width }}
            >
              ?
            </button>
          );
        }

        if (goodId !== lastPlacedGoodId) {
          return (
            <div
              key={index}
              className="flex items-center justify-center rounded-2xl border border-amber-950/50 bg-black/25 text-amber-50"
              style={{ width, height: width }}
            >
              <Package2
                size={Math.max(width * 0.5, 24)}
                aria-hidden="true"
              />
            </div>
          );
        }

        return (
          <motion.div
            key={`${goodId}-${index}`}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <WarehouseGoodCard
              itemId={goodId}
              width={width}
              highlighted
            />
          </motion.div>
        );
      })}
    </div>
  );
}
