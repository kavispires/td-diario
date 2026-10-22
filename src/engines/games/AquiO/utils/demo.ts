import type { DailyAquiOEntry } from 'types/games';

/**
 * Builds a locally-generated AquiO challenge, used while the
 * backend doesn't yet serve this game's daily payload (demo release
 * stage). The sample is fixed and date-independent, since it's only ever
 * shown as a placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `DailyAquiOEntry`.
 */
export function getAquiODemo(): DailyAquiOEntry {
  return {
    id: '2026-09-26',
    type: 'aqui-o',
    number: 879,
    setId: 'special',
    title: {
      pt: 'Especial Fim de Semana',
      en: 'Weekend Special',
    },
    itemsIds: [
      '0',
      '1593',
      '1358',
      '1972',
      '55',
      '1432',
      '3003',
      '1085',
      '1212',
      '379',
      '1751',
      '1270',
      '2836',
      '1702',
      '1917',
      '1046',
      '762',
      '458',
      '783',
      '2774',
      '2564',
      '793',
      '753',
      '165',
      '1827',
      '2037',
      '3141',
      '1932',
      '2254',
      '729',
      '2767',
      '2290',
      '530',
      '1233',
      '1217',
      '1021',
    ],
  };
}
