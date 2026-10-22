import type { DailyAlienadoEntry } from 'types/games';

/**
 * Builds a locally-generated Alienado challenge, used while the
 * backend doesn't yet serve this game's daily payload (demo release
 * stage). The sample is fixed and date-independent, since it's only ever
 * shown as a placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `DailyAlienadoEntry`.
 */
export function getAlienadoDemo(): DailyAlienadoEntry {
  return {
    id: '2026-09-26',
    number: 687,
    type: 'alienado',
    setId: 'ins-rou-wri',
    attributes: [
      {
        id: 'wri',
        name: 'Escrita',
        description: 'texto, letras ou símbolos usados para comunicação',
        spriteId: '38',
        itemsIds: ['2507', '287', '3218'],
      },
      {
        id: 'ins',
        name: 'Instrumento',
        description:
          'utensílio, equipamento, precisão, medição, musical, artístico',
        spriteId: '28',
        itemsIds: ['932', '1255', '871'],
      },
      {
        id: 'rou',
        name: 'Redondo',
        description: 'circular, esfera, oval',
        spriteId: '35',
        itemsIds: ['621', '1937', '3278'],
      },
    ],
    requests: [
      {
        spritesIds: ['38', '35'],
        itemId: '134',
      },
      {
        spritesIds: ['38', '28'],
        itemId: '1393',
      },
      {
        spritesIds: ['28', '35'],
        itemId: '855',
      },
      {
        spritesIds: ['38', '28', '35'],
        itemId: '138',
      },
    ],
    solution: '134-1393-855-138',
    itemsIds: ['1825', '1393', '134', '210', '138', '855'],
  };
}
