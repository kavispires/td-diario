import type { CSSProperties } from 'react';
import spriteContent from './piralhos-icons-sprite.svg?raw';

/**
 * Ids of the `<symbol>` elements available in Pirralhos' local icon sprite
 * sheet.
 */
export type PirralhosIconId =
  | 'guilty'
  | 'innocent'
  | 'liar'
  | 'unknown'
  | 'arrow'
  | 'male'
  | 'female';

/**
 * Injects Pirralhos' local icon sprite sheet's `<symbol>` definitions into
 * the document once, so any {@link PirralhosIcon} on the page can reference
 * them by id via `<use>`.
 *
 * @returns A visually hidden element holding the sprite sheet's markup.
 */
export function PirralhosIconDefs() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: registers the bundled sprite sheet's <symbol> definitions for <use> lookups elsewhere on the page
      dangerouslySetInnerHTML={{ __html: spriteContent }}
    />
  );
}

/**
 * Props accepted by the {@link PirralhosIcon} component.
 */
type PirralhosIconProps = {
  /**
   * Id of the sprite symbol to render.
   */
  icon: PirralhosIconId;
  /**
   * Width and height of the rendered icon, in pixels. Defaults to `24`.
   */
  size?: number;
  /**
   * Additional classes applied to the icon.
   */
  className?: string;
  /**
   * Inline styles merged with the icon's own sizing styles.
   */
  style?: CSSProperties;
};

/**
 * Renders one icon from Pirralhos' local sprite sheet (assessment markers
 * and the circle connector arrow). Requires {@link PirralhosIconDefs} to be
 * rendered once elsewhere on the page.
 *
 * @param props Sprite symbol id and sizing.
 * @returns The rendered sprite icon.
 */
export function PirralhosIcon({
  icon,
  size = 24,
  className,
  style,
}: PirralhosIconProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      <use href={`#${icon}`} />
    </svg>
  );
}
