import type {
  Notification,
  NotificationType,
} from '@store/useNotificationStore';
import { useNotificationStore } from '@store/useNotificationStore';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  XCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const TYPE_ICONS: Record<NotificationType, typeof Info> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  loading: Loader2,
};

const TYPE_CLASSES: Record<NotificationType, string> = {
  success: 'bg-success/10 border-success/30 text-success',
  info: 'bg-secondary/10 border-secondary/30 text-secondary',
  warning: 'bg-warning/10 border-warning/30 text-warning',
  error: 'bg-destructive/10 border-destructive/30 text-destructive',
  loading: 'bg-border/60 border-border-strong text-muted-foreground',
};

/**
 * Renders a single toast entry and schedules its own auto-dismiss timer.
 *
 * @param props The notification to render.
 * @returns A styled, animated toast element.
 */
function NotificationItem({ id, type, content, duration }: Notification) {
  const remove = useNotificationStore((state) => state.remove);
  const Icon = TYPE_ICONS[type];

  // Auto-dismisses the notification after `duration`, unless it is `0`
  // (used by `loading` notifications, which are closed explicitly).
  useEffect(() => {
    if (!duration) {
      return;
    }
    const timeout = window.setTimeout(() => remove(id), duration);
    return () => window.clearTimeout(timeout);
  }, [id, duration, remove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className={`pointer-events-auto flex max-w-xs items-center gap-2 rounded-full border px-4 py-2 shadow-lg ${TYPE_CLASSES[type]}`}
    >
      <Icon
        size={18}
        className={`shrink-0 ${type === 'loading' ? 'animate-spin' : ''}`}
        aria-hidden="true"
      />
      <span className="min-w-0 truncate text-sm font-medium text-foreground">
        {content}
      </span>
    </motion.div>
  );
}

/**
 * Renders the stack of active toast-style notifications pushed via the
 * `notification` imperative helper (`@utils/notification`). Mount this once
 * near the app root.
 *
 * @returns A portal-rendered, fixed-position notification stack.
 */
export function NotificationHost() {
  const notifications = useNotificationStore((state) => state.notifications);

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[100] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {notifications.map((item) => (
          <NotificationItem
            key={item.id}
            {...item}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
