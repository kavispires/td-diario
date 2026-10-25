import { DEFAULT_SPRITE_SIZE, Sprite } from '@components/sprites/Sprite';
import { Tooltip } from '@components/ui/Tooltip';
import { useGetDailyChallenges } from '@hooks/useGetDailyChallenges';
import { useLongPress } from '@hooks/useLongPress';

const SPRITE_SHEET_BUCKET_SIZE = 64;

/**
 * Resolves an item id (e.g. `"577"`) to its sprite sheet name and the
 * `<symbol>` id within that sheet. Items are bucketed into sheets of
 * {@link SPRITE_SHEET_BUCKET_SIZE} to keep each sheet a manageable size.
 *
 * @param itemId - The item's numeric id, as a string.
 * @returns A tuple of `[spriteSheetSource, symbolId]`.
 */
export function getItemSpriteSource(itemId: string): [string, string] {
  const match = itemId.match(/\d+/);
  const numId = match ? Number.parseInt(match[0], 10) : 0;
  const symbolId = `item-${numId}`;
  const bucket =
    Math.ceil(numId / SPRITE_SHEET_BUCKET_SIZE) * SPRITE_SHEET_BUCKET_SIZE;
  const source = `items-${bucket}`;
  return [source, symbolId];
}

/**
 * Props accepted by the {@link DailyItem} component.
 */
type DailyItemProps = {
  /**
   * The item's numeric id, as found in a daily challenge's grid/list data.
   */
  itemId: string;
  /**
   * Width and height of the rendered item. Defaults to `DEFAULT_SPRITE_SIZE`.
   */
  width?: number;
  /**
   * Optional tooltip label shown on hover/focus (e.g. the item's name).
   */
  title?: string;
  /**
   * Additional classes merged with the item's own classes.
   */
  className?: string;
  /**
   * Padding applied inside the item, shrinking the visible sprite so it
   * doesn't touch its container's edges. Defaults to `6`.
   */
  padding?: number;
  /**
   * When `true`, never shows the name tooltip, regardless of `title` or
   * the daily dictionary. Useful for items rendered inside a fast-tapping
   * game action (e.g. Aqui Ó's discs), where the long-press tooltip
   * gesture conflicts with quick taps and makes selection feel buggy.
   * Defaults to `false`.
   */
  disableTooltip?: boolean;
};

/**
 * Renders a single game item (e.g. a grid tile or tracker icon) by
 * resolving its id to the matching sprite sheet symbol. On a press-and-hold
 * of 1+ second (for touch devices without hover), shows the item's name in
 * a tooltip when it's present in today's `metadata.dictionary`, unless
 * `disableTooltip` is set.
 *
 * @param props Item id, sizing, optional tooltip title, classes, padding,
 *   and whether the tooltip is disabled.
 * @returns The rendered item sprite.
 */
export function DailyItem({
  itemId,
  width = DEFAULT_SPRITE_SIZE,
  title,
  className,
  padding = 6,
  disableTooltip = false,
}: DailyItemProps) {
  const [source, spriteId] = getItemSpriteSource(itemId);
  const dailyChallenges = useGetDailyChallenges();
  const dictionary = dailyChallenges.data?.metadata?.dictionary;
  const tooltipTitle = disableTooltip
    ? undefined
    : (title ?? dictionary?.[itemId]);
  const { isPressing, handlers, dismiss } = useLongPress({
    enabled: !!tooltipTitle,
  });

  const sprite = (
    <span {...handlers}>
      <Sprite
        source={source}
        spriteId={spriteId}
        width={width}
        className={className}
        padding={padding}
      />
    </span>
  );

  return tooltipTitle ? (
    <Tooltip
      title={tooltipTitle}
      open={isPressing}
      onDismiss={dismiss}
    >
      {sprite}
    </Tooltip>
  ) : (
    sprite
  );
}
