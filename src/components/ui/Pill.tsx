import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

/**
 * Sizes available for the {@link Pill} component.
 */
export type PillSize = 'small' | 'default';

/**
 * Props accepted by the {@link Pill} component.
 */
type PillProps = {
  /**
   * Content displayed inside the pill.
   */
  children: ReactNode;
  /**
   * Size of the pill's padding and text. Defaults to `default`.
   */
  size?: PillSize;
} & React.HTMLAttributes<HTMLSpanElement>;

const SIZE_CLASSES: Record<PillSize, string> = {
  small: 'px-2.5 py-0.5 text-xs gap-1',
  default: 'px-4 py-1.5 gap-2',
};

/**
 * Renders a compact rounded badge with the app's chrome styling, typically
 * used to surface short status text or a small icon-and-label pairing.
 *
 * @param props Pill content, size, and native `span` element properties.
 * @returns A styled pill element.
 */
export function Pill({
  children,
  size = 'default',
  className,
  ...props
}: PillProps) {
  return (
    <span
      className={cn(
        'flex items-center rounded-full bg-chrome text-white shadow-sm',
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
