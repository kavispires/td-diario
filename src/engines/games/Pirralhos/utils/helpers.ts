import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { ShareResult } from '@utils/shareResults';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyPirralhosEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  DEFAULT_ASSESSMENT,
  HARDCODED_POSITIONS,
  HEIGHT_EXTRA_BY_COUNT,
  PIRRALHOS_TOTAL_HEARTS,
} from './constants';
import type { GameState, KidAssessment } from './types';

/**
 * One absolute-positioned point along Pirralhos' elliptical kid layout.
 */
export type EllipsePosition = {
  /**
   * Horizontal offset as a percentage of the ellipse container.
   */
  x: number;
  /**
   * Vertical offset as a percentage of the ellipse container.
   */
  y: number;
  /**
   * Rotation, in degrees, applied to the connector arrow toward the next kid.
   */
  angle: number;
};

/**
 * Builds the default note markers for today's visible kids.
 *
 * @param data - Today's Pirralhos payload.
 * @returns An assessment map keyed by kid id.
 */
export function getDefaultAssessments(
  data: DailyPirralhosEntry,
): Dictionary<KidAssessment> {
  const assessments: Dictionary<KidAssessment> = Object.fromEntries(
    data.kids.map((kidEntry) => [kidEntry.kidId, DEFAULT_ASSESSMENT] as const),
  );
  return assessments;
}

/**
 * Builds the default state for a fresh Pirralhos day.
 *
 * @param data - Today's Pirralhos payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyPirralhosEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: PIRRALHOS_TOTAL_HEARTS,
    guesses: [],
    assessments: getDefaultAssessments(data),
    score: 0,
    progress: 0,
  };
}

/**
 * Retrieves today's Pirralhos state, restoring it from local storage when
 * it matches today's challenge id, or building a fresh state otherwise.
 *
 * @param data - Today's Pirralhos payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyPirralhosEntry): GameState {
  return loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: getDefaultState(data),
  });
}

/**
 * Builds the shareable result for today's Pirralhos run using
 * the standard header, hearts, and site link only.
 *
 * @param options - Today's challenge number and final heart count.
 * @returns The assembled `{ title, text, url }` share result.
 */
export function buildShare({
  challengeNumber,
  hearts,
  score,
}: {
  challengeNumber: number;
  hearts: number;
  score: number;
}): ShareResult {
  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts: PIRRALHOS_TOTAL_HEARTS,
    remainingHearts: hearts,
    heartsSuffix: `(${score}pts)`,
    additionalLines: [],
  });
}

/**
 * Reconstructs Pirralhos' shareable result directly from today's payload and
 * persisted progress, without mounting the game engine or results UI.
 *
 * @param data - Today's Pirralhos challenge payload.
 * @param state - Persisted progress snapshot for today's run.
 * @returns The assembled `{ title, text, url }` share result.
 */
export function buildShareFromProgress(
  data: DailyPirralhosEntry,
  state: GameState,
): ShareResult {
  return buildShare({
    challengeNumber: data.number,
    hearts: state.hearts,
    score: state.score,
  });
}

/**
 * Returns the absolute-positioned kid layout optimized for mobile portrait
 * play, falling back to the 5-kid template if an unexpected count appears.
 *
 * @param kidCount - Number of kids in today's mystery.
 * @returns Layout positions for each kid around the ellipse.
 */
export function calculateEllipsePositions(kidCount: number): EllipsePosition[] {
  return HARDCODED_POSITIONS[kidCount] ?? HARDCODED_POSITIONS[5];
}

/**
 * Estimates the ellipse container height needed for the given card width
 * and kid count.
 *
 * @param kidCount - Number of kids in today's mystery.
 * @param cardWidth - Rendered width of each kid card, in pixels.
 * @returns Container height, in pixels.
 */
export function getEllipseHeight(kidCount: number, cardWidth: number): number {
  const extra = HEIGHT_EXTRA_BY_COUNT[kidCount] ?? 0.5;
  return (cardWidth / 0.67) * (kidCount / 2 + extra);
}

/**
 * Finds the tightest vertical gap, as a percentage of the ellipse
 * container's height, between any two positions that sit roughly in the
 * same horizontal column (and would therefore stack visually).
 *
 * @param positions - Layout positions for today's kid count.
 * @param xThreshold - Maximum horizontal percentage distance for two
 * positions to be considered part of the same column. Defaults to `20`.
 * @returns The smallest same-column vertical gap percentage, or `0` if no
 * two positions share a column.
 */
export function getMinStackedYGapPercent(
  positions: EllipsePosition[],
  xThreshold = 20,
): number {
  let minGap = Number.POSITIVE_INFINITY;

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dx = Math.abs(positions[i].x - positions[j].x);
      if (dx > xThreshold) {
        continue;
      }

      const dy = Math.abs(positions[i].y - positions[j].y);
      if (dy > 0 && dy < minGap) {
        minGap = dy;
      }
    }
  }

  return Number.isFinite(minGap) ? minGap : 0;
}

/**
 * Grows the base ellipse height, when needed, so that the tallest rendered
 * kid card (portrait + badges + statement bubble) never overlaps its
 * vertical neighbor in the same column.
 *
 * @param baseHeight - Height from {@link getEllipseHeight}.
 * @param positions - Layout positions for today's kid count.
 * @param maxCardHeight - Tallest measured kid card height, in pixels.
 * @returns A container height guaranteed to fit same-column cards without
 * overlap, or `baseHeight` unchanged if no measurement/column applies.
 */
export function getOverlapSafeEllipseHeight(
  baseHeight: number,
  positions: EllipsePosition[],
  maxCardHeight: number,
): number {
  if (!maxCardHeight) {
    return baseHeight;
  }

  const minYGapPercent = getMinStackedYGapPercent(positions);
  if (!minYGapPercent) {
    return baseHeight;
  }

  // Require the measured card height (plus a small buffer) to fit within
  // the tightest same-column percentage gap.
  const required = (maxCardHeight * 1.05) / (minYGapPercent / 100);
  return Math.max(baseHeight, required);
}

/**
 * Builds the public liar-count hint text shown above the board.
 *
 * @param actualLiars - Actual liar ids embedded in today's data.
 * @param possibleLiars - Public hint count from the payload.
 * @returns A count or range such as `1`, `2`, or `1-2`.
 */
export function getLiarsCountLabel(
  actualLiars: string[],
  possibleLiars: number,
): string {
  if (possibleLiars === actualLiars.length) {
    return String(actualLiars.length);
  }

  const minimum = Math.min(possibleLiars, actualLiars.length);
  const maximum = Math.max(possibleLiars, actualLiars.length);
  return `${minimum}-${maximum}`;
}

/**
 * Returns the singular/plural liar label that best matches the public hint.
 *
 * @param actualLiars - Actual liar ids embedded in today's data.
 * @param possibleLiars - Public hint count from the payload.
 * @returns `Mentiroso` or `Mentirosos`.
 */
export function getLiarsLabel(
  actualLiars: string[],
  possibleLiars: number,
): string {
  return Math.max(actualLiars.length, possibleLiars) === 1
    ? 'Mentiroso'
    : 'Mentirosos';
}

/**
 * Computes the share of the puzzle that has been meaningfully resolved
 * after the current accusation.
 *
 * @param guessCount - Number of accusations made so far.
 * @param isWin - Whether the current accusation solved the mystery.
 * @returns Progress from `0` to `1`.
 */
export function getProgress(guessCount: number, isWin: boolean): number {
  if (isWin) {
    return 1;
  }

  return Math.min(guessCount / PIRRALHOS_TOTAL_HEARTS, 1);
}

/**
 * Computes Pirralhos' final score from the remaining hearts and how many
 * kids were in the mystery. Only solved games earn score.
 *
 * @param hearts - Remaining accusation attempts after solving.
 * @param kidCount - Number of kids shown in today's mystery.
 * @returns Final score for a winning run.
 */
export function getWinScore(hearts: number, kidCount: number): number {
  return hearts * 100 + kidCount * 10;
}
