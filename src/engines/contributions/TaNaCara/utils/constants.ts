import type { DailyTaNaCaraVariant } from 'types/games';
import type { TaNaCaraMode } from './types';

/**
 * Supported portrait style variants available in the Ta Na Cara selector.
 */
export const VARIANT_OPTIONS = ['gb', 'rl', 'px', 'fx'] as const;

/**
 * Default content mode used when a fresh Ta Na Cara session starts.
 */
export const DEFAULT_MODE: TaNaCaraMode = 'normal';

/**
 * Fallback portrait style used when the daily payload omits a supported
 * variant.
 */
export const DEFAULT_VARIANT: DailyTaNaCaraVariant = 'gb';

/**
 * Maximum number of suspects shown for each testimony.
 */
export const SUSPECTS_PER_QUESTION = 6;

/**
 * Minimum number of marked suspects required before a testimony counts as
 * answered and the player can move on.
 */
export const MIN_REQUIRED_ANSWERS = 4;

/**
 * Minimum number of testimonies that must be answered before Ta Na Cara can
 * be submitted.
 */
export const MIN_REQUIRED_QUESTIONS = 6;

/**
 * Points awarded for each suspect that the player marks while answering.
 */
export const SCORE_PER_MARKED_ANSWER = 10;

/**
 * Maximum number of suspects preferentially drawn from a testimony's own
 * suspect list before Ta Na Cara fills remaining slots from the daily pool.
 */
export const MAX_PREFERRED_SUSPECTS_PER_QUESTION = 5;

/**
 * Vertical distance used by the testimony card enter/exit animation.
 */
export const QUESTION_TRANSITION_OFFSET_PX = 12;

/**
 * Duration used by the testimony card enter/exit animation.
 */
export const QUESTION_TRANSITION_DURATION_SECONDS = 0.2;
