type PlaceholderGameData = {
  type: string;
  [key: string]: unknown;
};

export type DailyResponse = {
  id: string;
  // Games
  alienado?: PlaceholderGameData;
  'aqui-o'?: PlaceholderGameData;
  'arte-ruim'?: PlaceholderGameData;
  conjuntos?: PlaceholderGameData;
  cruzadas?: PlaceholderGameData;
  filmaco?: PlaceholderGameData;
  investigacao?: PlaceholderGameData;
  mapeamento?: PlaceholderGameData;
  organiku?: PlaceholderGameData;
  palavreado?: PlaceholderGameData;
  panico?: PlaceholderGameData;
  pirralhos?: PlaceholderGameData;
  portais?: PlaceholderGameData;
  quartetos?: PlaceholderGameData;
  vitral?: PlaceholderGameData;
  // Contributions
  picaco?: PlaceholderGameData;
  'ta-na-cara'?: PlaceholderGameData;
  // Deprecated
  estoquista?: PlaceholderGameData;
  conexoes?: PlaceholderGameData;
  // Other
  data?: {
    dictionary?: Dictionary<string>;
  };
  // Legacy (replaced by data.dictionary)
  dictionary?: Dictionary<string>;
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
