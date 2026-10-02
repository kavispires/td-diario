import { Sprite } from '@components/sprites/Sprite';
import { cn } from '@utils/cn';

/**
 * Props accepted by the {@link AlienSign} component.
 */
type AlienSignProps = {
  /**
   * Numeric id of the alien symbol to render.
   */
  signId: string;
  /**
   * Pixel width/height of the sign tile.
   */
  width: number;
  /**
   * Additional classes merged with the tile container.
   */
  className?: string;
};

/**
 * Renders one of Alienado's alien-language symbol cards.
 *
 * @param props Symbol id, sizing, and optional extra classes.
 * @returns The rendered alien sign.
 */
export function AlienSign({ signId, width, className }: AlienSignProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-2xl bg-surface-raised p-2 shadow-sm',
        className,
      )}
      style={{ width, height: width }}
    >
      <Sprite
        source="alien-signs"
        spriteId={`sign-${signId}`}
        width={width - 12}
        padding={0}
      />
    </div>
  );
}
