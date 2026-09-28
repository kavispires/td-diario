import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

/**
 * Semantic status colors supported by the standalone (dot + text) form of
 * the {@link Badge} component.
 */
type BadgeStatus = 'success' | 'processing' | 'default' | 'warning' | 'error';

/**
 * Props accepted by the {@link Badge} component.
 */
type BadgeProps = {
  /**
   * Element the badge is anchored to. When omitted, the badge renders as a
   * standalone status dot, typically paired with `text`.
   */
  children?: ReactNode;
  /**
   * Value shown inside the badge (usually a number, but any short content
   * works, e.g. a checkmark). Ignored when `dot` is `true`.
   */
  count?: ReactNode;
  /**
   * Highest number displayed before switching to `${overflowCount}+`.
   * Defaults to `99`.
   */
  overflowCount?: number;
  /**
   * Shows the badge even when `count` is `0`. Defaults to `false`.
   */
  showZero?: boolean;
  /**
   * Renders a small dot instead of the numeric `count`.
   */
  dot?: boolean;
  /**
   * Semantic status color for the standalone dot form. Defaults to
   * `default`.
   */
  status?: BadgeStatus;
  /**
   * Label shown next to the standalone status dot.
   */
  text?: ReactNode;
  /**
   * Custom background color, overriding the default badge/status color.
   */
  color?: string;
  /**
   * Additional classes merged with the badge's own classes.
   */
  className?: string;
};

const STATUS_CLASSES: Record<BadgeStatus, string> = {
  success: 'bg-success',
  processing: 'bg-secondary',
  default: 'bg-subtle-foreground',
  warning: 'bg-warning',
  error: 'bg-destructive',
};

/**
 * Renders a small count or dot indicator anchored to its `children`, or a
 * standalone status dot with a text label, similar to Ant Design's `Badge`
 * component.
 *
 * @param props Count/dot content, anchor element, and standalone status
 *   options.
 * @returns The anchored badge, or a standalone status indicator.
 */
export function Badge({
  children,
  count,
  overflowCount = 99,
  showZero = false,
  dot = false,
  status = 'default',
  text,
  color,
  className,
}: BadgeProps) {
  const hasCount = count !== undefined;
  const shouldShowCount = hasCount && (count !== 0 || showZero);

  if (!children) {
    return (
      <span className={cn('inline-flex items-center gap-1.5', className)}>
        <span
          className={cn(
            'h-2 w-2 shrink-0 rounded-full',
            !color && STATUS_CLASSES[status],
          )}
          style={color ? { backgroundColor: color } : undefined}
          aria-hidden="true"
        />
        {text && <span className="text-sm text-foreground">{text}</span>}
      </span>
    );
  }

  const showIndicator = dot || shouldShowCount;

  return (
    <span className={cn('relative inline-flex', className)}>
      {children}
      {showIndicator && (
        <span
          className={cn(
            'absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white',
            dot ? 'h-2.5 w-2.5' : 'h-5 min-w-5 px-1 text-[10px] font-semibold',
            !color && 'bg-destructive',
          )}
          style={color ? { backgroundColor: color } : undefined}
        >
          {!dot &&
            (typeof count === 'number' && count > overflowCount
              ? `${overflowCount}+`
              : count)}
        </span>
      )}
    </span>
  );
}
