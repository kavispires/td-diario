import { type RefObject, useLayoutEffect, useState } from 'react';

/**
 * Side of the trigger element a floating element (tooltip/popover) is
 * anchored to.
 */
export type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Computed viewport position for a floating element, in fixed-position
 * pixel coordinates.
 */
export type FloatingPosition = {
  /**
   * Distance from the top of the viewport to the floating element.
   */
  top: number;
  /**
   * Distance from the left of the viewport to the floating element.
   */
  left: number;
  /**
   * Offset (in pixels) along the floating element's cross axis where an
   * arrow should be centered to point at the trigger's midpoint.
   */
  arrowOffset: number;
};

const VIEWPORT_PADDING = 8;
const ARROW_SIZE = 8;

/**
 * Computes and tracks the fixed-position coordinates for a floating element
 * (e.g. a tooltip or popover) anchored to a trigger element, clamping the
 * result so it stays within the viewport.
 *
 * Recomputes on show and while visible on scroll/resize. Does not
 * auto-flip placement near viewport edges; the caller-provided `placement`
 * is always respected, only the position is clamped.
 *
 * @param triggerRef Ref to the element the floating element is anchored to.
 * @param floatingRef Ref to the floating element being positioned.
 * @param visible Whether the floating element is currently shown. Position
 *   is only computed while true.
 * @param placement Side of the trigger the floating element is anchored to.
 * @param offset Gap (in pixels) between the trigger and the floating
 *   element. Defaults to `8`.
 * @returns The computed position, or `null` before the first measurement.
 */
export function useFloatingPosition(
  triggerRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  visible: boolean,
  placement: FloatingPlacement,
  offset = 8,
): FloatingPosition | null {
  const [position, setPosition] = useState<FloatingPosition | null>(null);

  useLayoutEffect(() => {
    if (!visible) {
      setPosition(null);
      return;
    }

    function updatePosition() {
      const trigger = triggerRef.current;
      const floating = floatingRef.current;
      if (!trigger || !floating) {
        return;
      }

      const triggerRect = trigger.getBoundingClientRect();
      const floatingRect = floating.getBoundingClientRect();
      const isVertical = placement === 'top' || placement === 'bottom';

      let top: number;
      let left: number;

      if (placement === 'top') {
        top = triggerRect.top - floatingRect.height - offset;
        left =
          triggerRect.left + triggerRect.width / 2 - floatingRect.width / 2;
      } else if (placement === 'bottom') {
        top = triggerRect.bottom + offset;
        left =
          triggerRect.left + triggerRect.width / 2 - floatingRect.width / 2;
      } else if (placement === 'left') {
        top =
          triggerRect.top + triggerRect.height / 2 - floatingRect.height / 2;
        left = triggerRect.left - floatingRect.width - offset;
      } else {
        top =
          triggerRect.top + triggerRect.height / 2 - floatingRect.height / 2;
        left = triggerRect.right + offset;
      }

      const clampedLeft = Math.min(
        Math.max(left, VIEWPORT_PADDING),
        window.innerWidth - floatingRect.width - VIEWPORT_PADDING,
      );
      const clampedTop = Math.min(
        Math.max(top, VIEWPORT_PADDING),
        window.innerHeight - floatingRect.height - VIEWPORT_PADDING,
      );

      const triggerCenter = isVertical
        ? triggerRect.left + triggerRect.width / 2
        : triggerRect.top + triggerRect.height / 2;
      const floatingStart = isVertical ? clampedLeft : clampedTop;
      const floatingSize = isVertical
        ? floatingRect.width
        : floatingRect.height;

      const arrowOffset = Math.min(
        Math.max(triggerCenter - floatingStart, ARROW_SIZE),
        floatingSize - ARROW_SIZE,
      );

      setPosition({ top: clampedTop, left: clampedLeft, arrowOffset });
    }

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [visible, placement, offset, triggerRef, floatingRef]);

  return position;
}
