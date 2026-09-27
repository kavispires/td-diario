/** biome-ignore-all lint/complexity/noUselessTernary: The ternary expressions are used for clarity and explicitness, and can be modified temporarily during development. */

const _isDevEnv: boolean = import.meta.env.MODE === 'development';

/**
 * Should be on during development to use firestore (data) emulators
 */
export const USE_FIRESTORE_EMULATOR = _isDevEnv ? false : false;

/**
 * Should be on during development to use functions emulator
 */
export const USE_FUNCTIONS_EMULATOR = _isDevEnv ? false : false;

/**
 * Trigger all use mocks (only in development mode)
 */
export const USE_MOCK_DATA = _isDevEnv ? true : true;
