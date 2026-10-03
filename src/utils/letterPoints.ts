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
