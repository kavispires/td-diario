import {
  type FloatingPlacement,
  useFloatingPosition,
} from '@hooks/useFloatingPosition';
import { cn } from '@utils/cn';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Interaction that opens the {@link Popover} component.
 */
type PopoverTrigger = 'hover' | 'click';

/**
 * Props accepted by the {@link Popover} component.
 */
type PopoverProps = {
  /**
   * Optional heading shown above `content`.
   */
  title?: ReactNode;
  /**
   * Content rendered inside the floating panel.
   */
  content: ReactNode;
  /**
   * Element(s) that trigger the popover.
   */
  children: ReactNode;
  /**
   * Side of the trigger the popover is anchored to. Defaults to `top`.
   */
  placement?: FloatingPlacement;
  /**
   * Interaction that opens the popover. Defaults to `hover`.
   */
  trigger?: PopoverTrigger;
  /**
   * Controls the open state externally. When omitted, the popover manages
   * its own open state.
   */
  open?: boolean;
  /**
   * Called whenever the open state should change, whether controlled or
   * uncontrolled.
   */
  onOpenChange?: (open: boolean) => void;
};

const ARROW_POSITION: Record<FloatingPlacement, string> = {
  top: 'bottom-[-4px]',
  bottom: 'top-[-4px]',
  left: 'right-[-4px]',
  right: 'left-[-4px]',
};

const CLOSE_DELAY_MS = 100;

/**
 * Renders a floating panel with a title and rich content, opened by hover
 * or click on its trigger, similar to Ant Design's `Popover` component.
 *
 * @param props Panel content, trigger element(s), placement, open
 *   interaction, and optional controlled open state.
 * @returns The trigger wrapped with the appropriate handlers, plus a
 *   portal-rendered panel while open.
 */
export function Popover({
  title,
  content,
  children,
  placement = 'top',
  trigger = 'hover',
  open,
  onOpenChange,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const visible = isControlled ? open : internalOpen;

  const triggerRef = useRef<HTMLSpanElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | undefined>(undefined);
  const popoverId = useId();

  const position = useFloatingPosition(
    triggerRef,
    floatingRef,
    visible,
    placement,
  );

  function setVisible(next: boolean) {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  }

  function show() {
    window.clearTimeout(closeTimeoutRef.current);
    setVisible(true);
  }

  function scheduleHide() {
    closeTimeoutRef.current = window.setTimeout(() => {
      setVisible(false);
    }, CLOSE_DELAY_MS);
  }

  // Closes the popover when clicking outside the trigger or panel.
  useEffect(() => {
    if (trigger !== 'click' || !visible) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        floatingRef.current?.contains(target)
      ) {
        return;
      }
      if (!isControlled) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [trigger, visible, isControlled, onOpenChange]);

  const hoverHandlers =
    trigger === 'hover'
      ? {
          onMouseEnter: show,
          onMouseLeave: scheduleHide,
        }
      : {};

  const isVertical = placement === 'top' || placement === 'bottom';

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: passive hover/click wrapper used only to position the popover; the accessible interactive element is whatever is passed as children */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: click here only opens/closes the panel, it does not perform the trigger's own action */}
      <span
        ref={triggerRef}
        className="inline-block"
        onClick={trigger === 'click' ? () => setVisible(!visible) : undefined}
        aria-describedby={visible ? popoverId : undefined}
        {...hoverHandlers}
      >
        {children}
      </span>
      {createPortal(
        <AnimatePresence>
          {visible && (
            <motion.div
              ref={floatingRef}
              id={popoverId}
              role="dialog"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.14 }}
              style={{
                top: position?.top ?? 0,
                left: position?.left ?? 0,
                visibility: position ? 'visible' : 'hidden',
              }}
              className="fixed z-50 max-w-xs rounded-2xl border border-border bg-surface-raised p-4 shadow-lg"
              {...hoverHandlers}
            >
              {title && (
                <p className="mb-1 text-sm font-semibold text-foreground">
                  {title}
                </p>
              )}
              <div className="text-sm text-muted-foreground">{content}</div>
              {position && (
                <span
                  className={cn(
                    'absolute h-2 w-2 rotate-45 bg-surface-raised',
                    ARROW_POSITION[placement],
                  )}
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
