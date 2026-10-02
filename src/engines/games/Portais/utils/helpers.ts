import {
  gameIdToLocalTodayKey,
  loadLocalToday,
} from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { DailyPortaisCorridor, DailyPortaisEntry } from 'types/games';
import { gameInfo } from '../info';
import type { GameState } from './types';

const DEFAULT_HEARTS = 4;
const DEFAULT_COLUMN_POSITION = 1;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getStartingColumnPosition(wordLength: number): number {
  return wordLength > 1 ? DEFAULT_COLUMN_POSITION : 0;
}

function getDefaultState(data: DailyPortaisEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: DEFAULT_HEARTS,
    guesses: data.corridors.map(() => []),
    currentCorridorIndex: 0,
    currentCorridorIndexes: getStartingCorridorIndexes(data.corridors[0]),
    moves: data.corridors.map(() => 0),
    score: 0,
    progress: 0,
  };
}

function sanitizeState(data: DailyPortaisEntry, state: GameState): GameState {
  const maxCorridorIndex = Math.max(data.corridors.length - 1, 0);
  const currentCorridorIndex = clamp(
    state.currentCorridorIndex,
    0,
    maxCorridorIndex,
  );
  const currentCorridor = data.corridors[currentCorridorIndex];
  const fallbackIndexes = getStartingCorridorIndexes(currentCorridor);
  const validStatuses = Object.values(GAME_LIFECYCLE_STATUS);
  const guesses = Array.isArray(state.guesses) ? state.guesses : [];
  const moves = Array.isArray(state.moves) ? state.moves : [];
  const currentCorridorIndexes = Array.isArray(state.currentCorridorIndexes)
    ? state.currentCorridorIndexes
    : [];

  return {
    ...state,
    status: validStatuses.includes(state.status)
      ? state.status
      : GAME_LIFECYCLE_STATUS.IDLE,
    hearts: clamp(state.hearts, 0, DEFAULT_HEARTS),
    guesses: data.corridors.map((_, index) =>
      Array.isArray(guesses[index])
        ? guesses[index].filter(
            (guess): guess is string => typeof guess === 'string',
          )
        : [],
    ),
    currentCorridorIndex,
    currentCorridorIndexes: fallbackIndexes.map((fallbackIndex, index) => {
      const wordLength = currentCorridor?.words[index]?.length ?? 0;
      const storedIndex = currentCorridorIndexes[index];

      if (typeof storedIndex !== 'number') {
        return fallbackIndex;
      }

      return clamp(storedIndex, 0, Math.max(wordLength - 1, 0));
    }),
    moves: data.corridors.map((_, index) => {
      const moveCount = moves[index];
      return typeof moveCount === 'number' && moveCount > 0 ? moveCount : 0;
    }),
    score: Math.max(state.score, 0),
    progress: clamp(state.progress, 0, 1),
  };
}

/**
 * Builds the starting column positions for a corridor, matching the
 * original game's behavior of opening each three-letter word on its middle
 * letter.
 *
 * @param corridor Corridor whose word columns should be initialized.
 * @returns One selected position per word column.
 */
export function getStartingCorridorIndexes(
  corridor: DailyPortaisCorridor | undefined,
): number[] {
  return (
    corridor?.words.map((word) => getStartingColumnPosition(word.length)) ?? []
  );
}

/**
 * Computes the currently selected guess for a corridor from its rotating
 * word columns and selected positions.
 *
 * @param corridor Corridor whose guess should be read.
 * @param currentCorridorIndexes Selected position for each word column.
 * @returns The assembled guess string.
 */
export function getCurrentGuess(
  corridor: DailyPortaisCorridor,
  currentCorridorIndexes: number[],
): string {
  return corridor.words
    .map((word, index) => {
      const fallbackIndex = getStartingColumnPosition(word.length);
      const position = currentCorridorIndexes[index] ?? fallbackIndex;
      const letterIndex = clamp(word.length - 1 - position, 0, word.length - 1);
      return word[letterIndex] ?? '';
    })
    .join('');
}

/**
 * Retrieves today's Portais state, restoring it from local storage when it
 * matches today's challenge id, or building a fresh state otherwise.
 *
 * @param data Today's Portais challenge payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyPortaisEntry): GameState {
  const storedState = loadLocalToday<GameState>({
    key: gameIdToLocalTodayKey(gameInfo.id),
    dateId: data.id,
    defaultValue: getDefaultState(data),
  });

  return sanitizeState(data, storedState);
}

/**
 * Sums the recorded move counts for every corridor.
 *
 * @param moves Per-corridor move counters.
 * @returns The total number of moves made in the run.
 */
export function getTotalMoves(moves: number[]): number {
  return moves.reduce((total, moveCount) => total + moveCount, 0);
}
