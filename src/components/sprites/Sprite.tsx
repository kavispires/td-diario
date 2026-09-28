import { useTDBaseUrl } from '@hooks/useTDBaseUrl';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Loader2 } from 'lucide-react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { Tooltip } from '../ui/Tooltip';

/**
 * Default width/height, in pixels, applied to a {@link Sprite} when `width`
 * is not provided.
 */
export const DEFAULT_SPRITE_SIZE = 72;

/**
 * Props accepted by the {@link Sprite} component.
 */
type SpriteProps = {
  /**
   * Name of the sprite sheet file (without extension) to fetch.
   */
  source: string;
  /**
   * Id of the `<symbol>` within the sprite sheet to render.
   */
  spriteId: string;
  /**
   * Width and height of the rendered sprite. Defaults to
   * `DEFAULT_SPRITE_SIZE`.
   */
  width?: CSSProperties['width'];
  /**
   * Tooltip label shown on hover/focus, usually the item's name.
   */
  title?: string;
  /**
   * Additional classes merged with the sprite's own classes.
   */
  className?: string;
  /**
   * Padding applied inside the sprite's container.
   */
  padding?: CSSProperties['padding'];
} & HTMLAttributes<HTMLSpanElement>;

/**
 * Loads and renders a single sprite from a TD sprite sheet, showing a
 * loading spinner while fetching and a warning icon if it fails.
 *
 * @param props Sprite sheet/id, sizing, optional tooltip title, and native
 *   `span` element properties.
 * @returns A sized container with the sprite's SVG content, or a
 *   loading/error placeholder.
 */
export function Sprite({
  spriteId,
  source,
  width = DEFAULT_SPRITE_SIZE,
  padding = 0,
  title,
  className,
  style,
  ...props
}: SpriteProps) {
  const { baseUrl } = useTDBaseUrl('sprites');

  const { isLoading, data, isError } = useQuery({
    queryKey: ['sprite', source],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/${source}.svg`);

      if (!response.ok) {
        throw new Error(`Failed to load sprite source: ${source}`);
      }

      return await response.text();
    },
    enabled: !!spriteId && !!source,
  });

  const containerStyle: CSSProperties = {
    width,
    height: width,
    padding,
    boxSizing: 'border-box',
    display: 'grid',
    placeItems: 'center',
    ...style,
  };

  if (isLoading) {
    return (
      <span
        style={containerStyle}
        className={className}
        {...props}
      >
        <Loader2
          className="h-5 w-5 animate-spin text-subtle-foreground"
          aria-hidden="true"
        />
      </span>
    );
  }

  const svgContent = data;

  if (isError || !svgContent) {
    return (
      <span
        style={containerStyle}
        className={className}
        {...props}
      >
        <AlertTriangle
          className="h-5 w-5 text-warning"
          aria-hidden="true"
        />
      </span>
    );
  }

  const sprite = (
    <span
      style={containerStyle}
      className={className}
      {...props}
    >
      <svg
        viewBox="0 0 512 512"
        style={{ width: '100%', height: '100%' }}
        aria-hidden="true"
      >
        <use
          href={`#${spriteId}`}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: injects the fetched sprite sheet's <symbol> definitions so <use> can reference them by id
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </svg>
    </span>
  );

  return title ? <Tooltip title={title}>{sprite}</Tooltip> : sprite;
}
