import type { ButtonVariant } from '@components/ui/Button';
import { Button } from '@components/ui/Button';
import {
  type FloatingPlacement,
  useFloatingPosition,
} from '@hooks/useFloatingPosition';
import { HelpCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Props accepted by the {@link Popconfirm} component.
 */
type PopconfirmProps = {
  /**
   * Primary confirmation question.
   */
  title: ReactNode;
  /**
   * Optional supporting detail shown below the title.
   */
  description?: ReactNode;
  /**
   * Element that opens the confirmation panel when clicked.
   */
  children: ReactNode;
  /**
   * Called when the confirm button is activated.
   */
  onConfirm?: () => void;
  /**
   * Called when the cancel button is activated, or the panel is dismissed
   * without confirming.
   */
  onCancel?: () => void;
  /**
   * Label for the confirm button. Defaults to `Confirmar`.
   */
  okText?: string;
  /**
   * Label for the cancel button. Defaults to `Cancelar`.
   */
  cancelText?: string;
  /**
   * Visual variant applied to the confirm button. Defaults to `primary`.
   */
  okVariant?: ButtonVariant;
  /**
   * Icon shown next to the title. Defaults to a question-mark icon.
   */
  icon?: ReactNode;
  /**
   * Side of the trigger the panel is anchored to. Defaults to `top`.
   */
  placement?: FloatingPlacement;
  /**
   * Prevents the panel from opening.
   */
  disabled?: boolean;
};

const ARROW_POSITION: Record<FloatingPlacement, string> = {
  top: 'bottom-[-4px]',
  bottom: 'top-[-4px]',
  left: 'right-[-4px]',
  right: 'left-[-4px]',
};

/**
 * Renders a floating confirmation panel opened by clicking its trigger,
 * asking the user to confirm or cancel an action before it runs, similar to
 * Ant Design's `Popconfirm` component.
 *
 * @param props Trigger element, confirmation copy, button labels/variant,
 *   and placement.
 * @returns The trigger wrapped with a click handler, plus a portal-rendered
 *   confirmation panel while open.
 */
export function Popconfirm({
  title,
  description,
  children,
  onConfirm,
  onCancel,
  okText = 'Confirmar',
  cancelText = 'Cancelar',
  okVariant = 'primary',
  icon,
  placement = 'top',
  disabled = false,
}: PopconfirmProps) {
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const position = useFloatingPosition(
    triggerRef,
    floatingRef,
    visible,
    placement,
  );

  // Closes the panel when clicking outside the trigger or panel.
  useEffect(() => {
    if (!visible) {
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
      setVisible(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [visible]);

  function handleConfirm() {
    setVisible(false);
    onConfirm?.();
  }

  function handleCancel() {
    setVisible(false);
    onCancel?.();
  }

  const isVertical = placement === 'top' || placement === 'bottom';

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: passive click wrapper used only to position the panel; the accessible interactive element is whatever is passed as children */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: click here only opens the panel, it does not perform the trigger's own action */}
      <span
        ref={triggerRef}
        className="inline-block"
        onClick={disabled ? undefined : () => setVisible((prev) => !prev)}
        aria-describedby={visible ? panelId : undefined}
      >
        {children}
      </span>
      {createPortal(
        <AnimatePresence>
          {visible && (
            <motion.div
              ref={floatingRef}
              id={panelId}
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
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-warning">
                  {icon ?? (
                    <HelpCircle
                      size={18}
                      aria-hidden="true"
                    />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {title}
                  </p>
                  {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={handleCancel}
                >
                  {cancelText}
                </Button>
                <Button
                  variant={okVariant}
                  size="small"
                  onClick={handleConfirm}
                >
                  {okText}
                </Button>
              </div>
              {position && (
                <span
                  className={`absolute h-2 w-2 rotate-45 bg-surface-raised ${ARROW_POSITION[placement]}`}
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
