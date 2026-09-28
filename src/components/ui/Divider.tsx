import type { ReactNode } from 'react';

/**
 * Alignment of the optional label within a horizontal {@link Divider}.
 */
type DividerLabelAlign = 'start' | 'center' | 'end';

/**
 * Props accepted by the {@link Divider} component.
 */
type DividerProps = {
  /**
   * Orientation of the divider line. Defaults to `horizontal`.
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Uses a dashed line instead of a solid one.
   */
  dashed?: boolean;
  /**
   * Optional label rendered inline with a horizontal divider's line.
   * Ignored when `orientation` is `vertical`.
   */
  children?: ReactNode;
  /**
   * Alignment of the label along the divider. Defaults to `center`.
   */
  labelAlign?: DividerLabelAlign;
  /**
   * Additional classes merged with the divider's own classes.
   */
  className?: string;
};

const LABEL_ALIGN_CLASSES: Record<DividerLabelAlign, string> = {
  start: 'before:w-6 after:w-full',
  center: 'before:w-full after:w-full',
  end: 'before:w-full after:w-6',
};

/**
 * Renders a horizontal or vertical rule used to separate content, with an
 * optional inline label for horizontal dividers, similar to Ant Design's
 * `Divider` component.
 *
 * @param props Orientation, line style, optional label, and label
 *   alignment.
 * @returns A styled divider element.
 */
export function Divider({
  orientation = 'horizontal',
  dashed = false,
  children,
  labelAlign = 'center',
  className = '',
}: DividerProps) {
  const lineStyle = dashed ? 'border-dashed' : 'border-solid';

  if (orientation === 'vertical') {
    return (
      <div
        aria-hidden="true"
        className={`inline-block h-full min-h-4 w-px self-stretch border-l ${lineStyle} border-border ${className}`}
      />
    );
  }

  if (!children) {
    return (
      <hr
        className={`w-full border-t ${lineStyle} border-border ${className}`}
      />
    );
  }

  const pseudoLineStyle = dashed
    ? 'before:border-dashed after:border-dashed'
    : 'before:border-solid after:border-solid';

  return (
    <div
      className={`flex w-full items-center gap-3 text-sm text-muted-foreground before:border-t before:content-[''] after:border-t after:content-[''] before:border-border after:border-border ${pseudoLineStyle} ${LABEL_ALIGN_CLASSES[labelAlign]} ${className}`}
    >
      {children}
    </div>
  );
}
