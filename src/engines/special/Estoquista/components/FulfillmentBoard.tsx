import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import { CircleOff, Package2, RotateCcw } from 'lucide-react';
import {
  ESTOQUISTA_BOARD_COLUMNS,
  ESTOQUISTA_FULFILLMENT_CARD_MIN_WIDTH,
  ESTOQUISTA_FULFILLMENT_CARD_WIDTH_RATIO,
  ESTOQUISTA_OUT_OF_STOCK_CARD_MIN_WIDTH,
  ESTOQUISTA_PACKAGE_ICON_MIN_SIZE,
  ESTOQUISTA_PACKAGE_ICON_SIZE_RATIO,
  OUT_OF_STOCK_SHELF_INDEX,
} from '../utils/constants';
import type { Fulfillment, GameState, GoodId } from '../utils/types';
import { WarehouseGoodCard } from './WarehouseGoodCard';

/**
 * Props accepted by the {@link FulfillmentBoard} component.
 */
type FulfillmentBoardProps = {
  /**
   * Final warehouse layout established during the stocking phase.
   */
  warehouse: GameState['warehouse'];
  /**
   * Orders already assigned to shelves or to the out-of-stock slot.
   */
  fulfillments: Fulfillment[];
  /**
   * Order currently selected for placement, or `null`.
   */
  activeOrder: GoodId | null;
  /**
   * Called when the active order is assigned to a shelf or to out of stock.
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
 * Renders the stocked warehouse plus the explicit "fora de estoque" drop
 * zone used to classify the one missing order.
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
  const outOfStockFulfillment = fulfillmentByShelf.get(
    OUT_OF_STOCK_SHELF_INDEX,
  );

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className="grid gap-2 rounded-[2rem] bg-amber-900/80 p-3 shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${ESTOQUISTA_BOARD_COLUMNS}, minmax(0, 1fr))`,
        }}
      >
        {warehouse.map((goodId, index) => {
          const fulfillment = fulfillmentByShelf.get(index);
          const isInteractive = !reveal && !fulfillment && !!activeOrder;

          return (
            <div
              key={index}
              className="relative"
              style={{ width, height: width }}
            >
              {fulfillment ? (
                <button
                  type="button"
                  onClick={() => onTakeBack(fulfillment.order)}
                  disabled={reveal}
                  aria-label="Retirar pedido da prateleira"
                  className={cn(
                    'absolute -right-1 -top-1 z-20 rounded-full bg-card p-1 shadow-sm transition-opacity',
                    reveal && 'pointer-events-none',
                  )}
                >
                  <RotateCcw
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                </button>
              ) : null}

              <button
                type="button"
                disabled={!isInteractive}
                aria-label={
                  fulfillment
                    ? 'Prateleira com pedido posicionado'
                    : activeOrder
                      ? `Posicionar pedido na prateleira ${index + 1}`
                      : `Prateleira ${index + 1}`
                }
                onClick={isInteractive ? () => onFulfill(index) : undefined}
                className={cn(
                  'relative flex items-center justify-center rounded-2xl border border-amber-950/50 bg-black/25 text-amber-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80',
                  isInteractive && 'hover:bg-black/35',
                  fulfillment && 'cursor-pointer',
                  !isInteractive && !fulfillment && 'cursor-default',
                )}
                style={{ width, height: width }}
              >
                {reveal && goodId ? (
                  <WarehouseGoodCard
                    itemId={goodId}
                    width={width}
                    className="border-transparent bg-transparent shadow-none"
                  />
                ) : (
                  <Package2
                    size={Math.max(
                      width * ESTOQUISTA_PACKAGE_ICON_SIZE_RATIO,
                      ESTOQUISTA_PACKAGE_ICON_MIN_SIZE,
                    )}
                    aria-hidden="true"
                  />
                )}

                {fulfillment ? (
                  <WarehouseGoodCard
                    itemId={fulfillment.order}
                    width={Math.max(
                      Math.floor(
                        width * ESTOQUISTA_FULFILLMENT_CARD_WIDTH_RATIO,
                      ),
                      ESTOQUISTA_FULFILLMENT_CARD_MIN_WIDTH,
                    )}
                    highlighted
                    className="absolute -top-2 left-1/2 -translate-x-1/2 rotate-6 shadow-md"
                  />
                ) : null}
              </button>
            </div>
          );
        })}
      </div>

      <Surface className="bg-card px-4 py-4">
        <Text
          strong
          className="mb-3 block text-center"
        >
          Fora de estoque
        </Text>

        {outOfStockFulfillment ? (
          <div className="flex flex-col items-center gap-3">
            <WarehouseGoodCard
              itemId={outOfStockFulfillment.order}
              width={Math.max(width, ESTOQUISTA_OUT_OF_STOCK_CARD_MIN_WIDTH)}
              highlighted
            />
            {!reveal && (
              <button
                type="button"
                onClick={() => onTakeBack(outOfStockFulfillment.order)}
                className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <RotateCcw
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                Tirar daqui
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            disabled={!activeOrder || reveal}
            onClick={
              activeOrder
                ? () => onFulfill(OUT_OF_STOCK_SHELF_INDEX)
                : undefined
            }
            className={cn(
              'flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border-strong bg-surface px-4 py-5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              activeOrder &&
                !reveal &&
                'hover:border-primary hover:bg-primary-soft',
              (!activeOrder || reveal) &&
                'cursor-default text-subtle-foreground',
            )}
          >
            <CircleOff
              className="h-5 w-5"
              aria-hidden="true"
            />
            <span className="text-sm font-semibold">
              {activeOrder
                ? 'Marcar pedido como fora de estoque'
                : 'Selecione um pedido para enviar para fora de estoque'}
            </span>
          </button>
        )}
      </Surface>
    </div>
  );
}
