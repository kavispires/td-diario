import type { DailyFilmacoEntry } from 'types/games';

/**
 * Builds a locally-generated Filmaco challenge, used while the
 * backend doesn't yet serve this game's daily payload (demo release
 * stage). The sample is fixed and date-independent, since it's only ever
 * shown as a placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `DailyFilmacoEntry`.
 */
export function getFilmacoDemo(): DailyFilmacoEntry {
  return {
    id: '2026-09-26',
    type: 'filmaco',
    number: 849,
    setId: 'df-dms-489-pt-dms-430-pt',
    title: 'Viúva Negra × Shang-Chi e a Lenda dos Dez Anéis',
    itemsIds: ['1748', '2059', '153', '899', '118', '124', '2100', '2151'],
    year: 2021,
    isDoubleFeature: true,
  };
}
