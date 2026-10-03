import type { PalavreadoLetterState } from './types';

/**
 * Base number of hearts Palavreado grants on smaller boards.
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

/**
 * Diagonal board indexes that start locked for each supported board size.
 */
export const KEYWORD_INDEXES: Record<number, readonly number[]> = {
  4: [0, 5, 10, 15],
  5: [0, 6, 12, 18, 24],
};

/**
 * Letter-state labels assigned to the diagonal keyword tiles per board size.
 */
export const KEYWORD_STATES: Record<number, readonly PalavreadoLetterState[]> =
  {
    4: ['0', '1', '2', '3'],
    5: ['0', '1', '2', '3', '4'],
  };

/**
 * Background and border classes used by board tiles for each solved row tone.
 */
export const TILE_TONE_CLASSES = {
  idle: 'bg-white/85 text-foreground border-border-strong',
  '0': 'bg-red-500 text-white border-red-400',
  '1': 'bg-blue-500 text-white border-blue-400',
  '2': 'bg-purple-500 text-white border-purple-400',
  '3': 'bg-amber-700 text-white border-amber-600',
  '4': 'bg-orange-500 text-white border-orange-400',
} as const;

/**
 * Badge classes used to color Palavreado words by their row position.
 */
export const WORD_TONE_CLASSES = [
  'bg-red-500 text-white',
  'bg-blue-500 text-white',
  'bg-purple-500 text-white',
  'bg-amber-700 text-white',
  'bg-orange-500 text-white',
] as const;

/**
 * Emoji squares used to represent each Palavreado row in shared results.
 */
export const SHARE_RESULT_COLORS = ['🟥', '🟦', '🟪', '🟫', '🟧'] as const;
