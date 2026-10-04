import { DailyItem } from '@components/games/DailyItem';
import { cn } from '@utils/cn';
import { ESTOQUISTA_ITEM_CARD_PADDING } from '../utils/constants';

/**
 * Props accepted by the {@link WarehouseGoodCard} component.
 */
type WarehouseGoodCardProps = {
  /**
   * Id of the item sprite to render inside the card.
   */
  itemId: string;
  /**
   * Square width and height of the card, in pixels.
   */
  width: number;
  /**
   * Additional classes merged with the card's own styles.
   */
  className?: string;
  /**
   * Whether to render the card in the highlighted gold state.
   */
  highlighted?: boolean;
};

/**
 * Renders one warehouse good as a rounded card using the shared daily-item
 * sprite system.
 *
 * @param props Item id, square size, optional classes, and highlight state.
 * @returns The rendered warehouse item card.
 */
export function WarehouseGoodCard({
  itemId,
  width,
  className,
  highlighted = false,
}: WarehouseGoodCardProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-2xl border border-border bg-card shadow-sm',
        highlighted && 'border-gold bg-gold-soft',
        className,
      )}
      style={{ width, height: width }}
    >
      <DailyItem
        itemId={itemId}
        width={width}
        padding={ESTOQUISTA_ITEM_CARD_PADDING}
      />
    </div>
  );
}
