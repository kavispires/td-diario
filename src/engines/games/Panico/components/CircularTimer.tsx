import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Props accepted by {@link CircularTimer}.
 */
type CircularTimerProps = {
  /**
   * Total countdown duration, in seconds.
   */
  duration: number;
  /**
   * Remaining countdown time, in milliseconds.
   */
  remainingMs: number;
  /**
   * Content rendered at the center of the timer.
   */
  children: ReactNode;
  /**
   * Width/height of the timer, in pixels.
   */
  size?: number;
};

/**
 * Renders Panico's segmented circular countdown around the active button.
 *
 * @param props Timer duration, remaining time, and centered content.
 * @returns The rendered countdown ring.
 */
export function CircularTimer({
  duration,
  remainingMs,
  children,
  size = 320,
}: CircularTimerProps) {
  const progress =
    duration <= 0
      ? 0
      : Math.max(0, Math.min(1, remainingMs / (duration * 1_000)));
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="10"
          fill="none"
          strokeDasharray="10 2"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke="url(#panico-timer-gradient)"
          strokeWidth="12"
          fill="none"
          strokeDasharray="10 2"
          strokeDashoffset={circumference * (1 - progress)}
        />
        <defs>
          <linearGradient
            id="panico-timer-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#fde047"
            />
            <stop
              offset="100%"
              stopColor="#f97316"
            />
          </linearGradient>
        </defs>
      </svg>

      {children}
    </div>
  );
}
