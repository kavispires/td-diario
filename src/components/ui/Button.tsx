import { cn } from '@utils/cn';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Visual styles available for the {@link Button} component.
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'chrome'
  | 'outlined';

/**
 * Positions available for an optional button icon.
 */
type ButtonIconPlacement = 'start' | 'end';

/**
 * Sizes available for the {@link Button} component.
 */
export type ButtonSize = 'small' | 'default';

/**
 * Props accepted by the {@link Button} component.
 */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Visual style applied to the button. Defaults to `primary`.
   */
  variant?: ButtonVariant;
  /**
   * Size of the button's padding, text, and icon. Defaults to `default`.
   */
  size?: ButtonSize;
  /**
   * Whether the button should span the available width.
   */
  block?: boolean;
  /**
   * Optional icon displayed before or after the button content.
   */
  icon?: ReactNode;
  /**
   * Position of the optional icon. Defaults to `start`.
   */
  iconPlacement?: ButtonIconPlacement;
  /**
   * Replaces the icon with a spinner and disables the button while loading.
   */
  loading?: boolean;
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  small: 'py-2 px-4 rounded-xl text-sm gap-2',
  default: 'py-3.5 px-6 rounded-2xl text-base gap-3',
};

const SIZE_ICON_CLASSES: Record<ButtonSize, string> = {
  small: 'h-4 w-4',
  default: 'h-5 w-5',
};

/**
 * Renders a styled button with visual variants, sizes, optional icons, and
 * a loading state.
 *
 * Native button properties such as `onClick`, `aria-*` attributes, and
 * `type` are forwarded to the underlying `<button>` element.
 *
 * @param props Button content, styling options, loading state, and native
 *   button properties.
 * @returns A styled button element.
 */
export function Button({
  variant = 'primary',
  size = 'default',
  block = false,
  icon,
  iconPlacement = 'start',
  loading = false,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const widthClass = block ? 'w-full' : 'w-auto inline-flex';
  const baseStyles =
    'font-semibold active:scale-95 transition-all duration-200 flex items-center justify-center border-2 border-transparent disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variants = {
    primary: 'bg-primary text-white shadow-lg hover:bg-primary-hover',
    secondary: 'bg-secondary text-white shadow-lg hover:bg-secondary-hover',
    ghost:
      'bg-transparent text-muted-foreground shadow-none hover:bg-border active:bg-border-strong',
    chrome: 'bg-chrome text-white shadow-lg hover:bg-slate-800',
    outlined:
      'bg-transparent border-primary text-primary shadow-none hover:bg-primary-soft',
  };

  const renderIcon = loading ? (
    <Loader2 className={cn('animate-spin', SIZE_ICON_CLASSES[size])} />
  ) : (
    icon
  );

  return (
    <button
      className={cn(
        widthClass,
        baseStyles,
        SIZE_CLASSES[size],
        variants[variant],
        className,
      )}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {renderIcon && iconPlacement === 'start' && renderIcon}
      {children}
      {renderIcon && iconPlacement === 'end' && renderIcon}
    </button>
  );
}
