import { loadLocalToday } from '@hooks/useDailyLocalToday';
import type { ShareResult } from '@utils/shareResults';
import type {
  DailyAlienadoEntry,
  DailyAquiOEntry,
  DailyArteRuimEntry,
  DailyConjuntosEntry,
  DailyEstoquistaEntry,
  DailyFilmacoEntry,
  DailyInvestigacaoEntry,
  DailyMapeamentoEntry,
  DailyOrganikuEntry,
  DailyPalavreadoEntry,
  DailyPanicoEntry,
  DailyPirralhosEntry,
  DailyPortaisEntry,
  DailyQuartetosEntry,
  DailyVitralEntry,
} from 'types/games';
import type { GamesEntries } from 'types/puzzles';
import * as Alienado from './games/Alienado/utils/helpers';
import * as AquiO from './games/AquiO/utils/helpers';
import * as ArteRuim from './games/ArteRuim/utils/helpers';
import * as Conjuntos from './games/Conjuntos/utils/helpers';
import * as Estoquista from './games/Estoquista/utils/helpers';
import * as Filmaco from './games/Filmaco/utils/helpers';
import * as Investigacao from './games/Investigacao/utils/helpers';
import * as Mapeamento from './games/Mapeamento/utils/helpers';
import * as Organiku from './games/Organiku/utils/helpers';
import * as Palavreado from './games/Palavreado/utils/helpers';
import * as Panico from './games/Panico/utils/helpers';
import * as Pirralhos from './games/Pirralhos/utils/helpers';
import * as Portais from './games/Portais/utils/helpers';
import * as Quartetos from './games/Quartetos/utils/helpers';
import * as Vitral from './games/Vitral/utils/helpers';
import { gameInfos } from './index';

/**
 * Ids of every core game wired into the Hub's grouped-share feature (see
 * `buildGroupedShareResult`). Placeholder-only games (`colorido`, `epocas`,
 * `karaoke`) have no `buildShare`/`buildShareFromProgress` yet and are
 * intentionally excluded.
 */
export type GroupedShareGameId = keyof Pick<
  GamesEntries,
  | 'alienado'
  | 'aqui-o'
  | 'arte-ruim'
  | 'conjuntos'
  | 'estoquista'
  | 'filmaco'
  | 'investigacao'
  | 'mapeamento'
  | 'organiku'
  | 'palavreado'
  | 'panico'
  | 'pirralhos'
  | 'portais'
  | 'quartetos'
  | 'vitral'
>;

/**
 * Rebuilds a single game's shareable result purely from its persisted
 * `GameState`, without mounting its engine hook or UI component (so it's
 * safe to call for every game played today without triggering duplicate
 * analytics, timers, or sound effects). Used by the Hub's grouped
 * "Compartilhar Resultados" feature.
 *
 * @param gameId - The game's id, as used in `gameInfos`/`GamesEntries`.
 * @param challenge - Today's challenge payload for that game.
 * @returns The game's `{ title, text, url }` share result, or `null` when
 *   the game isn't wired into the grouped share registry (e.g. the
 *   `colorido`/`epocas`/`karaoke` placeholders) or has no challenge payload.
 */
export function buildGroupedShareResult(
  gameId: string,
  challenge: GamesEntries[keyof GamesEntries],
): ShareResult | null {
  if (!challenge) {
    return null;
  }

  switch (gameId as GroupedShareGameId) {
    case 'alienado': {
      const data = challenge as DailyAlienadoEntry;
      const state = loadLocalToday({
        key: gameInfos.alienado.key,
        dateId: data.id,
        defaultValue: Alienado.getInitialState(data),
      });
      return Alienado.buildShareFromProgress(data, state);
    }
    case 'aqui-o': {
      const data = challenge as DailyAquiOEntry;
      const state = loadLocalToday({
        key: gameInfos['aqui-o'].key,
        dateId: data.id,
        defaultValue: AquiO.getInitialState(data),
      });
      return AquiO.buildShareFromProgress(data, state);
    }
    case 'arte-ruim': {
      const data = challenge as DailyArteRuimEntry;
      const state = loadLocalToday({
        key: gameInfos['arte-ruim'].key,
        dateId: data.id,
        defaultValue: ArteRuim.getInitialState(data),
      });
      return ArteRuim.buildShareFromProgress(data, state);
    }
    case 'conjuntos': {
      const data = challenge as DailyConjuntosEntry;
      const state = loadLocalToday({
        key: gameInfos.conjuntos.key,
        dateId: data.id,
        defaultValue: Conjuntos.getInitialState(data),
      });
      return Conjuntos.buildShareFromProgress(data, state);
    }
    case 'estoquista': {
      const data = challenge as DailyEstoquistaEntry;
      const state = loadLocalToday({
        key: gameInfos.estoquista.key,
        dateId: data.id,
        defaultValue: Estoquista.getInitialState(data),
      });
      return Estoquista.buildShareFromProgress(data, state);
    }
    case 'filmaco': {
      const data = challenge as DailyFilmacoEntry;
      const state = loadLocalToday({
        key: gameInfos.filmaco.key,
        dateId: data.id,
        defaultValue: Filmaco.getInitialState(data),
      });
      return Filmaco.buildShareFromProgress(data, state);
    }
    case 'investigacao': {
      const data = challenge as DailyInvestigacaoEntry;
      const state = loadLocalToday({
        key: gameInfos.investigacao.key,
        dateId: data.id,
        defaultValue: Investigacao.getInitialState(data),
      });
      return Investigacao.buildShareFromProgress(data, state);
    }
    case 'mapeamento': {
      const data = challenge as DailyMapeamentoEntry;
      const state = loadLocalToday({
        key: gameInfos.mapeamento.key,
        dateId: data.id,
        defaultValue: Mapeamento.getInitialState(data),
      });
      return Mapeamento.buildShareFromProgress(data, state);
    }
    case 'organiku': {
      const data = challenge as DailyOrganikuEntry;
      const state = loadLocalToday({
        key: gameInfos.organiku.key,
        dateId: data.id,
        defaultValue: Organiku.getInitialState(data),
      });
      return Organiku.buildShareFromProgress(data, state);
    }
    case 'palavreado': {
      const data = challenge as DailyPalavreadoEntry;
      const state = loadLocalToday({
        key: gameInfos.palavreado.key,
        dateId: data.id,
        defaultValue: Palavreado.getInitialState(data),
      });
      return Palavreado.buildShareFromProgress(data, state);
    }
    case 'panico': {
      const data = challenge as DailyPanicoEntry;
      const state = loadLocalToday({
        key: gameInfos.panico.key,
        dateId: data.id,
        defaultValue: Panico.getInitialState(data),
      });
      return Panico.buildShareFromProgress(data, state);
    }
    case 'pirralhos': {
      const data = challenge as DailyPirralhosEntry;
      const state = loadLocalToday({
        key: gameInfos.pirralhos.key,
        dateId: data.id,
        defaultValue: Pirralhos.getInitialState(data),
      });
      return Pirralhos.buildShareFromProgress(data, state);
    }
    case 'portais': {
      const data = challenge as DailyPortaisEntry;
      const state = loadLocalToday({
        key: gameInfos.portais.key,
        dateId: data.id,
        defaultValue: Portais.getInitialState(data),
      });
      return Portais.buildShareFromProgress(data, state);
    }
    case 'quartetos': {
      const data = challenge as DailyQuartetosEntry;
      const state = loadLocalToday({
        key: gameInfos.quartetos.key,
        dateId: data.id,
        defaultValue: Quartetos.getInitialState(data),
      });
      return Quartetos.buildShareFromProgress(data, state);
    }
    case 'vitral': {
      const data = challenge as DailyVitralEntry;
      const state = loadLocalToday({
        key: gameInfos.vitral.key,
        dateId: data.id,
        defaultValue: Vitral.getInitialState(data),
      });
      return Vitral.buildShareFromProgress(data, state);
    }
    default:
      return null;
  }
}
