import type { DailyInvestigacaoEntry } from 'types/games';

/**
 * Builds a locally-generated Investigacao challenge, used while the
 * backend doesn't yet serve this game's daily payload (demo release
 * stage). The sample is fixed and date-independent, since it's only ever
 * shown as a placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `DailyInvestigacaoEntry`.
 */
export function getInvestigacaoDemo(): DailyInvestigacaoEntry {
  return {
    id: '2026-09-26',
    type: 'investigacao',
    number: 449,
    isNsfw: false,
    culpritId: 'us-227',
    statements: [
      {
        key: 'testimony.t-99-pt',
        text: 'O(a) suspeito(a) não assiste a documentários',
        excludes: [
          'us-323',
          'us-157',
          'us-030',
          'us-059',
          'us-181',
          'us-007',
          'us-107',
        ],
        type: 'testimony',
      },
      {
        key: 'not.feature.longHair',
        text: 'O(a) suspeito(a) não tem cabelo longo',
        excludes: ['us-157', 'us-120', 'us-146', 'us-149', 'us-142', 'us-198'],
        type: 'feature',
      },
      {
        key: 'testimony.t-174-pt',
        text: 'O(a) suspeito(a) não é herdeiro(a)',
        excludes: ['us-030', 'us-134'],
        type: 'testimony',
      },
      {
        key: 'not.feature.thin',
        text: 'O(a) suspeito(a) não é magrelo(a)',
        excludes: ['us-323', 'us-007', 'us-120', 'us-146', 'us-198'],
        type: 'feature',
      },
      {
        key: 'testimony.t-225-pt',
        text: 'O(a) suspeito(a) nunca perguntou a seu(sua) parceiro(a): "Se eu fosse uma lesma você me amaria?"',
        excludes: ['us-120', 'us-146', 'us-149', 'us-099', 'us-142'],
        type: 'testimony',
      },
      {
        key: 'not.feature.short',
        text: 'O(a) suspeito(a) não é baixinho(a)',
        excludes: ['us-157', 'us-007', 'us-120', 'us-142', 'us-121'],
        type: 'feature',
      },
      {
        key: 'testimony.t-283-pt',
        text: 'O(a) suspeito(a) nunca chorou com o final de novela',
        excludes: ['us-146', 'us-198', 'us-121'],
        type: 'testimony',
      },
      {
        key: 'not.feature.brownHair',
        text: 'O(a) suspeito(a) não tem cabelo castanho',
        excludes: [
          'us-323',
          'us-007',
          'us-134',
          'us-146',
          'us-099',
          'us-198',
          'us-121',
        ],
        type: 'feature',
      },
    ],
    additionalStatements: [
      {
        key: 'not.grid.corners',
        text: 'O(a) suspeito(a) não está nos cantos',
        excludes: ['us-099', 'us-181', 'us-059', 'us-146'],
        type: 'grid',
      },
      {
        key: 'not.grid.column2',
        text: 'O(a) suspeito(a) não está na segunda coluna',
        excludes: ['us-120', 'us-149', 'us-121', 'us-323'],
        type: 'grid',
      },
      {
        key: 'not.grid.row4',
        text: 'O(a) suspeito(a) não está na quarta linha',
        excludes: ['us-059', 'us-323', 'us-198', 'us-146'],
        type: 'grid',
      },
    ],
    suspects: [
      {
        id: 'us-099',
        name: {
          en: 'Vanessa',
          pt: 'Valesca',
        },
        gender: 'female',
        features: [
          'female',
          'adult',
          'black',
          'medium',
          'muscular',
          'brownHair',
          'shortHair',
        ],
      },
      {
        id: 'us-120',
        name: {
          en: 'Lisa',
          pt: 'Lisa',
        },
        gender: 'female',
        features: [
          'female',
          'young',
          'asian',
          'short',
          'thin',
          'longHair',
          'coloredHair',
        ],
      },
      {
        id: 'us-142',
        name: {
          en: 'Salma',
          pt: 'Suellen',
        },
        gender: 'female',
        features: [
          'female',
          'adult',
          'black',
          'short',
          'average',
          'blackHair',
          'longHair',
        ],
      },
      {
        id: 'us-181',
        name: {
          en: 'Herbert',
          pt: 'Heriberto',
        },
        gender: 'male',
        features: [
          'male',
          'senior',
          'white',
          'tall',
          'average',
          'greyHair',
          'mediumHair',
        ],
      },
      {
        id: 'us-157',
        name: {
          en: 'Erica',
          pt: 'Érica',
        },
        gender: 'female',
        features: [
          'female',
          'adult',
          'white',
          'short',
          'muscular',
          'blondeHair',
          'longHair',
        ],
      },
      {
        id: 'us-149',
        name: {
          en: 'Kaya',
          pt: 'Kala',
        },
        gender: 'female',
        features: [
          'female',
          'adult',
          'indigenous',
          'medium',
          'average',
          'longHair',
          'blackHair',
        ],
      },
      {
        id: 'us-030',
        name: {
          en: 'Hector',
          pt: 'Heitor',
        },
        gender: 'male',
        features: [
          'male',
          'adult',
          'white',
          'tall',
          'average',
          'blondeHair',
          'shortHair',
        ],
      },
      {
        id: 'us-134',
        name: {
          en: 'Tyler',
          pt: 'Tháles',
        },
        gender: 'male',
        features: [
          'male',
          'young',
          'white',
          'medium',
          'muscular',
          'brownHair',
          'shortHair',
        ],
      },
      {
        id: 'us-007',
        name: {
          en: 'Roger',
          pt: 'Rogério',
        },
        gender: 'male',
        features: [
          'male',
          'young',
          'white',
          'short',
          'thin',
          'shortHair',
          'brownHair',
        ],
      },
      {
        id: 'us-121',
        name: {
          en: 'Carmen',
          pt: 'Carmen',
        },
        gender: 'female',
        features: [
          'female',
          'senior',
          'brown',
          'short',
          'large',
          'brownHair',
          'shortHair',
        ],
      },
      {
        id: 'us-227',
        name: {
          en: 'Samuel',
          pt: 'Samuel',
        },
        gender: 'male',
        features: [
          'male',
          'young',
          'black',
          'medium',
          'average',
          'blackHair',
          'shortHair',
        ],
      },
      {
        id: 'us-107',
        name: {
          en: 'Charles',
          pt: 'Clóvis',
        },
        gender: 'male',
        features: [
          'male',
          'senior',
          'white',
          'tall',
          'average',
          'greyHair',
          'mediumHair',
          'blondeHair',
        ],
      },
      {
        id: 'us-059',
        name: {
          en: 'George',
          pt: 'Jorge',
        },
        gender: 'male',
        features: [
          'male',
          'senior',
          'white',
          'medium',
          'large',
          'bald',
          'greyHair',
          'shortHair',
        ],
      },
      {
        id: 'us-323',
        name: {
          en: 'Luke',
          pt: 'Lucas',
        },
        gender: 'male',
        features: [
          'male',
          'adult',
          'white',
          'tall',
          'thin',
          'brownHair',
          'shortHair',
        ],
      },
      {
        id: 'us-198',
        name: {
          en: 'Cecily',
          pt: 'Cecília',
        },
        gender: 'female',
        features: [
          'female',
          'adult',
          'white',
          'medium',
          'thin',
          'longHair',
          'brownHair',
        ],
      },
      {
        id: 'us-146',
        name: {
          en: 'Linda',
          pt: 'Lurdes',
        },
        gender: 'female',
        features: [
          'female',
          'senior',
          'white',
          'medium',
          'thin',
          'brownHair',
          'longHair',
        ],
      },
    ],
    reason: {
      en: 'Created a dating app that only matched enemies.',
      pt: 'Criou um aplicativo de namoro que só combinava inimigos.',
    },
    setId: 'us-227::cr-132::testimony.t-99-pt',
    level: 1,
  };
}
