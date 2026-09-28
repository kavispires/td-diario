import { cn } from '@utils/cn';
import type { ReactNode } from 'react';
import { useState } from 'react';

/**
 * Shape of the {@link Avatar} component's frame.
 */
type AvatarShape = 'circle' | 'square';

/**
 * Named size presets supported by the {@link Avatar} component. A number
 * may be passed instead for a custom pixel size.
 */
type AvatarSizePreset = 'small' | 'default' | 'large';

/**
 * Size of the {@link Avatar} component, either a named preset or a custom
 * pixel value.
 */
type AvatarSize = AvatarSizePreset | number;

/**
 * Props accepted by the {@link Avatar} component.
 */
type AvatarProps = {
  /**
   * Image source. When it fails to load, `icon` or `children` is shown
   * instead.
   */
  src?: string;
  /**
   * Accessible description of the image. Defaults to an empty string
   * (decorative) when `alt` is omitted and a text/icon fallback is shown.
   */
  alt?: string;
  /**
   * Icon shown when `src` is omitted or fails to load and no `children`
   * fallback is provided.
   */
  icon?: ReactNode;
  /**
   * Text fallback (e.g. initials) shown when `src` is omitted or fails to
   * load.
   */
  children?: ReactNode;
  /**
   * Frame shape. Defaults to `circle`.
   */
  shape?: AvatarShape;
  /**
   * Size preset or custom pixel value. Defaults to `default`.
   */
  size?: AvatarSize;
  /**
   * Additional classes merged with the avatar's own classes.
   */
  className?: string;
};

const SHAPE_CLASSES: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-xl',
};

const SIZE_CLASSES: Record<AvatarSizePreset, string> = {
  small: 'h-6 w-6 text-xs',
  default: 'h-10 w-10 text-base',
  large: 'h-14 w-14 text-lg',
};

function isSizePreset(size: AvatarSize): size is AvatarSizePreset {
  return typeof size === 'string';
}

/**
 * Renders a user or entity avatar from an image, falling back to an icon or
 * text (e.g. initials) when no image is provided or it fails to load,
 * similar to Ant Design's `Avatar` component.
 *
 * @param props Image source, fallback content, shape, and size.
 * @returns A styled avatar element.
 */
export function Avatar({
  src,
  alt,
  icon,
  children,
  shape = 'circle',
  size = 'default',
  className,
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = src && !imageFailed;

  const sizeClassName = isSizePreset(size) ? SIZE_CLASSES[size] : '';
  const sizeStyle = isSizePreset(size)
    ? undefined
    : { height: size, width: size };

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden bg-primary-soft font-semibold text-primary',
        SHAPE_CLASSES[shape],
        sizeClassName,
        className,
      )}
      style={sizeStyle}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? ''}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        (icon ?? children)
      )}
    </span>
  );
}
