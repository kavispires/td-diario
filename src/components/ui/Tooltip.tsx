import {
  type FloatingPlacement,
  useFloatingPosition,
} from '@hooks/useFloatingPosition';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Props accepted by the {@link Tooltip} component.
 */
type TooltipProps = {
  /**
   * Content shown inside the floating tooltip bubble. When empty, the
   * tooltip never appears and `children` is rendered as-is.
   */
  title: ReactNode;
  /**
   * Element(s) that trigger the tooltip on hover or focus.
   */
  children: ReactNode;
  /**
   * Side of the trigger the tooltip is anchored to. Defaults to `top`.
   */
  placement?: FloatingPlacement;
};

const ARROW_POSITION: Record<FloatingPlacement, string> = {
  top: 'bottom-[-4px]',
  bottom: 'top-[-4px]',
  left: 'right-[-4px]',
  right: 'left-[-4px]',
};

/**
 * Renders a small floating label that appears on hover or focus of its
 * trigger, similar to Ant Design's `Tooltip` component.
 *
 * @param props Tooltip content, trigger element(s), and placement.
 * @returns The trigger wrapped with hover/focus handlers, plus a
 *   portal-rendered tooltip bubble while visible.
 */
export function Tooltip({ title, children, placement = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  const position = useFloatingPosition(
    triggerRef,
    floatingRef,
    visible,
    placement,
  );

  if (!title) {
    return <>{children}</>;
  }

  const isVertical = placement === 'top' || placement === 'bottom';

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: passive hover/focus wrapper used only to position the tooltip; the accessible interactive element is whatever is passed as children */}
      <span
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        aria-describedby={visible ? tooltipId : undefined}
      >
        {children}
      </span>
      {createPortal(
        <AnimatePresence>
          {visible && (
            <motion.div
              ref={floatingRef}
              id={tooltipId}
              role="tooltip"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              style={{
                top: position?.top ?? 0,
                left: position?.left ?? 0,
                visibility: position ? 'visible' : 'hidden',
              }}
              className="pointer-events-none fixed z-50 max-w-xs rounded-lg bg-chrome px-3 py-1.5 text-xs text-white shadow-lg"
            >
              {title}
              {position && (
                <span
                  className={`absolute h-2 w-2 rotate-45 bg-chrome ${ARROW_POSITION[placement]}`}
                  style={
                    isVertical
                      ? { left: position.arrowOffset - 4 }
                      : { top: position.arrowOffset - 4 }
                  }
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
