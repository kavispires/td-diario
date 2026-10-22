import type { DailyConjuntosEntry } from 'types/games';

/**
 * Builds a locally-generated Conjuntos challenge, used while the
 * backend doesn't yet serve this game's daily payload (demo release
 * stage). The sample is fixed and date-independent, since it's only ever
 * shown as a placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `DailyConjuntosEntry`.
 */
export function getConjuntosDemo(): DailyConjuntosEntry {
  return {
    id: '2026-09-26',
    number: 756,
    type: 'conjuntos',
    title: 'Contagem vs Inicialização',
    level: 1,
    setId: 'conjuntos',
    rule1: {
      id: 'ddr-9-pt',
      text: 'tem 5 letras',
      level: 1,
      thing: {
        id: '199',
        name: 'chave',
      },
    },
    rule2: {
      id: 'ddr-25-pt',
      text: 'começa com uma vogal',
      level: 1,
      thing: {
        id: '2245',
        name: 'Ásia',
      },
    },
    intersectingThing: {
      id: '1489',
      name: 'Oui-já!',
    },
    things: [
      {
        id: '847',
        name: 'conga',
        rule: 1,
      },
      {
        id: '915',
        name: 'berço',
        rule: 1,
      },
      {
        id: '867',
        name: 'ornitorrinco',
        rule: 2,
      },
      {
        id: '144',
        name: 'usina',
        rule: 0,
      },
      {
        id: '3018',
        name: 'adega',
        rule: 0,
      },
      {
        id: '1586',
        name: 'óvulo',
        rule: 0,
      },
      {
        id: '2894',
        name: 'autoconsciência',
        rule: 2,
      },
      {
        id: '1838',
        name: 'oficina',
        rule: 2,
      },
      {
        id: '26',
        name: 'skate',
        rule: 1,
      },
      {
        id: '223',
        name: 'idosa',
        rule: 0,
      },
    ],
  };
}
