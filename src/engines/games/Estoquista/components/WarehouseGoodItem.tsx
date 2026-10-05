import { Sprite } from '@components/sprites/Sprite';
import { cn } from '@utils/cn';
import { ESTOQUISTA_ITEM_CARD_PADDING } from '../utils/constants';

/**
 * Props accepted by the {@link WarehouseGoodItem} component.
 */
type WarehouseGoodItemProps = {
  /**
   * Id of the item sprite to render inside the card.
   */
  goodId: string;
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
export function WarehouseGoodItem({
  goodId,
  width,
  className,
  highlighted = false,
}: WarehouseGoodItemProps) {
  const [source, spriteId] = getGoodSpriteSource(goodId);

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-2xl border border-border bg-card shadow-sm',
        highlighted && 'border-gold bg-gold-soft',
        className,
      )}
      style={{ width, height: width }}
    >
      <Sprite
        source={source}
        spriteId={spriteId}
        width={width}
        padding={ESTOQUISTA_ITEM_CARD_PADDING}
      />
    </div>
  );
}

const SPRITE_SHEET_BUCKET_SIZE = 64;

/**
 * Resolves an good id (e.g. `"577"`) to its sprite sheet name and the
 * `<symbol>` id within that sheet. Items are bucketed into sheets of
 * {@link SPRITE_SHEET_BUCKET_SIZE} to keep each sheet a manageable size.
 *
 * @param itemId - The good's numeric id, as a string.
 * @returns A tuple of `[spriteSheetSource, symbolId]`.
 */
export function getGoodSpriteSource(itemId: string): [string, string] {
  const match = itemId.match(/\d+/);
  const numId = match ? Number.parseInt(match[0], 10) : 0;
  const symbolId = `good-${numId}`;
  const bucket =
    Math.ceil(numId / SPRITE_SHEET_BUCKET_SIZE) * SPRITE_SHEET_BUCKET_SIZE;
  const source = `warehouse-goods-${bucket}`;
  return [source, symbolId];
}
