import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { ShareResult } from '@utils/shareResults';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyPortaisCorridor, DailyPortaisEntry } from 'types/games';
import { gameInfo } from '../info';
import { DEFAULT_COLUMN_POSITION, DEFAULT_HEARTS } from './constants';
import type { GameState } from './types';

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
  const sanitizedGuesses = data.corridors.map((_, index) =>
    Array.isArray(guesses[index])
      ? guesses[index].filter(
          (guess): guess is string => typeof guess === 'string',
        )
      : [],
  );
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
    guesses: sanitizedGuesses,
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
    progress: getLetterProgress(data.corridors, sanitizedGuesses),
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
 * Counts passcode letters that match their corresponding guess positions.
 *
 * @param passcode Correct corridor passcode.
 * @param guess Submitted passcode guess.
 * @returns Number of correctly matched letters.
 */
export function getCorrectLetterCount(passcode: string, guess: string): number {
  return [...passcode].reduce(
    (count, letter, index) => count + Number(guess[index] === letter),
    0,
  );
}

/**
 * Calculates progress as the share of all corridor passcode letters that
 * are correct in each corridor's latest submitted guess.
 *
 * @param corridors All corridors in today's challenge.
 * @param guesses Submitted guesses grouped by corridor.
 * @returns Progress between zero and one.
 */
export function getLetterProgress(
  corridors: DailyPortaisCorridor[],
  guesses: string[][],
): number {
  const totalLetters = corridors.reduce(
    (total, corridor) => total + [...corridor.passcode].length,
    0,
  );

  if (totalLetters === 0) {
    return 0;
  }

  const correctLetters = corridors.reduce((total, corridor, index) => {
    const corridorGuesses = guesses[index] ?? [];
    const latestGuess = corridorGuesses[corridorGuesses.length - 1] ?? '';
    return total + getCorrectLetterCount(corridor.passcode, latestGuess);
  }, 0);

  return correctLetters / totalLetters;
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
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: getDefaultState(data),
  });

  return sanitizeState(data, storedState);
}

/**
 * Builds the shareable result for today's Portais run directly from the
 * persisted daily payload and stored game progress, without mounting the
 * interactive engine.
 *
 * @param data Today's Portais challenge payload.
 * @param state Persisted Portais progress for today's challenge.
 * @returns The assembled `{ title, text, url }` share result.
 */
export function buildShareFromProgress(
  data: DailyPortaisEntry,
  state: GameState,
): ShareResult {
  return buildShare({
    challengeNumber: data.number,
    guesses: state.guesses,
    win: state.status === GAME_LIFECYCLE_STATUS.WIN,
    hearts: state.hearts,
    moves: state.moves,
    goal: data.goal,
    score: state.score,
  });
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

/**
 * Builds the shareable result for today's Portais run: the
 * standard header/hearts lines plus a single emoji line marking each
 * corridor's misses (💥) and eventual success (🔶).
 *
 * @param options - Today's challenge number and final run state.
 * @returns The assembled `{ title, text, url }` share result.
 */
export function buildShare({
  challengeNumber,
  guesses,
  win,
  hearts,
  moves,
  goal,
  score,
}: {
  challengeNumber: number;
  guesses: string[][];
  win: boolean;
  hearts: number;
  moves: number[];
  goal: number;
  score: number;
}): ShareResult {
  const lastPlayedIndex =
    guesses.filter((guess) => guess.length > 0).length - 1;
  const result = guesses
    .map((guessBatch, index) => {
      const isLastGuessingRound = lastPlayedIndex === index;
      const quantity = Math.max(guessBatch.length, 0);
      const lostLives = Math.max(
        quantity - (isLastGuessingRound ? (win ? 1 : 0) : 1),
        0,
      );
      const lostHearts = Array.from({ length: lostLives }, () => '💥').join('');
      const correct = quantity - lostLives > 0 ? '🔶' : '';

      return `${lostHearts}${correct}`;
    })
    .join('');

  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts: DEFAULT_HEARTS,
    remainingHearts: hearts,
    heartsSuffix: `(${getTotalMoves(moves)}/${goal} movimentos | ${score}pts)`,
    additionalLines: [result],
  });
}
