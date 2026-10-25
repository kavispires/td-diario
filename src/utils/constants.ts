export const LOCAL_STORAGE_KEYS = {
  PREFERENCES: 'td_diario_preferences',
} as const;

export const GAME_LIFECYCLE_STATUS = {
  IDLE: 'idle',
  IN_PROGRESS: 'in-progress',
  /**
   * Still in progress, but the player has already made enough headway
   * (per the game's own threshold) that the hub considers the run
   * share-eligible, even though it hasn't been won or lost yet.
   */
  TRIED: 'tried',
  WIN: 'win',
  LOSE: 'lose',
} as const;
