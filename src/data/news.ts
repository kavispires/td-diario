import type { NewsEntry } from 'types/news';

/**
 * Hand-written history of user-facing changes to TD Diário's games: new
 * games/contributions added, and later changes to how a game plays or
 * behaves. Internal-only changes (styling, refactors, infra) never belong
 * here — only things a player would notice and care about.
 *
 * Order doesn't matter; entries are sorted by `getVisibleNewsEntries`.
 */
export const NEWS_ENTRIES: NewsEntry[] = [
  // --- Launches, oldest first ---
  {
    date: '2023-11-04',
    type: 'new-game',
    gameId: 'arte-ruim',
    description: 'Adivinhe o título de obras de arte estranhas demais!',
  },
  {
    date: '2024-04-30',
    type: 'new-game',
    gameId: 'aqui-o',
    description: 'Encontre a coisa em comum entre os itens da tela!',
  },
  {
    date: '2024-04-30',
    type: 'new-contribution',
    gameId: 'picaco',
    description: 'Desenhe frases enviadas por outros jogadores!',
  },
  {
    date: '2024-05-10',
    type: 'new-game',
    gameId: 'palavreado',
    description: 'Um caça-palavras com as letras todas embaralhadas!',
  },
  {
    date: '2024-05-30',
    type: 'new-game',
    gameId: 'filmaco',
    description: 'Pegue a pipoca e descubra o filme pelas pistas!',
  },
  {
    date: '2024-08-04',
    type: 'new-game',
    gameId: 'estoquista',
    description: 'Organize a prateleira do jeitinho que o cliente pediu!',
  },
  {
    date: '2024-08-31',
    type: 'new-game',
    gameId: 'conjuntos',
    description: 'Monte diagramas e descubra o que têm em comum!',
  },
  {
    date: '2024-11-08',
    type: 'new-game',
    gameId: 'alienado',
    description: 'Aprenda a se comunicar com um alienígena confuso!',
  },
  {
    date: '2025-02-21',
    type: 'new-contribution',
    gameId: 'ta-na-cara',
    description: 'Julgue pessoas pela cara! O cara pela cara!',
  },
  {
    date: '2025-03-01',
    type: 'new-game',
    gameId: 'quartetos',
    description: 'Conecte quatro palavras relacionadas em cada grupo!',
  },
  {
    date: '2025-04-12',
    type: 'new-game',
    gameId: 'portais',
    description: 'Abra os portais resolvendo as palavras-chave!',
  },
  {
    date: '2025-06-07',
    type: 'new-game',
    gameId: 'organiku',
    description: 'Será que você consegue organizar a mesa direitinho?',
  },
  {
    date: '2025-07-05',
    type: 'new-game',
    gameId: 'investigacao',
    description: 'Descubra quem é o culpado entre os suspeitos!',
  },
  {
    date: '2025-12-24',
    type: 'new-game',
    gameId: 'vitral',
    description: 'Já quebrou a cabeça hoje com esse quebra-cabeça?',
  },
  // {
  //   date: '2026-04-04',
  //   type: 'new-contribution',
  //   gameId: 'conexoes',
  //   description: 'Ajude a avaliar se pares de imagens estão relacionados!',
  // },
  {
    date: '2026-05-17',
    type: 'new-game',
    gameId: 'mapeamento',
    description: 'Onde você está? Adivinhe o lugar pelas pistas!',
  },
  {
    date: '2026-05-24',
    type: 'new-game',
    gameId: 'pirralhos',
    description: 'Descubra qual criança pegou o brinquedo escondido!',
  },
  // {
  //   date: '2026-10-04',
  //   type: 'new-game',
  //   gameId: 'colorido',
  //   description: 'Combine as cores e deixe tudo com a sua cara!',
  // },
  // {
  //   date: '2026-10-04',
  //   type: 'new-game',
  //   gameId: 'epocas',
  //   description: 'Viaje no tempo e adivinhe a época de cada coisa!',
  // },
  // {
  //   date: '2026-10-04',
  //   type: 'new-game',
  //   gameId: 'karaoke',
  //   description: 'Qual é a música? Cante junto e descubra!',
  // },
  {
    date: '2026-10-18',
    type: 'new-contribution',
    gameId: 'ideias',
    description: 'Sugira conteúdos novos para os jogos do TD Diário!',
  },
  {
    date: '2026-10-25',
    type: 'new-game',
    gameId: 'panico',
    description:
      'Você apertaria o botão? Quantas vezes? Siga as regras da sequência de botões e tente chegar ao final!',
  },

  // --- Features / announcements ---
  {
    date: '2026-10-17',
    type: 'feature',
    description:
      'O TD Diário tem novo visual com interface mais moderna e intuitiva. Você pode ver o progresso dos seus jogos e contribuições de forma mais clara. E todos os jogos contam pontos para você saber se foi melhor que seus amigos.',
  },
];
