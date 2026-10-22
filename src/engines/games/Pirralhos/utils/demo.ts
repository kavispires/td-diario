import type { DailyPirralhosEntry } from 'types/games';

/**
 * Builds a locally-generated Pirralhos challenge, used while the
 * backend doesn't yet serve this game's daily payload (demo release
 * stage). The sample is fixed and date-independent, since it's only ever
 * shown as a placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `DailyPirralhosEntry`.
 */
export function getPirralhosDemo(): DailyPirralhosEntry {
  return {
    id: '2026-09-26',
    number: 126,
    type: 'pirralhos',
    hashId:
      'MjM1LDIzNCwyMzgsMjM2LDIzMywyMzJ8MXw0fDR8MywyMzYtNC0xMS01LTgtNywxMDQ=',
    kids: [
      {
        kidId: 'us-gb-235',
        statement: {
          en: 'Alice or I did it',
          pt: 'Foi a Alice ou eu ',
        },
      },
      {
        kidId: 'us-gb-234',
        statement: {
          en: 'A boy did it',
          pt: 'Foi um menino',
        },
      },
      {
        kidId: 'us-gb-238',
        statement: {
          en: "I didn't do it!",
          pt: 'Não fui eu!',
        },
      },
      {
        kidId: 'us-gb-236',
        statement: {
          en: 'A girl did it',
          pt: 'Foi uma menina',
        },
      },
      {
        kidId: 'us-gb-233',
        statement: {
          en: 'Someone next to me did it',
          pt: 'Foi alguém do meu lado',
        },
      },
      {
        kidId: 'us-gb-232',
        statement: {
          en: 'Someone shorter than 104 cm did it',
          pt: 'Foi alguém menor que 104 cm',
        },
      },
    ],
    culpritId: 'us-gb-233',
    liarsIds: ['us-gb-235', 'us-gb-236', 'us-gb-233', 'us-gb-232'],
    possibleLiars: 4,
    difficulty: 55,
  };
}
