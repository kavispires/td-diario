import { Pill } from '@components/ui/Pill';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@utils/cn';
import { ClipboardList } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ESTOQUISTA_ORDER_CARD_MIN_WIDTH,
  ESTOQUISTA_ORDER_CARD_WIDTH_RATIO,
  ESTOQUISTA_OUT_OF_STOCK_ORDER_COUNT,
} from '../utils/constants';
import type { Fulfillment, GoodId } from '../utils/types';
import { WarehouseGoodItem } from './WarehouseGoodItem';

/**
 * Props accepted by the {@link OrderCard} component.
 */
type OrderCardProps = {
  /**
   * Order id rendered by this card.
   */
  order: GoodId;
  /**
   * Whether this order is the currently tap-selected one.
   */
  isActive: boolean;
  /**
   * Pixel width applied to the order's icon card.
   */
  width: number;
  /**
   * Called when the player taps the card instead of dragging it.
   */
  onSelectOrder: (order: GoodId) => void;
};

/**
 * Renders one draggable, not-yet-placed order card. Supports both the
 * original tap-to-select flow and dragging the card directly onto a shelf.
 *
 * @param props Order data, selection state, sizing, and handler.
 * @returns The rendered order card.
 */
function OrderCard({ order, isActive, width, onSelectOrder }: OrderCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `estoquista-order-${order}`,
      data: { order },
    });

  return (
    <motion.button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      aria-pressed={isActive}
      aria-label={isActive ? 'Pedido selecionado' : 'Selecionar pedido'}
      onClick={() => onSelectOrder(order)}
      layout
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{
        x: transform ? transform.x : 0,
        y: transform ? transform.y : 0,
        rotate: isActive ? 3 : 0,
        scale: isDragging ? 1.1 : 1,
        opacity: isDragging ? 0.95 : 1,
      }}
      exit={{ scale: 0.6, opacity: 0 }}
      transition={
        isDragging ? { type: 'tween', duration: 0 } : { duration: 0.15 }
      }
      style={{ zIndex: isDragging ? 10 : undefined, touchAction: 'none' }}
      className="relative cursor-grab rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:cursor-grabbing"
    >
      <WarehouseGoodItem
        goodId={order}
        width={width}
        highlighted={isActive}
        className={cn(
          isActive && 'border-gold bg-gold-soft',
          'hover:border-primary',
        )}
      />
    </motion.button>
  );
}

/**
 * Props accepted by the {@link Orders} component.
 */
type OrdersProps = {
  /**
   * Orders that still need to be classified.
   */
  orders: GoodId[];
  /**
   * Orders already assigned to shelves.
   */
  fulfillments: Fulfillment[];
  /**
   * Order currently selected for placement, or `null`.
   */
  activeOrder: GoodId | null;
  /**
   * Called when the player toggles an order selection.
   */
  onSelectOrder: (order: GoodId) => void;
  /**
   * Base card width used to size each order card.
   */
  shelfWidth: number;
  /**
   * Number of orders the player must actively place; the one left over is
   * automatically treated as out of stock.
   */
  requiredCount: number;
};

/**
 * Renders the list of incoming customer orders still waiting to be placed,
 * highlighting the currently selected one. Orders already assigned to a
 * shelf are removed from this list entirely (they appear on the shelf
 * itself instead).
 *
 * @param props Orders, selection state, assignment state, handler, and sizing.
 * @returns The rendered orders strip.
 */
export function Orders({
  orders,
  fulfillments,
  activeOrder,
  onSelectOrder,
  shelfWidth,
  requiredCount,
}: OrdersProps) {
  const pendingOrders = orders.filter(
    (order) => !fulfillments.some((fulfillment) => fulfillment.order === order),
  );

  return (
    <Surface className="flex flex-col w-full items-start gap-3 bg-card px-4 py-4">
      <Text className="text-sm text-center mt-0">
        {pendingOrders.length > ESTOQUISTA_OUT_OF_STOCK_ORDER_COUNT ? (
          <>
            Arraste os pedidos que estão em estoque para a prateleira correta,
            um a um.
          </>
        ) : (
          <>Agora aperte Enviar Pedidos para confirmar as compras.</>
        )}
      </Text>
      <div className="flex w-full items-start gap-2">
        <div className="flex flex-col items-center gap-2 pt-1 text-primary">
          <ClipboardList
            className="h-6 w-6"
            aria-hidden="true"
          />
          <Pill className="bg-primary text-white">
            {fulfillments.length}/{requiredCount}
          </Pill>
        </div>

        <div className="flex flex-1 flex-wrap justify-center gap-2">
          <AnimatePresence initial={false}>
            {pendingOrders.map((order) => (
              <OrderCard
                key={order}
                order={order}
                isActive={activeOrder === order}
                width={Math.max(
                  Math.floor(shelfWidth * ESTOQUISTA_ORDER_CARD_WIDTH_RATIO),
                  ESTOQUISTA_ORDER_CARD_MIN_WIDTH,
                )}
                onSelectOrder={onSelectOrder}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Surface>
  );
}
