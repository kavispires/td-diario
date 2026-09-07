import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Matches a Tailwind text-color utility (e.g. `text-slate-900`, `text-white`).
 */
const TEXT_COLOR_CLASS_PATTERN =
  /^text-(inherit|current|transparent|black|white|[a-z]+-\d{2,3})$/;

/**
 * Matches a Tailwind margin-bottom utility (e.g. `mb-4`, `-mb-2`, `mb-px`).
 */
const MARGIN_BOTTOM_CLASS_PATTERN = /^-?mb-(\d+(\.\d+)?|px)$/;

/**
 * Merges a base className with a caller-provided override, dropping any
 * `base` utility that conflicts with one supplied by `override` (matched via
 * `patterns`). This avoids relying on Tailwind's generated stylesheet order,
 * which does not respect the order classes appear in the `class` attribute.
 */
function mergeClassName(
  base: string,
  override: string,
  patterns: RegExp[],
): string {
  const overrideClasses = override.split(/\s+/).filter(Boolean);
  const baseClasses = base
    .split(/\s+/)
    .filter(Boolean)
    .filter(
      (baseCls) =>
        !patterns.some(
          (pattern) =>
            pattern.test(baseCls) &&
            overrideClasses.some((overrideCls) => pattern.test(overrideCls)),
        ),
    );

  return [...baseClasses, ...overrideClasses].join(' ');
}

/**
 * Supported heading levels rendered by {@link Title}.
 */
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * HTML heading tags corresponding to the supported heading levels.
 */
type HeadingTag = `h${HeadingLevel}`;

/**
 * Props accepted by the {@link Title} component.
 */
interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Heading level to render. Defaults to `1`.
   */
  level?: HeadingLevel;
  /**
   * Content displayed inside the heading.
   */
  children: ReactNode;
}

/**
 * Renders a semantic heading with a consistent typography scale.
 *
 * @param props Heading element properties, including the heading level and
 *   content.
 * @returns A heading element from `<h1>` through `<h6>`.
 */
export function Title({
  level = 1,
  className = '',
  children,
  ...props
}: TitleProps) {
  const Component = `h${level}` as HeadingTag;

  const sizes = {
    1: 'text-3xl font-extrabold',
    2: 'text-2xl font-bold',
    3: 'text-xl font-semibold',
    4: 'text-lg font-semibold',
    5: 'text-base font-semibold',
    6: 'text-sm font-semibold',
  };

  return (
    <Component
      {...props}
      className={mergeClassName(
        `${sizes[level]} tracking-wide text-slate-900`,
        className,
        [TEXT_COLOR_CLASS_PATTERN],
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Props accepted by the {@link Paragraph} component.
 */
interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  /**
   * Content displayed inside the paragraph.
   */
  children: ReactNode;
}

/**
 * Renders body text with the application's default paragraph styling.
 *
 * @param props Paragraph element properties and content.
 * @returns A styled paragraph element.
 */
export function Paragraph({
  className = '',
  children,
  ...props
}: ParagraphProps) {
  return (
    <p
      {...props}
      className={mergeClassName(
        'text-base text-slate-600 leading-relaxed mb-4',
        className,
        [TEXT_COLOR_CLASS_PATTERN, MARGIN_BOTTOM_CLASS_PATTERN],
      )}
    >
      {children}
    </p>
  );
}

/**
 * Semantic color variants supported by the {@link Text} component.
 */
type TextType = 'default' | 'secondary' | 'danger' | 'success';

/**
 * Props accepted by the {@link Text} component.
 */
interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Color variant for the text. Defaults to `default`.
   */
  type?: TextType;
  /**
   * Whether to render the text with semibold weight.
   */
  strong?: boolean;
  /**
   * Content displayed inside the span.
   */
  children: ReactNode;
}

/**
 * Renders inline text with semantic color and emphasis variants.
 *
 * @param props Span element properties, text variant, emphasis, and content.
 * @returns A styled span element.
 */
export function Text({
  type = 'default',
  strong = false,
  className = '',
  children,
  ...props
}: TextProps) {
  const colors = {
    default: 'text-slate-700',
    secondary: 'text-slate-500',
    danger: 'text-red-500',
    success: 'text-emerald-600',
  };

  const weight = strong ? 'font-semibold' : 'font-normal';

  return (
    <span
      {...props}
      className={mergeClassName(`${colors[type]} ${weight}`, className, [
        TEXT_COLOR_CLASS_PATTERN,
      ])}
    >
      {children}
    </span>
  );
}
