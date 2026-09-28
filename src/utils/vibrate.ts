/**
 * Vibration patterns (in milliseconds, on/off/on/...) for each supported
 * feedback mode.
 */
const VIBRATION_PATTERNS: Record<string, number[]> = {
  lose: [200, 100, 200, 100, 200],
  wrong: [100],
};

/**
 * Triggers a short device vibration for the given feedback mode, if the
 * Vibration API is available. No-ops silently otherwise (e.g. desktop
 * browsers, iOS Safari).
 *
 * @param mode - Which vibration pattern to play.
 */
export function vibrate(mode: 'lose' | 'wrong'): void {
  if (!navigator.vibrate) {
    return;
  }

  const pattern = VIBRATION_PATTERNS[mode] ?? [];
  if (pattern.length === 0) {
    return;
  }

  navigator.vibrate(pattern);
}
