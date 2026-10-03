/**
 * Removes accents and normalizes a guessed character to lowercase so a
 * keyboard can match accented prompt text with plain latin letters.
 *
 * @param character - Raw character from the prompt or keyboard.
 * @returns The normalized character.
 */
export function normalizeCharacter(character: string): string {
  return character
    .normalize('NFD')
    .replaceAll(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/**
 * Determines whether a prompt character should be guessed, for games where
 * the player reveals a word or phrase letter by letter.
 *
 * @param character - Raw character from the prompt text.
 * @param allowNumbers - Whether digits should count as guessable too.
 * @returns Whether the character belongs to the guessable alphabet.
 */
export function isGuessableCharacter(
  character: string,
  allowNumbers = false,
): boolean {
  const normalizedCharacter = normalizeCharacter(character);
  return allowNumbers
    ? /^[a-z0-9]$/i.test(normalizedCharacter)
    : /^[a-z]$/i.test(normalizedCharacter);
}

/**
 * Extracts the normalized set of unique letters/digits present in a prompt's
 * text, initializing each one as not yet discovered.
 *
 * @param text - Prompt text shown in today's challenge.
 * @param allowNumbers - Whether digits should count as guessable too.
 * @returns A normalized solution map keyed by unique character.
 */
export function getLettersInWord(
  text: string,
  allowNumbers = false,
): Dictionary<boolean> {
  const lettersInWord: Dictionary<boolean> = {};

  for (const character of text) {
    if (!isGuessableCharacter(character, allowNumbers)) {
      continue;
    }

    lettersInWord[normalizeCharacter(character)] = false;
  }

  return lettersInWord;
}

/**
 * Counts how many unique solution characters have already been discovered.
 *
 * @param solution - Normalized solution map for today's prompt.
 * @returns Number of unique letters/digits marked as solved.
 */
export function countSolvedLetters(solution: Dictionary<boolean>): number {
  return Object.values(solution).filter(Boolean).length;
}

/**
 * Counts how many unique guessable characters today's prompt contains.
 *
 * @param solution - Normalized solution map for today's prompt.
 * @returns Total number of unique letters/digits the player must discover.
 */
export function countTotalLetters(solution: Dictionary<boolean>): number {
  return Object.keys(solution).length;
}

/**
 * Counts every guessable character occurrence in a prompt's text, including
 * repeats (e.g. a title with three `"a"`s counts as three, not one), used
 * to compute letter-guessing games' letter-by-letter progress.
 *
 * @param text - Prompt text shown in today's challenge.
 * @param allowNumbers - Whether digits should count as guessable too.
 * @returns Total number of guessable character occurrences in `text`.
 */
export function countTotalLetterOccurrences(
  text: string,
  allowNumbers = false,
): number {
  let total = 0;

  for (const character of text) {
    if (isGuessableCharacter(character, allowNumbers)) {
      total += 1;
    }
  }

  return total;
}

/**
 * Counts how many guessable character occurrences in a prompt's text have
 * already been solved, including repeats of the same letter/digit.
 *
 * @param text - Prompt text shown in today's challenge.
 * @param solution - Normalized solution map for today's prompt.
 * @param allowNumbers - Whether digits should count as guessable too.
 * @returns Number of solved character occurrences in `text`.
 */
export function countSolvedLetterOccurrences(
  text: string,
  solution: Dictionary<boolean>,
  allowNumbers = false,
): number {
  let solved = 0;

  for (const character of text) {
    if (
      isGuessableCharacter(character, allowNumbers) &&
      solution[normalizeCharacter(character)]
    ) {
      solved += 1;
    }
  }

  return solved;
}

/**
 * Point value awarded for guessing a given keyboard letter or digit,
 * shared by letter-guessing games (e.g. Filmaco, Arte Ruim) for both
 * scoring and the point-indicator dots rendered on their keyboards.
 * Rarer characters are worth more points.
 */
export const LETTER_POINTS: Record<string, 1 | 2 | 3> = {
  a: 1,
  e: 1,
  o: 1,
  s: 1,
  r: 1,
  i: 1,
  n: 1,
  d: 1,
  m: 1,
  t: 1,
  u: 1,
  '0': 1,
  '1': 1,
  '2': 1,
  c: 2,
  l: 2,
  p: 2,
  v: 2,
  g: 2,
  b: 2,
  f: 2,
  h: 2,
  '3': 2,
  '4': 2,
  '5': 2,
  q: 3,
  j: 3,
  z: 3,
  x: 3,
  k: 3,
  w: 3,
  y: 3,
  '6': 3,
  '7': 3,
  '8': 3,
  '9': 3,
} as const;

/**
 * Looks up the point value for a given letter or digit.
 *
 * @param key The lowercase letter or digit to look up.
 * @returns The key's point value, or `1` if it isn't mapped.
 */
export function getLetterPoints(key: string): 1 | 2 | 3 {
  return LETTER_POINTS[key.toLowerCase()] ?? 1;
}
