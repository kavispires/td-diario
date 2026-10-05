import { cn } from '@utils/cn';
import { Package2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ESTOQUISTA_BOARD_COLUMNS,
  ESTOQUISTA_BOARD_GRID_CLASSNAME,
  ESTOQUISTA_CELL_IDLE_CLASSNAME,
  ESTOQUISTA_CELL_INTERACTIVE_CLASSNAME,
  ESTOQUISTA_GOOD_LAYOUT_TRANSITION,
  ESTOQUISTA_PACKAGE_ICON_MIN_SIZE,
  ESTOQUISTA_PACKAGE_ICON_SIZE_RATIO,
  ESTOQUISTA_PACKAGE_MORPH_SCALE,
  ESTOQUISTA_TRANSITION_DURATION,
} from '../utils/constants';
import type { GameState } from '../utils/types';
import { WarehouseGoodItem } from './WarehouseGoodItem';

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
 * Builds the shared `layoutId` used to animate a good flying from the
 * "current good" preview card into its shelf, matching the id used by
 * `EstoquistaGame`'s preview card.
 *
 * @param goodId - Id of the good being placed.
 * @returns The shared `layoutId` string.
 */
export function getGoodLayoutId(goodId: string): string {
  return `estoquista-good-${goodId}`;
}

/**
 * Renders Estoquista's stocking-phase 4x4 shelf grid. Empty shelves are
 * selectable; placing a good flies it in from the "current good" preview
 * card via a shared `layoutId`, and it turns into an anonymous package icon
 * once the next good is placed (or, for the last good, after a short delay).
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
    <div
      className={ESTOQUISTA_BOARD_GRID_CLASSNAME}
      style={{
        gridTemplateColumns: `repeat(${ESTOQUISTA_BOARD_COLUMNS}, minmax(0, 1fr))`,
      }}
    >
      {warehouse.map((goodId, index) => {
        const isHighlighted = goodId !== null && goodId === lastPlacedGoodId;

        return (
          <div
            key={index}
            className={cn(
              'flex items-center justify-center',
              goodId && !isHighlighted && ESTOQUISTA_CELL_IDLE_CLASSNAME,
            )}
            style={{ width, height: width }}
          >
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              {!goodId ? (
                <motion.button
                  key="empty"
                  type="button"
                  aria-label={`Colocar produto na prateleira ${index + 1}`}
                  onClick={() => onPlaceGood(index)}
                  className={cn(
                    'flex items-center justify-center text-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80',
                    ESTOQUISTA_CELL_INTERACTIVE_CLASSNAME,
                  )}
                  style={{ width, height: width }}
                >
                  ?
                </motion.button>
              ) : isHighlighted ? (
                <motion.div
                  key={`${goodId}-item`}
                  layoutId={getGoodLayoutId(goodId)}
                  transition={ESTOQUISTA_GOOD_LAYOUT_TRANSITION}
                  exit={{
                    scale: ESTOQUISTA_PACKAGE_MORPH_SCALE,
                    opacity: 0,
                    transition: {
                      duration: ESTOQUISTA_TRANSITION_DURATION,
                      ease: 'easeOut',
                    },
                  }}
                >
                  <WarehouseGoodItem
                    goodId={goodId}
                    width={width}
                    highlighted
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="package"
                  initial={{
                    scale: ESTOQUISTA_PACKAGE_MORPH_SCALE,
                    opacity: 0,
                  }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: ESTOQUISTA_TRANSITION_DURATION,
                    ease: 'easeOut',
                  }}
                >
                  <Package2
                    size={Math.max(
                      width * ESTOQUISTA_PACKAGE_ICON_SIZE_RATIO,
                      ESTOQUISTA_PACKAGE_ICON_MIN_SIZE,
                    )}
                    aria-hidden="true"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
