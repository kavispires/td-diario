import type { NotificationType } from '@store/useNotificationStore';
import { useNotificationStore } from '@store/useNotificationStore';
import type { ReactNode } from 'react';

const DEFAULT_DURATION = 3000;

function open(type: NotificationType, content: ReactNode, duration: number) {
  return useNotificationStore.getState().push({ type, content, duration });
}

/**
 * Imperative API for showing toast-style notifications from anywhere in the
 * app (event handlers, services, hooks), similar to Ant Design's
 * `App.message`. Rendered by `NotificationHost`, mounted once near the app
 * root.
 */
export const notification = {
  /**
   * Shows a success notification. Auto-dismisses after `duration`
   * (defaults to 3000ms).
   *
   * @param content Content displayed inside the notification.
   * @param duration Time, in milliseconds, before auto-dismiss.
   * @returns The generated notification id, usable with `update`/`close`.
   */
  success: (content: ReactNode, duration = DEFAULT_DURATION) =>
    open('success', content, duration),
  /**
   * Shows an error notification. Auto-dismisses after `duration` (defaults
   * to 3000ms).
   *
   * @param content Content displayed inside the notification.
   * @param duration Time, in milliseconds, before auto-dismiss.
   * @returns The generated notification id, usable with `update`/`close`.
   */
  error: (content: ReactNode, duration = DEFAULT_DURATION) =>
    open('error', content, duration),
  /**
   * Shows an informational notification. Auto-dismisses after `duration`
   * (defaults to 3000ms).
   *
   * @param content Content displayed inside the notification.
   * @param duration Time, in milliseconds, before auto-dismiss.
   * @returns The generated notification id, usable with `update`/`close`.
   */
  info: (content: ReactNode, duration = DEFAULT_DURATION) =>
    open('info', content, duration),
  /**
   * Shows a warning notification. Auto-dismisses after `duration` (defaults
   * to 3000ms).
   *
   * @param content Content displayed inside the notification.
   * @param duration Time, in milliseconds, before auto-dismiss.
   * @returns The generated notification id, usable with `update`/`close`.
   */
  warning: (content: ReactNode, duration = DEFAULT_DURATION) =>
    open('warning', content, duration),
  /**
   * Shows a loading notification. Does not auto-dismiss by default; call
   * `update` or `close` with the returned id once the operation settles.
   *
   * @param content Content displayed inside the notification.
   * @param duration Time, in milliseconds, before auto-dismiss. Defaults to
   *   `0` (no auto-dismiss).
   * @returns The generated notification id, usable with `update`/`close`.
   */
  loading: (content: ReactNode, duration = 0) =>
    open('loading', content, duration),
  /**
   * Updates an existing notification's type, content, and/or duration, e.g.
   * to turn a `loading` notification into a `success` one.
   *
   * @param id Id returned by a previous `notification.*` call.
   * @param changes Fields to replace on the existing notification.
   */
  update: (
    id: string,
    changes: Partial<{
      type: NotificationType;
      content: ReactNode;
      duration: number;
    }>,
  ) => useNotificationStore.getState().update(id, changes),
  /**
   * Dismisses a notification immediately.
   *
   * @param id Id returned by a previous `notification.*` call.
   */
  close: (id: string) => useNotificationStore.getState().remove(id),
};
