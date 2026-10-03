import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyPalavreadoEntry } from 'types/games';
import { gameInfo } from '../info';
import type {
  GameState,
  PalavreadoLetter,
  PalavreadoLetterState,
} from './types';

/**
 * Base number of hearts used by Palavreado on regular-sized boards.
 */
export const PALAVREADO_BASE_HEARTS = 4;

/**
 * Points awarded when a whole row word becomes correct for the first time.
 */
export const PALAVREADO_WORD_SCORE = 10;

/**
 * Bonus points awarded per secret scoring word formed in a submission.
 */
export const PALAVREADO_SECRET_WORD_SCORE = 2;

const KEYWORD_INDEXES: Record<number, number[]> = {
  4: [0, 5, 10, 15],
  5: [0, 6, 12, 18, 24],
};

const KEYWORD_STATES: Record<number, PalavreadoLetterState[]> = {
  4: ['0', '1', '2', '3'],
  5: ['0', '1', '2', '3', '4'],
};

/**
 * Returns the total number of hearts for a board size, matching the
 * original game's "at least four, otherwise one per row" rule.
 *
 * @param size - Board side length.
 * @returns The total hearts granted for that size.
 */
export function getTotalHearts(size: number): number {
  return Math.max(PALAVREADO_BASE_HEARTS, size);
}

/**
 * Converts today's flattened board letters into the interactive tile state
 * used by the client, locking the diagonal keyword in place from the start.
 *
 * @param letters - Flattened `size x size` board letters.
 * @param size - Board side length.
 * @returns Parsed board tiles ready for play.
 */
export function parseLetters(
  letters: string[],
  size: number,
): PalavreadoLetter[] {
  const indexes = KEYWORD_INDEXES[size] ?? [];
  const states = KEYWORD_STATES[size] ?? [];

  return letters.map((letter, index) => {
    const keywordIndex = indexes.indexOf(index);
    const locked = keywordIndex >= 0;

    return {
      id: `tile-${index}-${letter}`,
      letter,
      state: locked ? states[keywordIndex] : 'idle',
      locked,
    };
  });
}

/**
 * Builds the default persisted state for a fresh Palavreado day.
 *
 * @param data - Today's Palavreado payload.
 * @returns A fresh default game state.
 */
function getDefaultState(data: DailyPalavreadoEntry): GameState {
  const size = data.keyword.length;

  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: getTotalHearts(size),
    letters: parseLetters(data.letters, size),
    guesses: [],
    swaps: 0,
    usedSmartShuffle: false,
    score: 0,
    progress: 0,
  };
}

/**
 * Retrieves today's Palavreado state from local storage, or creates a fresh
 * one when the stored payload belongs to a previous day or an older shape.
 *
 * @param data - Today's Palavreado payload.
 * @returns The initial state for the engine hook.
 */
export function getInitialState(data: DailyPalavreadoEntry): GameState {
  return loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: getDefaultState(data),
  });
}

/**
 * Splits the flattened board letters into horizontal words.
 *
 * @param letters - Current board tiles.
 * @param size - Board side length.
 * @returns One row word per board row.
 */
export function buildWordsFromLetters(
  letters: PalavreadoLetter[],
  size: number,
): string[] {
  const words: string[] = [];

  for (let start = 0; start < letters.length; start += size) {
    words.push(
      letters
        .slice(start, start + size)
        .map((letter) => letter.letter)
        .join(''),
    );
  }

  return words;
}

/**
 * Counts how many tiles are currently locked in place.
 *
 * @param letters - Current board tiles.
 * @returns The number of locked tiles.
 */
export function countLockedLetters(letters: PalavreadoLetter[]): number {
  return letters.filter((letter) => letter.locked).length;
}

/**
 * Computes progress from `0` to `1`, excluding the pre-filled diagonal
 * letters so the game starts at zero progress.
 *
 * @param letters - Current board tiles.
 * @param size - Board side length.
 * @returns The normalized completion progress.
 */
export function calculateProgress(
  letters: PalavreadoLetter[],
  size: number,
): number {
  const lockedLetters = countLockedLetters(letters);
  const initiallyLocked = size;
  const solvableLetters = letters.length - initiallyLocked;

  if (solvableLetters <= 0) {
    return 1;
  }

  return (lockedLetters - initiallyLocked) / solvableLetters;
}

/**
 * Returns a copy of the board with two tile positions swapped.
 *
 * @param letters - Current board tiles.
 * @param indexA - First tile index.
 * @param indexB - Second tile index.
 * @returns A new letters array with the two positions exchanged.
 */
export function swapLetterPositions(
  letters: PalavreadoLetter[],
  indexA: number,
  indexB: number,
): PalavreadoLetter[] {
  const nextLetters = letters.map((letter) => ({ ...letter }));
  [nextLetters[indexA], nextLetters[indexB]] = [
    nextLetters[indexB],
    nextLetters[indexA],
  ];
  return nextLetters;
}

/**
 * Removes accents from a string so vowels/consonants can be classified
 * consistently for smart shuffle.
 *
 * @param value - Source text.
 * @returns The text without diacritics.
 */
function removeAccents(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Checks whether a letter is a vowel, including accented Portuguese vowels.
 *
 * @param letter - Letter to classify.
 * @returns Whether the letter is a vowel.
 */
function isVowel(letter: string): boolean {
  return 'aeiou'.includes(removeAccents(letter).toLowerCase());
}

/**
 * Checks whether a letter is a consonant.
 *
 * @param letter - Letter to classify.
 * @returns Whether the letter is a consonant.
 */
function isConsonant(letter: string): boolean {
  const normalized = removeAccents(letter).toLowerCase();
  return /^[a-z]$/.test(normalized) && !isVowel(letter);
}

/**
 * Performs an in-place Fisher-Yates shuffle on a copy of an array.
 *
 * @param values - Values to shuffle.
 * @returns A shuffled copy of `values`.
 */
function shuffleValues<T>(values: T[]): T[] {
  const copy = [...values];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

/**
 * Intelligently shuffles only the incorrect, unlocked letters, swapping
 * vowels with vowels and consonants with consonants while avoiding
 * positions already tried for each letter when possible.
 *
 * @param letters - Current board tiles.
 * @param guesses - Submitted guesses history.
 * @param size - Board side length.
 * @returns A new letters array after the smart shuffle.
 */
export function smartShuffle(
  letters: PalavreadoLetter[],
  guesses: string[][],
  size: number,
): PalavreadoLetter[] {
  const nextLetters = letters.map((letter) => ({ ...letter }));
  const unlockedLetters = nextLetters
    .map((letter, index) => ({ letter, index }))
    .filter(({ letter }) => !letter.locked);

  if (unlockedLetters.length <= 1) {
    return nextLetters;
  }

  const previouslyGuessed = new Map<string, Set<number>>();

  for (const attempt of guesses) {
    attempt.forEach((word, rowIndex) => {
      word.split('').forEach((character, characterIndex) => {
        const globalIndex = rowIndex * size + characterIndex;
        const guessedIndexes = previouslyGuessed.get(character) ?? new Set();
        guessedIndexes.add(globalIndex);
        previouslyGuessed.set(character, guessedIndexes);
      });
    });
  }

  const vowelIndexes: number[] = [];
  const consonantIndexes: number[] = [];

  for (const { letter, index } of unlockedLetters) {
    if (isVowel(letter.letter)) {
      vowelIndexes.push(index);
      continue;
    }

    if (isConsonant(letter.letter)) {
      consonantIndexes.push(index);
    }
  }

  const isValidSwap = (letter: string, targetIndex: number) =>
    !previouslyGuessed.get(letter)?.has(targetIndex);

  const shuffleGroup = (indices: number[]) => {
    if (indices.length <= 1) {
      return;
    }

    const shuffledIndices = shuffleValues(indices);
    const letterValues = indices.map((index) => nextLetters[index].letter);

    for (let index = 0; index < indices.length; index += 1) {
      const originalIndex = indices[index];
      let targetIndex = shuffledIndices[index];

      if (
        targetIndex === originalIndex ||
        !isValidSwap(letterValues[index], targetIndex)
      ) {
        const alternativeIndex = shuffledIndices.findIndex(
          (candidate, candidateIndex) =>
            candidateIndex !== index &&
            candidate !== originalIndex &&
            isValidSwap(letterValues[index], candidate),
        );

        if (alternativeIndex >= 0) {
          [shuffledIndices[index], shuffledIndices[alternativeIndex]] = [
            shuffledIndices[alternativeIndex],
            shuffledIndices[index],
          ];
          targetIndex = shuffledIndices[index];
        } else {
          targetIndex = originalIndex;
        }
      }

      nextLetters[targetIndex] = {
        ...nextLetters[targetIndex],
        letter: letterValues[index],
      };
    }
  };

  shuffleGroup(vowelIndexes);
  shuffleGroup(consonantIndexes);

  return nextLetters;
}

/**
 * Builds the plain-text shareable result for today's Palavreado run.
 *
 * @param options - Today's challenge number and final guess history.
 * @returns The assembled shareable result text.
 */
export function buildShareText({
  challengeNumber,
  hearts,
  swaps,
  guesses,
  words,
  usedSmartShuffle = false,
  score,
}: {
  challengeNumber: number;
  hearts: number;
  swaps: number;
  guesses: string[][];
  words: string[];
  usedSmartShuffle?: boolean;
  score: number;
}): string {
  const size = guesses[0].length;
  const colors = ['🟥', '🟦', '🟪', '🟫', '🟧'];
  const cleanUpAttempts = guesses.map((attempt) =>
    attempt.map((word, index) =>
      words[index].toLowerCase() === word.toLowerCase() ? colors[index] : '⬜️',
    ),
  );

  if (cleanUpAttempts.length < size) {
    while (cleanUpAttempts.length < size) {
      cleanUpAttempts.push(cleanUpAttempts[cleanUpAttempts.length - 1]);
    }
  }

  const hintIndicator = usedSmartShuffle ? ' 💡' : '';

  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts: getTotalHearts(words.length),
    remainingHearts: hearts,
    heartsSuffix: `${score} pts | ${swaps} trocas${hintIndicator}`,
    heartsSpacing: ' ',
    additionalLines: cleanUpAttempts
      .map((row) => row.join(' ').trim())
      .filter(Boolean),
  });
}
