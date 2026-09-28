import { cn } from '@utils/cn';
import type { HTMLAttributes, ReactNode } from 'react';

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
type TitleProps = HTMLAttributes<HTMLHeadingElement> & {
  /**
   * Heading level to render. Defaults to `1`.
   */
  level?: HeadingLevel;
  /**
   * Content displayed inside the heading.
   */
  children: ReactNode;
};

/**
 * Renders a semantic heading with a consistent typography scale.
 *
 * @param props Heading element properties, including the heading level and
 *   content.
 * @returns A heading element from `<h1>` through `<h6>`.
 */
export function Title({
  level = 1,
  className,
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
      className={cn(sizes[level], 'tracking-wide text-foreground', className)}
    >
      {children}
    </Component>
  );
}

/**
 * Props accepted by the {@link Paragraph} component.
 */
type ParagraphProps = HTMLAttributes<HTMLParagraphElement> & {
  /**
   * Content displayed inside the paragraph.
   */
  children: ReactNode;
};

/**
 * Renders body text with the application's default paragraph styling.
 *
 * @param props Paragraph element properties and content.
 * @returns A styled paragraph element.
 */
export function Paragraph({ className, children, ...props }: ParagraphProps) {
  return (
    <p
      {...props}
      className={cn(
        'mb-4 text-base text-muted-foreground leading-relaxed',
        className,
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
type TextProps = HTMLAttributes<HTMLSpanElement> & {
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
};

/**
 * Renders inline text with semantic color and emphasis variants.
 *
 * @param props Span element properties, text variant, emphasis, and content.
 * @returns A styled span element.
 */
export function Text({
  type = 'default',
  strong = false,
  className,
  children,
  ...props
}: TextProps) {
  const colors = {
    default: 'text-foreground',
    secondary: 'text-subtle-foreground',
    danger: 'text-destructive',
    success: 'text-success',
  };

  const weight = strong ? 'font-semibold' : 'font-normal';

  return (
    <span
      {...props}
      className={cn(colors[type], weight, className)}
    >
      {children}
    </span>
  );
}
