import type { PointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Default hold duration, in milliseconds, before a press counts as "long".
 */
const DEFAULT_LONG_PRESS_DURATION_MS = 750;

/**
 * Default safety-net duration, in milliseconds, after which an open
 * long-press state auto-dismisses even without a release event.
 */
const DEFAULT_AUTO_DISMISS_MS = 3000;

/**
 * Options accepted by {@link useLongPress}.
 */
type UseLongPressOptions = {
  /**
   * Whether the long-press timer should be armed. When `false`, pointer
   * events are ignored and `isPressing` never becomes `true`. Defaults to
   * `true`.
   */
  enabled?: boolean;
  /**
   * Hold duration, in milliseconds, required to trigger `isPressing`.
   * Defaults to {@link DEFAULT_LONG_PRESS_DURATION_MS}.
   */
  durationMs?: number;
  /**
   * Safety-net duration, in milliseconds, after which `isPressing` is
   * force-reset to `false` even if no pointer-up/leave/cancel event fires
   * (e.g. a touch release missed by the browser). Defaults to
   * {@link DEFAULT_AUTO_DISMISS_MS}.
   */
  autoDismissMs?: number;
};

/**
 * Pointer event handlers returned by {@link useLongPress}, meant to be
 * spread onto the pressable element.
 */
type LongPressHandlers = {
  onPointerDown: (event: PointerEvent) => void;
  onPointerUp: (event: PointerEvent) => void;
  onPointerLeave: (event: PointerEvent) => void;
  onPointerCancel: (event: PointerEvent) => void;
  onContextMenu: (event: React.MouseEvent) => void;
};

/**
 * Tracks whether an element is currently being pressed and held for at
 * least `durationMs`, working for both touch and mouse pointers. Useful for
 * revealing a tooltip on long-press on touch devices, where hover isn't
 * available.
 *
 * @param options Whether the timer is armed and the required hold duration.
 * @returns Whether the element is currently held past the threshold, and
 *   the pointer handlers to spread onto the pressable element.
 */
export function useLongPress({
  enabled = true,
  durationMs = DEFAULT_LONG_PRESS_DURATION_MS,
  autoDismissMs = DEFAULT_AUTO_DISMISS_MS,
}: UseLongPressOptions = {}): {
  isPressing: boolean;
  handlers: LongPressHandlers;
  dismiss: () => void;
} {
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (autoDismissRef.current) {
      clearTimeout(autoDismissRef.current);
      autoDismissRef.current = null;
    }
    setIsPressing(false);
  }, []);

  const start = useCallback(() => {
    if (!enabled) {
      return;
    }

    clear();
    timerRef.current = setTimeout(() => {
      setIsPressing(true);
      // Safety net: force-dismiss even if the browser never fires a
      // pointer-up/leave/cancel event for this press (observed getting
      // "stuck" open on some touch interactions).
      autoDismissRef.current = setTimeout(() => {
        autoDismissRef.current = null;
        setIsPressing(false);
      }, autoDismissMs);
    }, durationMs);
  }, [enabled, durationMs, autoDismissMs, clear]);

  // Cancel any pending timer on unmount.
  useEffect(() => clear, [clear]);

  return {
    isPressing,
    dismiss: clear,
    handlers: {
      onPointerDown: start,
      onPointerUp: clear,
      onPointerLeave: clear,
      onPointerCancel: clear,
      // Prevent the native context menu from interrupting a long press on
      // touch devices.
      onContextMenu: (event) => {
        if (enabled) {
          event.preventDefault();
        }
      },
    },
  };
}
