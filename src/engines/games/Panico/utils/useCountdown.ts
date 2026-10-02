import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Configuration accepted by {@link useCountdown}.
 */
type UseCountdownOptions = {
  /**
   * Countdown duration, in seconds.
   */
  duration: number;
  /**
   * Whether the countdown should start immediately.
   */
  autoStart?: boolean;
  /**
   * Called once when the countdown reaches zero.
   */
  onExpire: () => void;
};

/**
 * Drives a lightweight countdown with both whole-second and millisecond
 * precision so Panico can render a smooth circular timer while validating
 * against a single expiry callback.
 *
 * @param options Countdown configuration.
 * @returns The remaining milliseconds/seconds and a way to stop the timer.
 */
export function useCountdown({
  duration,
  autoStart = true,
  onExpire,
}: UseCountdownOptions) {
  const totalMs = duration * 1_000;
  const [remainingMs, setRemainingMs] = useState(totalMs);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!autoStart) {
      return;
    }

    const deadline = Date.now() + totalMs;
    let expired = false;
    const interval = window.setInterval(() => {
      const nextRemainingMs = Math.max(0, deadline - Date.now());
      setRemainingMs(nextRemainingMs);

      if (!expired && nextRemainingMs <= 0) {
        expired = true;
        window.clearInterval(interval);
        onExpireRef.current();
      }
    }, 50);

    return () => {
      window.clearInterval(interval);
    };
  }, [autoStart, totalMs]);

  const timeLeft = useMemo(
    () => Math.max(0, Math.ceil(remainingMs / 1_000)),
    [remainingMs],
  );

  return {
    remainingMs,
    timeLeft,
  };
}
