import type { DailyOrganikuEntry } from 'types/games';

/**
 * Builds a locally-generated Organiku challenge, used while the
 * backend doesn't yet serve this game's daily payload (demo release
 * stage). The sample is fixed and date-independent, since it's only ever
 * shown as a placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `DailyOrganikuEntry`.
 */
export function getOrganikuDemo(): DailyOrganikuEntry {
  return {
    id: '2026-09-26',
    number: 477,
    setId: '5ec02',
    type: 'organiku',
    title: 'Recipientes',
    grid: [
      '577',
      '2488',
      '523',
      '7',
      '685',
      '517',
      '2488',
      '7',
      '517',
      '685',
      '577',
      '523',
      '685',
      '517',
      '7',
      '2488',
      '523',
      '577',
      '523',
      '685',
      '577',
      '517',
      '7',
      '2488',
      '7',
      '523',
      '2488',
      '577',
      '517',
      '685',
      '517',
      '577',
      '685',
      '523',
      '2488',
      '7',
    ],
    defaultRevealedIndexes: [
      1, 3, 5, 9, 12, 14, 16, 18, 20, 22, 24, 26, 30, 31,
    ],
    itemsIds: ['577', '7', '2488', '517', '523', '685'],
  };
}
