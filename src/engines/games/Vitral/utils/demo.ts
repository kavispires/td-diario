import type { DailyVitralEntry } from 'types/games';

/**
 * Builds a locally-generated Vitral challenge, used while the
 * backend doesn't yet serve this game's daily payload (demo release
 * stage). The sample is fixed and date-independent, since it's only ever
 * shown as a placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `DailyVitralEntry`.
 */
export function getVitralDemo(): DailyVitralEntry {
  return {
    id: '2026-09-26',
    number: 276,
    type: 'vitral',
    title: 'A Escadaria dos Ossos',
    cardId: 'td-d14-202',
    pieces: [
      20, 14, 13, 6, 10, 8, 22, 11, 26, 15, 30, 25, 23, 27, 21, 4, 17, 0, 2, 31,
      29, 16, 18, 24, 7, 19, 28, 32, 1, 3, 12, 5, 9,
    ],
    cardsIds: ['td-d14-201', 'td-d14-202', 'td-d14-203'],
  };
}
