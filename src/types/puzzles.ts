type PlaceholderGameData = {
  id: DateKey;
  number: number;
  type: string;
  [key: string]: unknown;
};

type GamesEntries = {
  'arte-ruim'?: PlaceholderGameData;
  'aqui-o'?: PlaceholderGameData;
  alienado?: PlaceholderGameData;
  investigacao?: PlaceholderGameData;
  filmaco?: PlaceholderGameData;
  mapeamento?: PlaceholderGameData;
  organiku?: PlaceholderGameData;
  palavreado?: PlaceholderGameData;
  portais?: PlaceholderGameData;
  quartetos?: PlaceholderGameData;
  conjuntos?: PlaceholderGameData;
  vitral?: PlaceholderGameData;
  pirralhos?: PlaceholderGameData;
};

type ContributionsEntries = {
  picaco?: PlaceholderGameData;
  'ta-na-cara'?: PlaceholderGameData;
};

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

export type DateKey = string; // Format YYYY-MM-DD

export interface GameInfo {
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
}
