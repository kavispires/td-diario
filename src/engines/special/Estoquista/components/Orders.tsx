import { Pill } from '@components/ui/Pill';
import { Surface } from '@components/ui/Surface';
import { cn } from '@utils/cn';
import { Check, ClipboardList } from 'lucide-react';
import {
  ESTOQUISTA_ORDER_CARD_MIN_WIDTH,
  ESTOQUISTA_ORDER_CARD_WIDTH_RATIO,
} from '../utils/constants';
import type { Fulfillment, GoodId } from '../utils/types';
import { WarehouseGoodCard } from './WarehouseGoodCard';

/**
 * Props accepted by the {@link Orders} component.
 */
type OrdersProps = {
  /**
   * Orders that still need to be classified.
   */
  orders: GoodId[];
  /**
   * Orders already assigned to shelves or to the out-of-stock slot.
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
};

/**
 * Renders the list of incoming customer orders, highlighting the currently
 * selected one and dimming orders that have already been assigned.
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
}: OrdersProps) {
  return (
    <Surface className="flex w-full items-start gap-3 bg-card px-4 py-4">
      <div className="flex flex-col items-center gap-2 pt-1 text-primary">
        <ClipboardList
          className="h-6 w-6"
          aria-hidden="true"
        />
        <Pill className="bg-primary text-white">
          {fulfillments.length}/{orders.length}
        </Pill>
      </div>

      <div className="flex flex-1 flex-wrap justify-center gap-2">
        {orders.map((order) => {
          const isFulfilled = fulfillments.some(
            (fulfillment) => fulfillment.order === order,
          );
          const isActive = activeOrder === order;

          return (
            <button
              key={order}
              type="button"
              aria-pressed={isActive}
              aria-label={
                isFulfilled
                  ? 'Pedido já posicionado'
                  : isActive
                    ? 'Pedido selecionado'
                    : 'Selecionar pedido'
              }
              disabled={isFulfilled}
              onClick={() => onSelectOrder(order)}
              className={cn(
                'relative rounded-2xl transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive && 'rotate-3',
                isFulfilled && 'cursor-not-allowed opacity-45 grayscale',
              )}
            >
              {isFulfilled && (
                <span className="absolute -right-1 -top-1 z-10 rounded-full bg-gold p-1 text-chrome shadow-sm">
                  <Check
                    className="h-3 w-3"
                    aria-hidden="true"
                  />
                </span>
              )}
              <WarehouseGoodCard
                itemId={order}
                width={Math.max(
                  Math.floor(shelfWidth * ESTOQUISTA_ORDER_CARD_WIDTH_RATIO),
                  ESTOQUISTA_ORDER_CARD_MIN_WIDTH,
                )}
                highlighted={isActive}
                className={cn(
                  isActive && 'border-gold bg-gold-soft',
                  !isActive && !isFulfilled && 'hover:border-primary',
                )}
              />
            </button>
          );
        })}
      </div>
    </Surface>
  );
}
