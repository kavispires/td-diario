import type { DailyPicacoEntry } from 'types/games';

/**
 * Builds a locally-generated Picaco challenge, used while the
 * backend doesn't yet serve this game's daily payload (demo release
 * stage). The sample is fixed and date-independent, since it's only ever
 * shown as a placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `DailyPicacoEntry`.
 */
export function getPicacoDemo(): DailyPicacoEntry {
  return {
    id: '2026-09-26',
    type: 'picaco',
    number: 879,
    cards: [
      {
        id: 'a-907-pt',
        text: 'Estar com a glicose baixa',
        level: 1,
      },
      {
        id: 'a-1283-pt',
        text: 'Pomba lesa',
        level: 2,
      },
      {
        id: 'a-455-pt',
        text: 'Gestão de recursos',
        level: 3,
      },
      {
        id: 'a-1109-pt',
        text: 'Empurrar com a barriga',
        level: 2,
      },
      {
        id: 'a-806-pt',
        text: 'Fora do sério',
        level: 1,
      },
      {
        id: 'a-1521-pt',
        text: 'Lavar a roupa suja',
        level: 1,
      },
      {
        id: 'a-793-pt',
        text: 'Peguete',
        level: 2,
      },
      {
        id: 'a-1026-pt',
        text: 'Greta',
        level: 2,
      },
      {
        id: 'a-27-pt',
        text: 'Bicho do mato',
        level: 1,
      },
      {
        id: 'a-1561-pt',
        text: 'Palerma',
        level: 2,
      },
      {
        id: 'a-1237-pt',
        text: 'É dos carecas que elas gostam mais',
        level: 1,
      },
      {
        id: 'a-606-pt',
        text: 'Chilique',
        level: 3,
      },
      {
        id: 'a-724-pt',
        text: 'Livre, leve e solto',
        level: 2,
      },
      {
        id: 'a-466-pt',
        text: 'Mãe, terminei.',
        level: 3,
      },
      {
        id: 'a-1070-pt',
        text: 'Obviamente esdrúxulo',
        level: 3,
      },
      {
        id: 'a-1504-pt',
        text: 'Pelo que entendi é isso',
        level: 3,
      },
      {
        id: 'a-1281-pt',
        text: 'Torcida organizada',
        level: 2,
      },
      {
        id: 'a-477-pt',
        text: 'Mudança de planos',
        level: 3,
      },
      {
        id: 'a-877-pt',
        text: 'Não fazer mais que a obrigação',
        level: 3,
      },
      {
        id: 'a-1285-pt',
        text: 'Sanguessuga',
        level: 1,
      },
    ],
  };
}
