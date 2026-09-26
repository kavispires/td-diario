import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { ButtonVariant } from './Button';

/**
 * Sizes available for the {@link IconButton} component. Controls both the
 * touch target padding and the recommended icon dimensions.
 */
type IconButtonSize = 'small' | 'middle' | 'large';

/**
 * Shape of the {@link IconButton} component's hit area.
 */
type IconButtonShape = 'circle' | 'square';

const SIZE_PADDING: Record<IconButtonSize, string> = {
  small: 'p-1',
  middle: 'p-1.5',
  large: 'p-2.5',
};

const SIZE_ICON: Record<IconButtonSize, string> = {
  small: 'h-4 w-4',
  middle: 'h-5 w-5',
  large: 'h-6 w-6',
};

const SHAPE_CLASSES: Record<IconButtonShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-xl',
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-slate-900 text-white shadow-lg hover:bg-slate-800',
  secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
  ghost: 'bg-transparent text-current hover:bg-current/10 active:bg-current/15',
};

/**
 * Props accepted by the {@link IconButton} component.
 */
interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /**
   * Icon rendered inside the button. Replaced by a spinner while `loading`.
   */
  icon: ReactNode;
  /**
   * Accessible name for the button, required since its content is icon-only.
   */
  'aria-label': string;
  /**
   * Visual style applied to the button. Defaults to `ghost`.
   */
  variant?: ButtonVariant;
  /**
   * Size of the button's touch target and icon. Defaults to `middle`.
   */
  size?: IconButtonSize;
  /**
   * Shape of the button's hit area. Defaults to `circle`.
   */
  shape?: IconButtonShape;
  /**
   * Replaces the icon with a spinner and disables the button while loading.
   */
  loading?: boolean;
  /**
   * Shows a small notification dot in the top-right corner, e.g. to signal
   * unread content.
   */
  dot?: boolean;
}

/**
 * Renders a compact, icon-only button with visual variants, sizes, shapes,
 * a loading state, and an optional notification dot.
 *
 * Native button properties such as `onClick` and `type` are forwarded to the
 * underlying `<button>` element. An `aria-label` is required because the
 * button has no visible text content.
 *
 * @param props Icon content, styling options, loading/dot state, and native
 *   button properties.
 * @returns A styled icon-only button element.
 */
export function IconButton({
  icon,
  variant = 'ghost',
  size = 'middle',
  shape = 'circle',
  loading = false,
  dot = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}: IconButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center active:scale-90 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  return (
    <button
      className={`${baseStyles} ${SIZE_PADDING[size]} ${SHAPE_CLASSES[shape]} ${VARIANT_CLASSES[variant]} ${className}`}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? (
        <Loader2 className={`animate-spin ${SIZE_ICON[size]}`} />
      ) : (
        <span className={`inline-flex ${SIZE_ICON[size]}`}>{icon}</span>
      )}
      {dot && !loading && (
        <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500" />
      )}
    </button>
  );
}
