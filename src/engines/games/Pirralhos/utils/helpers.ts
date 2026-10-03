import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyPirralhosEntry } from 'types/games';
import { gameInfo } from '../info';
import { PIRRALHOS_TOTAL_HEARTS } from './constants';
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

const DEFAULT_ASSESSMENT: KidAssessment = 'unknown';

const HARDCODED_POSITIONS: Record<number, EllipsePosition[]> = {
  3: [
    { x: 50, y: 10, angle: 45 },
    { x: 85, y: 60, angle: 0 },
    { x: 15, y: 60, angle: -45 },
  ],
  4: [
    { x: 50, y: 10, angle: 45 },
    { x: 85, y: 40, angle: -45 },
    { x: 50, y: 75, angle: 45 },
    { x: 15, y: 40, angle: -45 },
  ],
  5: [
    { x: 50, y: 5, angle: 45 },
    { x: 85, y: 35, angle: -45 },
    { x: 75, y: 75, angle: 0 },
    { x: 25, y: 75, angle: 45 },
    { x: 15, y: 35, angle: -45 },
  ],
  6: [
    { x: 50, y: 5, angle: 45 },
    { x: 85, y: 25, angle: 90 },
    { x: 85, y: 60, angle: -45 },
    { x: 50, y: 85, angle: 45 },
    { x: 15, y: 60, angle: 90 },
    { x: 15, y: 25, angle: -45 },
  ],
  7: [
    { x: 50, y: 5, angle: 45 },
    { x: 85, y: 25, angle: 90 },
    { x: 85, y: 55, angle: 115 },
    { x: 75, y: 85, angle: 0 },
    { x: 25, y: 85, angle: 65 },
    { x: 15, y: 55, angle: 90 },
    { x: 15, y: 25, angle: -45 },
  ],
  8: [
    { x: 50, y: 5, angle: 45 },
    { x: 85, y: 20, angle: 90 },
    { x: 85, y: 45, angle: 90 },
    { x: 85, y: 70, angle: -45 },
    { x: 50, y: 85, angle: 45 },
    { x: 15, y: 70, angle: 90 },
    { x: 15, y: 45, angle: 90 },
    { x: 15, y: 20, angle: -45 },
  ],
  9: [
    { x: 50, y: 5, angle: 45 },
    { x: 85, y: 15, angle: 90 },
    { x: 85, y: 40, angle: 90 },
    { x: 85, y: 65, angle: -75 },
    { x: 75, y: 88, angle: 45 },
    { x: 25, y: 88, angle: 75 },
    { x: 15, y: 65, angle: 90 },
    { x: 15, y: 40, angle: 90 },
    { x: 15, y: 15, angle: -45 },
  ],
  10: [
    { x: 50, y: 5, angle: 45 },
    { x: 85, y: 15, angle: 90 },
    { x: 85, y: 37, angle: 90 },
    { x: 85, y: 60, angle: 90 },
    { x: 85, y: 83, angle: -45 },
    { x: 50, y: 90, angle: 45 },
    { x: 15, y: 83, angle: 90 },
    { x: 15, y: 60, angle: 90 },
    { x: 15, y: 37, angle: 90 },
    { x: 15, y: 15, angle: -45 },
  ],
};

const HEIGHT_EXTRA_BY_COUNT = [
  0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 0.4, 0.7, 0.7, 0.5,
];

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
 * Builds the plain-text shareable result for today's Pirralhos run using
 * the standard header, hearts, and site link only.
 *
 * @param options - Today's challenge number and final heart count.
 * @returns The assembled shareable result text.
 */
export function buildShareText({
  challengeNumber,
  hearts,
}: {
  challengeNumber: number;
  hearts: number;
}): string {
  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts: PIRRALHOS_TOTAL_HEARTS,
    remainingHearts: hearts,
    additionalLines: [],
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
