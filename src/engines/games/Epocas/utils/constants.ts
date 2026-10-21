/**
 * Total hearts (lives) a player starts a day of Épocas with, regardless of
 * how many events today's timeline contains.
 */
export const EPOCAS_TOTAL_HEARTS = 3;

/**
 * Points awarded per correctly placed event on a successful verify (i.e.
 * only scored once the whole timeline is solved), multiplied by the
 * player's remaining hearts at that moment, so winning with more lives
 * left scores higher than winning after losing hearts. Failed attempts
 * earn no points, just feedback.
 */
export const CORRECT_POSITION_SCORE = 5;

/**
 * Flat bonus points awarded once, on top of the usual per-event score,
 * when the timeline is fully solved.
 */
export const WIN_BONUS_SCORE = 20;

/**
 * Icon size used by the hearts counter in the Épocas header stats.
 */
export const EPOCAS_HEART_ICON_SIZE = 16;

/**
 * Horizontal offsets used by the timeline shake animation after a failed
 * verify attempt.
 */
export const EPOCAS_SHAKE_KEYFRAMES: number[] = [0, -8, 8, -6, 6, 0];

/**
 * Duration of the failed-verify shake animation, in seconds.
 */
export const EPOCAS_SHAKE_ANIMATION_DURATION_SECONDS = 0.32;

/**
 * Fixed width, in pixels, used for each event card in the horizontally
 * scrollable timeline.
 */
export const EPOCAS_CARD_WIDTH = 140;
