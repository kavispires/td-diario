import type { DateKey, GameInfo } from 'types/puzzles';

/**
 * Renders a row of filled/empty heart emoji representing remaining lives,
 * for use in plain-text shareable results (where UI components can't be
 * rendered).
 *
 * @param remainingHearts - The number of remaining hearts.
 * @param totalHearts - The total number of hearts.
 * @param separator - Optional separator placed between each heart emoji.
 * @returns The heart result string, e.g. `"❤️❤️🩶"`.
 */
export function writeHeartResultString(
  remainingHearts: number,
  totalHearts: number,
  separator = '',
): string {
  const heartsValue = Math.max(0, remainingHearts);
  const maxHeartsValue = Math.max(heartsValue, totalHearts);
  return [
    ...Array(heartsValue).fill('❤️'),
    ...Array(maxHeartsValue - heartsValue).fill('🩶'),
  ].join(separator);
}

/**
 * The root URL shared alongside every game's result. Always points at the
 * app's hub, never at an individual game's route.
 */
export const SHARE_URL = 'https://diario.kavispires.com';

/**
 * Formats a `DateKey` (`YYYY-MM-DD`) as `DD-MM-YYYY`, for display in the
 * Hub's grouped share header (e.g. `"TD Diário 05-10-2026"`).
 *
 * @param dateId - A `YYYY-MM-DD` date string, e.g. today's challenge id.
 * @returns The same date formatted as `DD-MM-YYYY`.
 */
export function formatShareDate(dateId: DateKey): string {
  const [year, month, day] = dateId.split('-');
  return `${day}-${month}-${year}`;
}

/**
 * Shareable result returned by every game's `buildShare` function, shaped
 * to be passed directly to the Web Share API (`navigator.share`).
 */
export type ShareResult = {
  /**
   * Short headline naming the game and today's challenge number, e.g.
   * `"🧩 Organiku #42"`.
   */
  title: string;
  /**
   * Multi-line recap of the player's result (hearts, score, grid, etc).
   */
  text: string;
  /**
   * Link shared alongside the result. Always the app's root/hub, never a
   * route for an individual game.
   */
  url: string;
};

/**
 * Options accepted by {@link generateShareableResult}.
 */
export type GenerateShareableResultOptions = {
  /**
   * Metadata of the game the result belongs to, used for its emoji and name.
   */
  gameInfo: GameInfo;
  /**
   * Today's sequential challenge number.
   */
  challengeNumber: number;
  /**
   * The total number of hearts available.
   */
  totalHearts?: number;
  /**
   * The number of remaining hearts.
   */
  remainingHearts?: number;
  /**
   * Additional content appended to the same line as the hearts result.
   */
  heartsSuffix?: string;
  /**
   * Spacing between each heart emoji.
   */
  heartsSpacing?: string;
  /**
   * Additional lines appended after the hearts result (e.g. an emoji grid).
   */
  additionalLines?: string[];
  /**
   * Whether to omit the hearts line entirely.
   */
  hideHearts?: boolean;
};

/**
 * Builds the shareable result for a game's "Compartilhar Resultados"
 * action: a title naming the game and today's challenge number, and a body
 * text with the hearts result plus any game-specific extra lines. The
 * result is shaped to be passed directly to `navigator.share`.
 *
 * @param options - Game metadata, challenge number, and result details.
 * @returns The assembled `{ title, text, url }` share result.
 */
export function generateShareableResult({
  gameInfo,
  challengeNumber,
  totalHearts = 0,
  remainingHearts = 0,
  heartsSuffix = '',
  heartsSpacing = '',
  additionalLines = [],
  hideHearts = false,
}: GenerateShareableResultOptions): ShareResult {
  const text = [
    !hideHearts &&
      `${writeHeartResultString(remainingHearts, totalHearts, heartsSpacing)}${
        heartsSuffix ? ` ${heartsSuffix}` : ''
      }`,
    ...additionalLines,
  ]
    .filter(Boolean)
    .map((line) => (line as string).trim())
    .join('\n');

  return {
    title: `${gameInfo.emoji} ${gameInfo.name.pt} #${challengeNumber}`,
    text,
    url: SHARE_URL,
  };
}
