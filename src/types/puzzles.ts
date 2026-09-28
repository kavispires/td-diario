import type { DailyOrganikuEntry } from './games';

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
  'arte-ruim'?: PlaceholderGameData;
  'aqui-o'?: PlaceholderGameData;
  alienado?: PlaceholderGameData;
  investigacao?: PlaceholderGameData;
  filmaco?: PlaceholderGameData;
  mapeamento?: PlaceholderGameData;
  organiku?: DailyOrganikuEntry;
  palavreado?: PlaceholderGameData;
  portais?: PlaceholderGameData;
  quartetos?: PlaceholderGameData;
  conjuntos?: PlaceholderGameData;
  vitral?: PlaceholderGameData;
  pirralhos?: PlaceholderGameData;
};

/**
 * Daily payload entries for community-contributed games, keyed by game id.
 */
type ContributionsEntries = {
  picaco?: PlaceholderGameData;
  'ta-na-cara'?: PlaceholderGameData;
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
