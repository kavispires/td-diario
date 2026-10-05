import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { ShareResult } from '@utils/shareResults';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyAlienadoEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  ALIENADO_GUESS_DELIMITER,
  ALIENADO_SHARE_ABSENT_EMOJI,
  ALIENADO_SHARE_POSITION_EMOJIS,
  ALIENADO_SHARE_PRESENT_EMOJI,
} from './constants';
import type { GameState } from './types';

/**
 * Builds the default `GameState` for a fresh day of Alienado.
 *
 * Hearts start equal to the number of requests the player must satisfy.
 *
 * @param data Today's Alienado challenge payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyAlienadoEntry): GameState {
  return {
    id: data.id,
    number: data.number,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: data.requests.length,
    guesses: [],
    score: 0,
    progress: 0,
  };
}

/**
 * Retrieves today's Alienado state, restoring it from local storage when it
 * matches today's challenge id, or building a fresh state otherwise.
 *
 * @param data Today's Alienado challenge payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyAlienadoEntry): GameState {
  return loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: getDefaultState(data),
  });
}

/**
 * Splits Alienado's persisted solution/guess format into an ordered list of
 * item ids.
 *
 * @param value Persisted `item-item-item-item` value.
 * @returns The ordered item ids.
 */
export function splitGuess(value: string): string[] {
  return value.split(ALIENADO_GUESS_DELIMITER);
}

/**
 * Counts how many positions in a guess exactly match today's solution.
 *
 * @param guessItems Item ids chosen by the player in slot order.
 * @param solutionItems Correct item ids in slot order.
 * @returns The number of exact positional matches.
 */
export function countMatchedPositions(
  guessItems: string[],
  solutionItems: string[],
): number {
  return guessItems.reduce(
    (total, itemId, index) => total + (itemId === solutionItems[index] ? 1 : 0),
    0,
  );
}

/**
 * Builds the shareable result for today's Alienado run, reusing
 * the original per-slot emoji feedback for each submitted guess.
 *
 * @param options - Today's challenge number and final run state.
 * @returns The assembled `{ title, text, url }` share result.
 */
export function buildShare({
  challengeNumber,
  hearts,
  guesses,
  solution,
  score,
}: {
  challengeNumber: number;
  hearts: number;
  guesses: string[][];
  solution: string;
  score: number;
}): ShareResult {
  const solutionItems = splitGuess(solution);
  const additionalLines = guesses.map((guessItems) =>
    guessItems
      .map((itemId, index) => {
        if (itemId === solutionItems[index]) {
          return (
            ALIENADO_SHARE_POSITION_EMOJIS[index] ??
            ALIENADO_SHARE_PRESENT_EMOJI
          );
        }

        if (solutionItems.includes(itemId)) {
          return ALIENADO_SHARE_PRESENT_EMOJI;
        }

        return ALIENADO_SHARE_ABSENT_EMOJI;
      })
      .join(''),
  );

  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts: solutionItems.length,
    remainingHearts: hearts,
    additionalLines,
    heartsSuffix: `(${score}pts)`,
  });
}

/**
 * Recreates Alienado's shareable result using only the persisted daily
 * challenge payload and stored game progress, without mounting the game
 * engine or triggering any UI side effects.
 *
 * @param data Today's Alienado challenge payload.
 * @param state Persisted daily Alienado progress restored from local storage.
 * @returns The assembled `{ title, text, url }` share result for the run.
 */
export function buildShareFromProgress(
  data: DailyAlienadoEntry,
  state: GameState,
): ShareResult {
  return buildShare({
    challengeNumber: data.number,
    hearts: state.hearts,
    guesses: state.guesses.map(splitGuess),
    solution: data.solution,
    score: state.score,
  });
}
