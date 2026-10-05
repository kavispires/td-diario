import { useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '@utils/cn';
import { Check, Package2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ESTOQUISTA_BOARD_COLUMNS,
  ESTOQUISTA_BOARD_GRID_CLASSNAME,
  ESTOQUISTA_CELL_IDLE_CLASSNAME,
  ESTOQUISTA_CELL_INTERACTIVE_CLASSNAME,
  ESTOQUISTA_ORDER_PLACEMENT_ROTATION,
  ESTOQUISTA_PACKAGE_ICON_MIN_SIZE,
  ESTOQUISTA_PACKAGE_ICON_SIZE_RATIO,
  ESTOQUISTA_PACKAGE_MORPH_SCALE,
  ESTOQUISTA_TRANSITION_DURATION,
} from '../utils/constants';
import { isFulfillmentCorrect } from '../utils/helpers';
import type { Fulfillment, GameState, GoodId } from '../utils/types';
import { WarehouseGoodItem } from './WarehouseGoodItem';

/**
 * Props accepted by the {@link FulfillmentBoard} component.
 */
type FulfillmentBoardProps = {
  /**
   * Final warehouse layout established during the stocking phase.
   */
  warehouse: GameState['warehouse'];
  /**
   * Orders already assigned to shelves.
   */
  fulfillments: Fulfillment[];
  /**
   * Order currently selected for placement, or `null`.
   */
  activeOrder: GoodId | null;
  /**
   * Called when the active order is assigned to a shelf.
   */
  onFulfill: (shelfIndex: number) => void;
  /**
   * Called when an already-assigned order should be removed.
   */
  onTakeBack: (order: GoodId) => void;
  /**
   * Square width and height of each shelf cell, in pixels.
   */
  width: number;
  /**
   * Whether the final warehouse goods should be shown.
   */
  reveal?: boolean;
};

/**
 * Props accepted by the {@link FulfillmentCell} component.
 */
type FulfillmentCellProps = {
  /**
   * Shelf index this cell represents.
   */
  shelfIndex: number;
  /**
   * Good stocked on this shelf.
   */
  goodId: GoodId | null;
  /**
   * Final warehouse shelf contents, used to judge correctness once revealed.
   */
  warehouse: GameState['warehouse'];
  /**
   * Order already assigned to this shelf, if any.
   */
  fulfillment: Fulfillment | undefined;
  /**
   * Whether the currently active order could be dropped here right now.
   */
  canPlace: boolean;
  /**
   * Whether the final warehouse goods should be revealed.
   */
  reveal: boolean;
  /**
   * Square width and height of the cell, in pixels.
   */
  width: number;
  /**
   * Called when an empty, placeable cell is clicked or dropped onto.
   */
  onFulfill: (shelfIndex: number) => void;
  /**
   * Called when an already-assigned order should be removed.
   */
  onTakeBack: (order: GoodId) => void;
};

/**
 * Renders one shelf within the fulfillment board, sharing the stocking
 * board's package/idle/interactive visual states so both phases look the
 * same. A placed order sits on top of the shelf's package icon at a slight
 * angle, like a sticky note, instead of replacing it; clicking it sends it
 * back to the orders list. Accepts both taps (via `onFulfill`/`onTakeBack`)
 * and drag-and-drop (via `useDroppable`).
 *
 * @param props Shelf data, assignment state, handlers, sizing, and reveal flag.
 * @returns The rendered fulfillment cell.
 */
function FulfillmentCell({
  shelfIndex,
  goodId,
  warehouse,
  fulfillment,
  canPlace,
  reveal,
  width,
  onFulfill,
  onTakeBack,
}: FulfillmentCellProps) {
  const isInteractive = !reveal && !fulfillment && canPlace;
  const { isOver, setNodeRef } = useDroppable({
    id: `estoquista-shelf-${shelfIndex}`,
    data: { shelfIndex },
    disabled: reveal || !!fulfillment,
  });
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `estoquista-order-${fulfillment?.order}`,
    data: { order: fulfillment?.order },
    disabled: reveal || !fulfillment,
  });
  const isCorrect =
    reveal && fulfillment ? isFulfillmentCorrect(fulfillment, warehouse) : null;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative flex items-center justify-center',
        isInteractive || isOver
          ? ESTOQUISTA_CELL_INTERACTIVE_CLASSNAME
          : ESTOQUISTA_CELL_IDLE_CLASSNAME,
      )}
      style={{ width, height: width }}
    >
      {isCorrect !== null ? (
        <span
          className={cn(
            'absolute -right-1 -top-1 z-20 rounded-full p-1 text-white shadow-sm',
            isCorrect ? 'bg-gold' : 'bg-destructive',
          )}
        >
          {isCorrect ? (
            <Check
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
          ) : (
            <X
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
          )}
        </span>
      ) : null}

      <AnimatePresence
        mode="wait"
        initial={false}
      >
        {reveal && goodId ? (
          <motion.div
            key="revealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: ESTOQUISTA_TRANSITION_DURATION,
              ease: 'easeOut',
            }}
          >
            <WarehouseGoodItem
              goodId={goodId}
              width={width}
              highlighted
            />
          </motion.div>
        ) : (
          <motion.button
            key="package"
            type="button"
            disabled={!isInteractive}
            aria-label={
              isInteractive
                ? `Posicionar pedido na prateleira ${shelfIndex + 1}`
                : `Prateleira ${shelfIndex + 1}`
            }
            onClick={isInteractive ? () => onFulfill(shelfIndex) : undefined}
            className="flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            style={{ width, height: width }}
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
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {fulfillment ? (
          <motion.button
            key={`${fulfillment.order}-placed`}
            ref={setDraggableNodeRef}
            type="button"
            {...listeners}
            {...attributes}
            disabled={reveal}
            onClick={!reveal ? () => onTakeBack(fulfillment.order) : undefined}
            aria-label={
              reveal
                ? `Pedido posicionado na prateleira ${shelfIndex + 1}`
                : `Retirar ou arrastar pedido da prateleira ${shelfIndex + 1}`
            }
            initial={{ scale: 0.5, opacity: 0, rotate: 0 }}
            animate={{
              x: transform ? transform.x : 0,
              y: transform ? transform.y : 0,
              scale: isDragging ? 1.1 : 1,
              opacity: isDragging ? 0.95 : 1,
              rotate: ESTOQUISTA_ORDER_PLACEMENT_ROTATION,
            }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={
              isDragging
                ? { type: 'tween', duration: 0 }
                : {
                    duration: ESTOQUISTA_TRANSITION_DURATION,
                    ease: 'easeOut',
                  }
            }
            style={{
              zIndex: isDragging ? 30 : 10,
              touchAction: 'none',
            }}
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              !reveal && 'cursor-grab active:cursor-grabbing',
            )}
          >
            <WarehouseGoodItem
              goodId={fulfillment.order}
              width={width}
              highlighted
              className="shadow-lg"
            />
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * Renders the stocked warehouse shelf grid during the fulfillment phase,
 * visually matching the stocking board and supporting both tap-to-place and
 * drag-and-drop. The one order with no matching good is never explicitly
 * placed; it is inferred as whichever order is left unassigned.
 *
 * @param props Warehouse data, assignment state, handlers, sizing, and reveal flag.
 * @returns The rendered fulfillment board.
 */
export function FulfillmentBoard({
  warehouse,
  fulfillments,
  activeOrder,
  onFulfill,
  onTakeBack,
  width,
  reveal = false,
}: FulfillmentBoardProps) {
  const fulfillmentByShelf = new Map(
    fulfillments.map((fulfillment) => [fulfillment.shelfIndex, fulfillment]),
  );

  return (
    <div
      className={ESTOQUISTA_BOARD_GRID_CLASSNAME}
      style={{
        gridTemplateColumns: `repeat(${ESTOQUISTA_BOARD_COLUMNS}, minmax(0, 1fr))`,
      }}
    >
      {warehouse.map((goodId, index) => (
        <FulfillmentCell
          key={index}
          shelfIndex={index}
          goodId={goodId}
          warehouse={warehouse}
          fulfillment={fulfillmentByShelf.get(index)}
          canPlace={!!activeOrder}
          reveal={reveal}
          width={width}
          onFulfill={onFulfill}
          onTakeBack={onTakeBack}
        />
      ))}
    </div>
  );
}
