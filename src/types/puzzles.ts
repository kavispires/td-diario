import type { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type {
  DailyAlienadoEntry,
  DailyArteRuimEntry,
  DailyConjuntosEntry,
  DailyEstoquistaEntry,
  DailyFilmacoEntry,
  DailyMapeamentoEntry,
  DailyOrganikuEntry,
  DailyPalavreadoEntry,
  DailyPicacoEntry,
  DailyPirralhosEntry,
  DailyPortaisEntry,
  DailyQuartetosEntry,
  DailyTaNaCaraEntry,
  DailyVitraisInfinitosEntry,
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
type GamesEntries = {
  'arte-ruim'?: DailyArteRuimEntry;
  'aqui-o'?: PlaceholderGameData;
  alienado?: DailyAlienadoEntry;
  /**
   * Special games still arrive in the main `challenges` payload bucket, so
   * Estoquista belongs here instead of `contributions`.
   */
  estoquista?: DailyEstoquistaEntry;
  investigacao?: PlaceholderGameData;
  filmaco?: DailyFilmacoEntry;
  mapeamento?: DailyMapeamentoEntry;
  organiku?: DailyOrganikuEntry;
  palavreado?: DailyPalavreadoEntry;
  portais?: DailyPortaisEntry;
  quartetos?: DailyQuartetosEntry;
  conjuntos?: DailyConjuntosEntry;
  vitral?: DailyVitralEntry;
  /**
   * Special games still arrive in the main `challenges` payload bucket, so
   * Vitrais Infinitos belongs here instead of `contributions`.
   */
  'vitrais-infinitos'?: DailyVitraisInfinitosEntry;
  pirralhos?: DailyPirralhosEntry;
};

/**
 * Daily payload entries for community-contributed games, keyed by game id.
 */
type ContributionsEntries = {
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
   * Game type
   */
  type: 'game' | 'contribution' | 'special';
  /**
   * Game box hub color
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
   * Whether the game is in demo mode
   */
  version:
    | 'stable'
    | 'beta'
    | 'demo'
    | 'maintenance'
    | 'disabled'
    | 'soon'
    | 'unreleased';
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
