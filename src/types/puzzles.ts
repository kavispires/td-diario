import type { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type {
  DailyAlienadoEntry,
  DailyAquiOEntry,
  DailyArteRuimEntry,
  DailyConexoesEntry,
  DailyConjuntosEntry,
  DailyEstoquistaEntry,
  DailyFilmacoEntry,
  DailyInvestigacaoEntry,
  DailyMapeamentoEntry,
  DailyOrganikuEntry,
  DailyPalavreadoEntry,
  DailyPanicoEntry,
  DailyPicacoEntry,
  DailyPirralhosEntry,
  DailyPortaisEntry,
  DailyQuartetosEntry,
  DailyTaNaCaraEntry,
  DailyVitralEntry,
} from './games';

/**
 * Placeholder shape for a game's daily payload before its final data model
 * is defined. Always includes an id, sequence number, and type, plus any
 * additional game-specific fields. Once a game is ported, replace its
 * `PlaceholderGameData` field in `GamesEntries`/`ContributionsEntries` below
 * with a real type defined in `./games`.
 */
export type PlaceholderGameData = {
  id: DateKey;
  number: number;
  type: string;
  [key: string]: unknown;
};

/**
 * Daily payload entries for each core game, keyed by game id.
 */
export type GamesEntries = {
  'arte-ruim'?: DailyArteRuimEntry;
  'aqui-o'?: DailyAquiOEntry;
  alienado?: DailyAlienadoEntry;
  /**
   * Estoquista never arrives from the `dailyEngine` response; its payload
   * is always synthesized locally (see `LOCAL_GAME_GENERATORS` in
   * `useGetDailyChallenges`) and injected into `challenges` after fetch.
   */
  estoquista?: DailyEstoquistaEntry;
  investigacao?: DailyInvestigacaoEntry;
  filmaco?: DailyFilmacoEntry;
  mapeamento?: DailyMapeamentoEntry;
  organiku?: DailyOrganikuEntry;
  palavreado?: DailyPalavreadoEntry;
  panico?: DailyPanicoEntry;
  portais?: DailyPortaisEntry;
  quartetos?: DailyQuartetosEntry;
  conjuntos?: DailyConjuntosEntry;
  vitral?: DailyVitralEntry;
  pirralhos?: DailyPirralhosEntry;
  /**
   * Not implemented yet; will arrive from the `dailyEngine` response once
   * the game ships, like every other entry in `GamesEntries`.
   */
  colorido?: PlaceholderGameData;
  /**
   * Not implemented yet; will arrive from the `dailyEngine` response once
   * the game ships, like every other entry in `GamesEntries`.
   */
  epocas?: PlaceholderGameData;
  /**
   * Not implemented yet; will arrive from the `dailyEngine` response once
   * the game ships, like every other entry in `GamesEntries`.
   */
  karaoke?: PlaceholderGameData;
};

/**
 * Daily payload entries for community-contributed games, keyed by game id.
 */
type ContributionsEntries = {
  conexoes?: DailyConexoesEntry;
  picaco?: DailyPicacoEntry;
  'ta-na-cara'?: DailyTaNaCaraEntry;
};

/**
 * Shape of the daily challenges API response, split into core games and
 * community contributions plus optional shared metadata.
 */
export type DailyResponse = {
  id: DateKey;
  // Games
  challenges: GamesEntries;
  //
  contributions: ContributionsEntries;
  // Additional info
  metadata?: {
    dictionary?: Dictionary<string>;
  };
};

/**
 * A date string in `YYYY-MM-DD` format, used to key daily content.
 */
export type DateKey = string;

/**
 * Static metadata describing a single game shown in the hub and used to
 * drive its card, launch screen, and routing.
 */
export type GameInfo = {
  /**
   * Unique key for the game used for local storage
   */
  id: string;
  /**
   * SCREAMING_SNAKE_CASE form of `id`, used as the local storage key prefix
   * (see `gameIdToLocalTodayKey`).
   */
  key: string;
  /**
   * Game type
   */
  type: 'game' | 'contribution' | 'special';
  /**
   * Game's solid theme color, as an opaque `rgb(r, g, b)` string. Use it
   * directly wherever a solid fill is wanted (e.g. progress bars, borders),
   * or pass it through `withAlpha()` (see `@utils/helpers`) to derive a
   * translucent variant for a specific use case instead of baking any
   * alpha into this value.
   */
  color: string;
  /**
   * Game emoji
   */
  emoji: string;
  /**
   * Game name
   */
  name: DualLanguageValue<string>;
  /**
   * Game tagline
   */
  tagline: DualLanguageValue<string>;
  /**
   * The day the game was released
   */
  releaseDate: DateKey;
  /**
   * The game's release/rollout stage.
   */
  release:
    | 'stable'
    | 'beta'
    | 'demo'
    | 'maintenance'
    | 'disabled'
    | 'soon'
    | 'unreleased';
  /**
   * The game's semantic version (e.g. `'0.0.1'`).
   */
  version: string;
};

/**
 * Persisted per-day progress for Organiku, kept in local storage so a page
 * reload doesn't lose the player's progress within the same day.
 */
export type DefaultGameState<T = unknown> = {
  /**
   * Today's daily challenge id (a date string); used to detect a new day.
   */
  id: string;
  /**
   * Current lifecycle status of the game.
   */
  status: (typeof GAME_LIFECYCLE_STATUS)[keyof typeof GAME_LIFECYCLE_STATUS];
  /**
   * Progress of the game, represented as a number between 0 and 1.
   */
  progress: number;
  /**
   * Current score of the player in the game.
   */
  score: number;
} & T;
