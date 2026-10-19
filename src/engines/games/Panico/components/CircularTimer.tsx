import type { ReactNode } from 'react';
import { useId } from 'react';

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
 * Renders Panico's circular countdown ring around the active button: a
 * static segmented track plus a matching segmented arc that's progressively
 * unmasked (revealed) as `remainingMs` counts down, so the dashes themselves
 * never move — only how many of them are lit changes.
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
  const maskId = useId();
  const gradientId = useId();
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
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#a3e635"
            />
            <stop
              offset="100%"
              stopColor="#4d7c0f"
            />
          </linearGradient>

          <mask id={maskId}>
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="white"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={-circumference * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 80ms linear' }}
            />
          </mask>
        </defs>

        {/* Static segmented background track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="10"
          fill="none"
          strokeDasharray="10 2"
        />

        {/* Segmented foreground track, revealed by the mask as time drains */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth="12"
          fill="none"
          strokeDasharray="10 2"
          mask={`url(#${maskId})`}
        />
      </svg>

      {children}
    </div>
  );
}
