/**
 * Shape required of any value persisted via {@link loadLocalToday}/{@link useDailyLocalToday}:
 * an `id` used to detect a new day and invalidate the previous value.
 */
type WithRequiredId = { id: string };

/**
 * Builds the localStorage key used to persist a game's local "today" state.
 *
 * @param key - Short uppercase identifier for the game (e.g. `'ORGANIKU'`).
 * @returns The composed localStorage key.
 */
export function composeLocalTodayKey(key: string): string {
  return `TD_DIARIO_V2_${key}_LOCAL_TODAY`;
}

/**
 * Removes a game's locally-persisted "today" state entirely, e.g. to reset
 * progress for testing.
 *
 * @param key - Short uppercase identifier for the game (e.g. `'ORGANIKU'`).
 */
export function clearLocalToday(key: string): void {
  localStorage.removeItem(composeLocalTodayKey(key));
}

/**
 * Derives the short uppercase identifier used by {@link composeLocalTodayKey}
 * from a game's kebab-case `GameInfo.id` (e.g. `'ta-na-cara'` becomes
 * `'TA_NA_CARA'`).
 *
 * @param gameId - Kebab-case game id, as used in `gameInfos`.
 * @returns The uppercase local-today storage identifier.
 */
export function gameIdToLocalTodayKey(gameId: string): string {
  return gameId.toUpperCase().replaceAll('-', '_');
}

/**
 * Options accepted by {@link loadLocalToday} and {@link useDailyLocalToday}.
 */
type LocalTodayOptions<TLocal extends WithRequiredId> = {
  /**
   * Short uppercase identifier for the game (e.g. `'ORGANIKU'`).
   */
  key: string;
  /**
   * Today's daily challenge id (a date string); used to detect a new day.
   */
  dateId: string;
  /**
   * Value used when nothing is stored yet, or the stored value is stale.
   */
  defaultValue: TLocal;
};

/**
 * Reads a game's locally-persisted "today" state, resetting it to
 * `defaultValue` when its shape is outdated or it belongs to a previous
 * day.
 *
 * @param options - See {@link LocalTodayOptions}.
 * @returns The stored value, or a fresh `defaultValue` when reset.
 */
export function loadLocalToday<TLocal extends WithRequiredId>({
  key,
  dateId,
  defaultValue,
}: LocalTodayOptions<TLocal>): TLocal {
  const localKey = composeLocalTodayKey(key);

  let previouslyStored: Partial<TLocal> = {};
  try {
    previouslyStored = JSON.parse(localStorage.getItem(localKey) ?? '{}');
  } catch {
    previouslyStored = {};
  }

  const isDefaultValueValid = Object.keys(defaultValue).every(
    (field) => field in previouslyStored,
  );

  if (!isDefaultValueValid || previouslyStored.id !== dateId) {
    const freshValue = { ...defaultValue, id: dateId };
    localStorage.setItem(localKey, JSON.stringify(freshValue));
    return freshValue;
  }

  return previouslyStored as TLocal;
}

/**
 * Persists partial updates to a game's local "today" state, merging them
 * into whatever is currently stored (or `defaultValue` if nothing is).
 *
 * @param options - See {@link LocalTodayOptions}.
 * @returns An `updateLocalStorage` function that merges and persists updates.
 */
export function useDailyLocalToday<TLocal extends WithRequiredId>({
  key,
  dateId,
  defaultValue,
}: LocalTodayOptions<TLocal>): {
  updateLocalStorage: (value: Partial<TLocal>) => void;
} {
  const localKey = composeLocalTodayKey(key);

  function updateLocalStorage(value: Partial<TLocal>) {
    const current = loadLocalToday({ key, dateId, defaultValue });
    const updated = { ...current, ...value };
    localStorage.setItem(localKey, JSON.stringify(updated));
  }

  return { updateLocalStorage };
}
