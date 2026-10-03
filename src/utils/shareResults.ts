import type { GameInfo } from 'types/puzzles';

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
   * Optional headline included right after the game/challenge line.
   */
  title?: string;
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
  /**
   * Whether to omit the trailing link to TD Diário.
   */
  hideLink?: boolean;
};

/**
 * Builds the plain-text shareable result copied to the clipboard when a
 * player taps "Compartilhar Resultados": a header line naming the game and
 * today's challenge number, an optional title, the hearts result, any
 * game-specific extra lines, and a trailing link back to TD Diário.
 *
 * @param options - Game metadata, challenge number, and result details.
 * @returns The assembled shareable result text.
 */
export function generateShareableResult({
  gameInfo,
  challengeNumber,
  title,
  totalHearts = 0,
  remainingHearts = 0,
  heartsSuffix = '',
  heartsSpacing = '',
  additionalLines = [],
  hideHearts = false,
  hideLink = false,
}: GenerateShareableResultOptions): string {
  return [
    `${gameInfo.emoji} TD Diário ${gameInfo.name.pt} #${challengeNumber}`,
    title,
    !hideHearts &&
      `${writeHeartResultString(remainingHearts, totalHearts, heartsSpacing)}${
        heartsSuffix ? ` ${heartsSuffix}` : ''
      }`,
    ...additionalLines,
    !hideLink && 'https://diario.kavispires.com',
  ]
    .filter(Boolean)
    .map((line) => (line as string).trim())
    .join('\n');
}
