import type { DailyPortaisEntry } from 'types/games';

/**
 * Builds a locally-generated Portais challenge, used while the
 * backend doesn't yet serve this game's daily payload (demo release
 * stage). The sample is fixed and date-independent, since it's only ever
 * shown as a placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `DailyPortaisEntry`.
 */
export function getPortaisDemo(): DailyPortaisEntry {
  return {
    id: '2026-09-26',
    type: 'portais',
    setId: '4b09b;;1e4ab;;fd3a1',
    number: 533,
    corridors: [
      {
        passcode: 'artrópode',
        imagesIds: ['td-d9-168', 'td-d10-211', 'td-d5-183'],
        words: ['eca', 'pré', 'ata', 'rim', 'pós', 'pus', 'elo', 'daí', 'ave'],
        goal: 9,
      },
      {
        passcode: 'pressão',
        imagesIds: ['td-d8-108', 'td-d1-171'],
        words: ['par', 'pró', 'exu', 'ser', 'mas', 'imã', 'são'],
        goal: 9,
      },
      {
        passcode: 'rio',
        imagesIds: ['td-d1-174'],
        words: ['réu', 'dia', 'pão'],
        goal: 3,
      },
    ],
    goal: 21,
  };
}
