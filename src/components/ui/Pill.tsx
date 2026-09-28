import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

/**
 * Props accepted by the {@link Pill} component.
 */
type PillProps = {
  /**
   * Content displayed inside the pill.
   */
  children: ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

/**
 * Renders a compact rounded badge with the app's chrome styling, typically
 * used to surface short status text or a small icon-and-label pairing.
 *
 * @param props Pill content and native `span` element properties.
 * @returns A styled pill element.
 */
export function Pill({ children, className, ...props }: PillProps) {
  return (
    <span
      className={cn(
        'flex items-center gap-2 rounded-full bg-chrome px-4 py-1.5 text-white shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
