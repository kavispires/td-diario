import { Heart } from 'lucide-react';

/**
 * Props accepted by the {@link Hearts} component.
 */
type HeartsProps = {
  /**
   * Remaining hearts (lives) to render as filled.
   */
  remaining: number;
  /**
   * Total hearts (lives) the player started with.
   */
  total: number;
  /**
   * Size, in pixels, applied to each heart icon. Defaults to `20`.
   */
  size?: number;
  /**
   * Color class applied to empty (not-yet-lost) hearts' outline. Defaults
   * to a subtle border color; pass a darker class (e.g. `text-black`) when
   * rendering atop a saturated background, such as a game's results splash,
   * so empty hearts stay visible.
   */
  emptyClassName?: string;
};

/**
 * Renders a row of filled/empty heart icons representing remaining lives.
 *
 * @param props Remaining and total hearts, optional icon size, and an
 *   optional color override for empty hearts' outline.
 * @returns The rendered hearts row.
 */
export function Hearts({
  remaining,
  total,
  size = 20,
  emptyClassName = 'text-border-strong',
}: HeartsProps) {
  return (
    <div
      className="flex items-center gap-1"
      role="status"
      aria-label={`${remaining} de ${total} vidas restantes`}
    >
      {Array.from({ length: total }, (_, index) => {
        const isFilled = index < remaining;
        return (
          <Heart
            key={index}
            size={size}
            className={isFilled ? 'text-destructive' : emptyClassName}
            fill={isFilled ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
