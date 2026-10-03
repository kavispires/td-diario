import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { getLettersInWord } from '@utils/prompts';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyArteRuimEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import { gameInfo } from '../info';
import { ARTE_RUIM_HEARTS } from './constants';
import type { GameState } from './types';

/**
 * Builds the default `GameState` for a fresh Arte Ruim day.
 *
 * @param data - Today's Arte Ruim challenge payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyArteRuimEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: ARTE_RUIM_HEARTS,
    solution: getLettersInWord(data.text),
    guesses: {},
    progress: 0,
    score: 0,
  };
}

/**
 * Validates that a restored local Arte Ruim state still matches today's
 * answer and has coherent persisted fields.
 *
 * @param state - Restored local state candidate.
 * @param data - Today's Arte Ruim challenge payload.
 * @returns Whether the restored state is safe to reuse.
 */
function isValidState(state: GameState, data: DailyArteRuimEntry): boolean {
  const expectedLetters = Object.keys(getLettersInWord(data.text)).sort();
  const currentLetters = Object.keys(state.solution).sort();

  return (
    state.hearts >= 0 &&
    state.hearts <= ARTE_RUIM_HEARTS &&
    state.progress >= 0 &&
    state.progress <= 1 &&
    state.score >= 0 &&
    expectedLetters.length === currentLetters.length &&
    expectedLetters.every((letter, index) => letter === currentLetters[index])
  );
}

/**
 * Retrieves today's Arte Ruim state, restoring it from local storage when
 * it still matches today's answer, or building a fresh state otherwise.
 *
 * @param data - Today's Arte Ruim challenge payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyArteRuimEntry): GameState {
  const defaultState = getDefaultState(data);
  const restoredState = loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: defaultState,
  });

  return isValidState(restoredState, data) ? restoredState : defaultState;
}

/**
 * Runtime guard for the Arte Ruim payload expected by the real game
 * component, useful while the shared screen registry is still typed against
 * placeholder payloads.
 *
 * @param value - Unknown challenge payload received from the registry.
 * @returns Whether the payload satisfies {@link DailyArteRuimEntry}.
 */
export function isDailyArteRuimEntry(
  value: PlaceholderGameData | DailyArteRuimEntry,
): value is DailyArteRuimEntry {
  return (
    value.type === 'arte-ruim' &&
    typeof value.id === 'string' &&
    typeof value.number === 'number' &&
    typeof value.text === 'string' &&
    typeof value.cardId === 'string' &&
    (value.language === 'pt' || value.language === 'en') &&
    Array.isArray(value.drawings) &&
    value.drawings.every((drawing) => typeof drawing === 'string') &&
    Array.isArray(value.dataIds) &&
    value.dataIds.every((dataId) => typeof dataId === 'string')
  );
}

/**
 * Builds the plain-text shareable result for today's Arte Ruim run,
 * reusing the original revealed-letter completion percentage.
 *
 * @param options - Today's challenge number and final run state.
 * @returns The assembled shareable result text.
 */
export function buildShareText({
  challengeNumber,
  hearts,
  revealedLetters,
  totalLetters,
}: {
  challengeNumber: number;
  hearts: number;
  revealedLetters: number;
  totalLetters: number;
}): string {
  const percentage = totalLetters
    ? Math.round((revealedLetters / totalLetters) * 100)
    : 100;

  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts: ARTE_RUIM_HEARTS,
    remainingHearts: hearts,
    heartsSuffix: `(${percentage}%)`,
  });
}
