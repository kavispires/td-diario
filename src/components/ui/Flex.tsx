import type {
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from 'react';

/**
 * Main-axis alignment values supported by the {@link Flex} component.
 */
type FlexJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly'
  | 'normal'
  | 'stretch';

/**
 * Cross-axis alignment values supported by the {@link Flex} component.
 */
type FlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';

/**
 * Wrapping behavior values supported by the {@link Flex} component.
 */
type FlexWrap = boolean | 'wrap' | 'nowrap' | 'wrap-reverse';

/**
 * Named spacing presets supported by the `gap` prop.
 */
type FlexGapSize = 'small' | 'middle' | 'large';

/**
 * Gap between flex items. Accepts a named preset, or a number (in pixels) or
 * string for a custom value applied via inline style.
 */
type FlexGap = FlexGapSize | number | string;

const JUSTIFY_CLASSES: Record<FlexJustify, string> = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
  normal: 'justify-normal',
  stretch: 'justify-stretch',
};

const ALIGN_CLASSES: Record<FlexAlign, string> = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

const GAP_SIZE_CLASSES: Record<FlexGapSize, string> = {
  small: 'gap-2',
  middle: 'gap-4',
  large: 'gap-6',
};

/**
 * Named `gap` presets that map to a fixed Tailwind class.
 */
const GAP_SIZES = new Set(Object.keys(GAP_SIZE_CLASSES));

function isFlexGapSize(gap: FlexGap): gap is FlexGapSize {
  return typeof gap === 'string' && GAP_SIZES.has(gap);
}

function resolveWrapClassName(wrap: FlexWrap): string {
  if (wrap === true || wrap === 'wrap') return 'flex-wrap';
  if (wrap === 'wrap-reverse') return 'flex-wrap-reverse';
  return 'flex-nowrap';
}

/**
 * Props owned by the {@link Flex} component, independent of the rendered
 * element or component type.
 */
type FlexOwnProps<T extends ElementType> = {
  /**
   * Element or component to render as the flex container. Defaults to `div`.
   */
  as?: T;
  /**
   * Stacks children top-to-bottom instead of side-by-side.
   */
  vertical?: boolean;
  /**
   * Controls whether children wrap onto multiple lines. Defaults to `false`.
   */
  wrap?: FlexWrap;
  /**
   * Alignment of children along the main axis.
   */
  justify?: FlexJustify;
  /**
   * Alignment of children along the cross axis.
   */
  align?: FlexAlign;
  /**
   * Spacing between children. Named presets map to fixed values; numbers and
   * custom strings are applied via inline style.
   */
  gap?: FlexGap;
  /**
   * Additional class names merged with the container's own layout classes.
   */
  className?: string;
  /**
   * Additional inline styles merged with any styles derived from `gap`.
   */
  style?: CSSProperties;
  /**
   * Content rendered inside the flex container.
   */
  children?: ReactNode;
};

/**
 * Props accepted by the {@link Flex} component, combining its own layout
 * props with the native props of the rendered element or component.
 */
type FlexProps<T extends ElementType = 'div'> = FlexOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof FlexOwnProps<T>>;

/**
 * Renders a flex container with a declarative API for common layout needs
 * (direction, wrapping, alignment, and spacing), similar to Ant Design's
 * `Flex` component.
 *
 * @param props Layout options, the element/component to render as, and
 *   native props for the underlying element.
 * @returns A flex container element.
 */
export function Flex<T extends ElementType = 'div'>({
  as,
  vertical = false,
  wrap = false,
  justify,
  align,
  gap,
  className = '',
  style,
  children,
  ...props
}: FlexProps<T>) {
  const Component = as || 'div';

  const gapClassName = gap && isFlexGapSize(gap) ? GAP_SIZE_CLASSES[gap] : '';
  const gapStyle =
    gap && !isFlexGapSize(gap)
      ? { gap: typeof gap === 'number' ? `${gap}px` : gap }
      : undefined;

  const classes = [
    'flex',
    vertical ? 'flex-col' : 'flex-row',
    resolveWrapClassName(wrap),
    justify ? JUSTIFY_CLASSES[justify] : '',
    align ? ALIGN_CLASSES[align] : '',
    gapClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      className={classes}
      style={{ ...gapStyle, ...style }}
      {...props}
    >
      {children}
    </Component>
  );
}
