import type { DailyQuartetosEntry } from 'types/games';

/**
 * Builds a locally-generated Quartetos challenge, used while the
 * backend doesn't yet serve this game's daily payload (demo release
 * stage). The sample is fixed and date-independent, since it's only ever
 * shown as a placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `DailyQuartetosEntry`.
 */
export function getQuartetosDemo(): DailyQuartetosEntry {
  return {
    id: '2026-09-26',
    number: 575,
    setId: 'c3099;;14a29;;6ff20;;de671',
    type: 'quartetos',
    grid: [
      '523',
      '2547',
      '2981',
      '2082',
      '474',
      '230',
      '3030',
      '408',
      '1117',
      '1049',
      '3063',
      '815',
      '839',
      '219',
      '3118',
      '389',
    ],
    difficulty: 2,
    sets: [
      {
        id: 'c3099',
        title: 'Guarde aqui!',
        itemsIds: ['523', '408', '839', '815'],
        level: 0,
      },
      {
        id: '6ff20',
        title: 'Gases',
        itemsIds: ['1049', '1117', '3063', '3118'],
        level: 1,
      },
      {
        id: 'de671',
        title: 'Sentimentos e comportamentos*',
        itemsIds: ['2082', '2547', '3030', '2981'],
        level: 2,
      },
      {
        id: '14a29',
        title: 'Vôo',
        itemsIds: ['219', '389', '230', '474'],
        level: 3,
      },
    ],
  };
}
