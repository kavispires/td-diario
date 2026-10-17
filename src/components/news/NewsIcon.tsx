// `?no-inline` keeps this as a real file URL (instead of a base64 data URI)
// so `<use href="...#id">` fragment references resolve reliably.
import newsIconsSprite from '@assets/svg/news-icons.svg?no-inline';
import type { NewsEntryType } from 'types/news';

/**
 * Props accepted by the {@link NewsIcon} component.
 */
type NewsIconProps = {
  /**
   * Which news entry type's icon to render.
   */
  type: NewsEntryType;
  /**
   * Additional classes merged onto the `<svg>` element, e.g. for sizing or
   * color (icons use `currentColor`, so color can be set via `text-*`).
   */
  className?: string;
};

/**
 * Renders the placeholder icon for a given {@link NewsEntryType} from the
 * shared news icon sprite (`src/assets/svg/news-icons.svg`).
 *
 * @param props The entry type to render and optional sizing/color classes.
 * @returns An `<svg>` referencing the matching sprite symbol.
 */
export function NewsIcon({ type, className }: NewsIconProps) {
  return (
    <svg
      className={className}
      aria-hidden="true"
    >
      <use href={`${newsIconsSprite}#${type}`} />
    </svg>
  );
}
