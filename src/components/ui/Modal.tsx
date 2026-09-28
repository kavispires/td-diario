import { IconButton } from '@components/ui/IconButton';
import { cn } from '@utils/cn';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

/**
 * Props accepted by the {@link Modal} component.
 */
type ModalProps = {
  /**
   * Whether the modal is visible.
   */
  open: boolean;
  /**
   * Called when the close button (or, if enabled, the Escape key) is
   * activated. The overlay mask never triggers this — the modal is only
   * closeable via the explicit close button (and optionally Escape).
   */
  onClose: () => void;
  /**
   * Optional header content shown next to the close button.
   */
  title?: ReactNode;
  /**
   * Body content of the modal.
   */
  children: ReactNode;
  /**
   * Optional footer content, e.g. a row of action buttons. Omitted entirely
   * when not provided.
   */
  footer?: ReactNode;
  /**
   * Overrides the default close icon.
   */
  closeIcon?: ReactNode;
  /**
   * Whether pressing Escape also calls `onClose`. Defaults to `true`.
   */
  closeOnEsc?: boolean;
  /**
   * Whether the page behind the modal is prevented from scrolling while
   * it's open. Defaults to `true`.
   */
  lockScroll?: boolean;
  /**
   * Accessible name for the dialog, used when `title` is not provided.
   */
  'aria-label'?: string;
  /**
   * Additional classes merged with the modal panel's own classes.
   */
  className?: string;
  /**
   * Overrides the portal wrapper's stacking order. Defaults to `40`, above
   * the app chrome but below nothing else; raise it when the modal must sit
   * above another fixed overlay (e.g. the game launch splash).
   */
  zIndex?: number;
};

/**
 * Renders a full-screen modal sheet that covers the app with a small margin
 * on every side, similar to a native mobile screen overlay. Unlike Ant
 * Design's `Modal`, the overlay mask never dismisses it — it is only
 * closeable via the explicit close button (and, by default, the Escape
 * key).
 *
 * @param props Visibility, close handler, header/body/footer content, and
 *   behavior options.
 * @returns A portal-rendered modal overlay, or `null` while closed.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  closeIcon,
  closeOnEsc = true,
  lockScroll = true,
  'aria-label': ariaLabel,
  className,
  zIndex = 40,
}: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open || !closeOnEsc) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    if (!open || !lockScroll) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, lockScroll]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 flex items-stretch justify-center bg-foreground/50 p-4"
          style={{ zIndex }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-label={title ? undefined : ariaLabel}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn(
              'relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-surface-raised shadow-2xl',
              className,
            )}
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div
                id={titleId}
                className="text-lg font-semibold text-foreground"
              >
                {title}
              </div>
              <IconButton
                icon={closeIcon ?? <X />}
                aria-label="Fechar"
                variant="ghost"
                onClick={onClose}
              />
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

            {footer && (
              <div className="border-t border-border px-5 py-4">{footer}</div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
