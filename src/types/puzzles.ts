export type DailyResponse = {
  id: string;
  // Games
  alienado?: unknown;
  'aqui-o'?: unknown;
  'arte-ruim'?: unknown;
  conjuntos?: unknown;
  cruzadas?: unknown;
  filmaco?: unknown;
  investigacao?: unknown;
  mapeamento?: unknown;
  organiku?: unknown;
  palavreado?: unknown;
  panico?: unknown;
  pirralhos?: unknown;
  portais?: unknown;
  quartetos?: unknown;
  vitral?: unknown;
  // Contributions
  picaco?: unknown;
  'ta-na-cara'?: unknown;
  // Deprecated
  estoquista?: unknown;
  conexoes?: unknown;
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
   * Game icon key
   */
  hubIcon: string;
  /**
   * Game name
   */
  name: string;
  /**
   * Game tagline
   */
  tagline: string;
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
