import { gameInfo as arteRuimInfo } from '@engines/games/ArteRuim/info';
import { gameInfo as epocasInfo } from '@engines/games/Epocas/info';
import { gameInfo as filmacoInfo } from '@engines/games/Filmaco/info';
import { gameInfo as investigacaoInfo } from '@engines/games/Investigacao/info';
import { gameInfo as karaokeInfo } from '@engines/games/Karaoke/info';
import { gameInfo as mapeamentoInfo } from '@engines/games/Mapeamento/info';
import { gameInfo as quartetosInfo } from '@engines/games/Quartetos/info';
import type { IdeaCategory } from './types';

/**
 * Display metadata for one idea category shown on the category picker.
 */
export type IdeaCategoryOption = {
  /**
   * Category id, matching {@link IdeaCategory}.
   */
  id: IdeaCategory;
  /**
   * Emoji shown next to the category label, used as a fallback when there
   * is no associated game logo (e.g. the `general` category).
   */
  emoji: string;
  /**
   * Id of the game this category is tied to, used to render its real logo
   * via {@link GameLogos} instead of the emoji. `undefined` for categories
   * with no associated game (e.g. `general`).
   */
  gameId?: string;
  /**
   * Category label shown on the picker.
   */
  label: string;
  /**
   * Short description of what kind of idea is expected for this category.
   */
  description: string;
};

/**
 * Minimum number of items required for a Quartetos idea submission.
 */
export const QUARTETOS_MINIMUM_ITEMS = 4;

/**
 * Every idea category offered on the picker, in display order. Game-tied
 * categories reuse each game's real emoji/name so the picker matches the
 * hub, with a catch-all `general` category at the end.
 */
export const IDEA_CATEGORIES: IdeaCategoryOption[] = [
  {
    id: 'arte-ruim',
    emoji: arteRuimInfo.emoji,
    gameId: arteRuimInfo.id,
    label: arteRuimInfo.name.pt,
    description: 'Uma expressão para os jogadores desenharem.',
  },
  {
    id: 'filmaco',
    emoji: filmacoInfo.emoji,
    gameId: filmacoInfo.id,
    label: filmacoInfo.name.pt,
    description: 'Um filme para virar charada.',
  },
  {
    id: 'investigacao',
    emoji: investigacaoInfo.emoji,
    gameId: investigacaoInfo.id,
    label: investigacaoInfo.name.pt,
    description: 'Uma pergunta de depoimento.',
  },
  {
    id: 'mapeamento',
    emoji: mapeamentoInfo.emoji,
    gameId: mapeamentoInfo.id,
    label: mapeamentoInfo.name.pt,
    description: 'Um local para ser mapeado.',
  },
  {
    id: 'quartetos',
    emoji: quartetosInfo.emoji,
    gameId: quartetosInfo.id,
    label: quartetosInfo.name.pt,
    description: 'Um grupo de 4 ou mais itens com um tema em comum.',
  },
  {
    id: 'karaoke',
    emoji: karaokeInfo.emoji,
    gameId: karaokeInfo.id,
    label: karaokeInfo.name.pt,
    description: 'Uma música, com artista e um trecho da letra.',
  },
  {
    id: 'epocas',
    emoji: epocasInfo.emoji,
    gameId: epocasInfo.id,
    label: epocasInfo.name.pt,
    description: 'Um acontecimento histórico, com o ano.',
  },
  {
    id: 'general',
    emoji: '💬',
    label: 'Ideia geral',
    description: 'Uma ideia ou feedback sobre o TD Diário.',
  },
];
