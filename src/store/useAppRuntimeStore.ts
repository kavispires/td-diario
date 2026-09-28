import { create } from 'zustand';

/**
 * Describes the in-flight shared-element splash for a game being launched.
 */
type LaunchingGame = {
  /** The id of the game whose card/logo is animating. */
  id: string;
  /**
   * `'loading'` while the game chunk/data is being fetched, `'ready'` once
   * the game has mounted and is waiting for the player to press Jogar.
   */
  phase: 'loading' | 'ready';
};

/**
 * Shape of the {@link useAppRuntimeStore} state and actions.
 */
type AppRuntimeState = {
  /**
   * The current width of the app window. This is used to determine which layout to apply to the UI. It can be any number representing the width in pixels.
   */
  width: number;
  /**
   * Updates the current app window width.
   */
  setWidth: (width: number) => void;
  /**
   * Whether the app is in dark mode or not. This is used to determine which theme to apply to the UI. It can be either true for dark mode or false for light mode.
   */
  isDarkMode: boolean;
  /**
   * Enables or disables dark mode.
   */
  setDarkMode: (enabled: boolean) => void;
  /**
   * The current language of the app. This is used to determine which language to display in the UI. It can be either 'pt' for Portuguese or 'en' for English.
   */
  language: 'pt' | 'en';
  /**
   * Updates the current app language.
   */
  setLanguage: (lang: 'pt' | 'en') => void;
  /**
   * The game currently animating into or out of the fullscreen splash, or null when idle.
   */
  launchingGame: LaunchingGame | null;
  /**
   * Sets or clears the game currently animating in the fullscreen splash.
   */
  setLaunchingGame: (launchingGame: LaunchingGame | null) => void;
  /**
   * The id of the game whose logo currently occupies the Header, or null when on the Hub.
   */
  activeGameId: string | null;
  /**
   * Sets or clears the id of the game whose logo occupies the Header.
   */
  setActiveGameId: (gameId: string | null) => void;
  /**
   * Today's daily-challenge number for the game occupying the Header, or
   * null when on the Hub or not yet loaded.
   */
  activeGameNumber: number | null;
  /**
   * Sets or clears the daily-challenge number shown alongside the Header's
   * game title.
   */
  setActiveGameNumber: (number: number | null) => void;
  /**
   * The id of the game whose rules screen is currently open, or null when
   * closed.
   */
  rulesGameId: string | null;
  /**
   * Opens the rules screen for the given game.
   */
  openRules: (gameId: string) => void;
  /**
   * Closes the rules screen.
   */
  closeRules: () => void;
};

export const useAppRuntimeStore = create<AppRuntimeState>((set) => ({
  width: 0,
  setWidth: (width) => set({ width }),
  isDarkMode: false,
  setDarkMode: (enabled) => set({ isDarkMode: enabled }),
  language: 'pt',
  setLanguage: (lang) => set({ language: lang }),
  launchingGame: null,
  setLaunchingGame: (launchingGame) => set({ launchingGame }),
  activeGameId: null,
  setActiveGameId: (gameId) => set({ activeGameId: gameId }),
  activeGameNumber: null,
  setActiveGameNumber: (number) => set({ activeGameNumber: number }),
  rulesGameId: null,
  openRules: (gameId) => set({ rulesGameId: gameId }),
  closeRules: () => set({ rulesGameId: null }),
}));
