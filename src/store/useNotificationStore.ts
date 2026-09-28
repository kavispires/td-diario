import type { ReactNode } from 'react';
import { create } from 'zustand';

/**
 * Semantic type of a {@link Notification}, controlling its icon and color.
 */
export type NotificationType =
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | 'loading';

/**
 * A single toast-style notification entry.
 */
export type Notification = {
  /**
   * Unique id, used to update or dismiss the notification later.
   */
  id: string;
  /**
   * Semantic type, controlling the icon and color shown.
   */
  type: NotificationType;
  /**
   * Content displayed inside the notification.
   */
  content: ReactNode;
  /**
   * Time, in milliseconds, before the notification auto-dismisses. `0`
   * disables auto-dismiss (used for `loading` notifications by default).
   */
  duration: number;
};

/**
 * Fields accepted when pushing a new notification, before an `id` is
 * assigned.
 */
type PushNotificationInput = Omit<Notification, 'id'>;

/**
 * Shape of the {@link useNotificationStore} state and actions.
 */
type NotificationState = {
  /**
   * Notifications currently visible, in the order they were pushed.
   */
  notifications: Notification[];
  /**
   * Adds a new notification and returns its generated id.
   */
  push: (notification: PushNotificationInput) => string;
  /**
   * Replaces the content/type/duration of an existing notification, e.g. to
   * turn a `loading` notification into a `success` one.
   */
  update: (id: string, changes: Partial<PushNotificationInput>) => void;
  /**
   * Removes a notification by id.
   */
  remove: (id: string) => void;
};

/**
 * Global store of active toast-style notifications, rendered by
 * `NotificationHost`. Prefer the imperative `notification` helper
 * (`@utils/notification`) over calling this store directly.
 */
export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  push: (input) => {
    const id = crypto.randomUUID();
    set((state) => ({
      notifications: [...state.notifications, { id, ...input }],
    }));
    return id;
  },
  update: (id, changes) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, ...changes } : notification,
      ),
    }));
  },
  remove: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    }));
  },
}));
