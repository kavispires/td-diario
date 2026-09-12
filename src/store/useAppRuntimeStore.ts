import { create } from 'zustand';

/**
 * Describes the in-flight shared-element splash for a game being launched.
 */
type LaunchingGame = {
  /** The id of the game whose card/logo is animating. */
  id: string;
};

interface AppRuntimeState {
  /**
   * The current width of the app window. This is used to determine which layout to apply to the UI. It can be any number representing the width in pixels.
   */
  width: number;
  setWidth: (width: number) => void;
  /**
   * Whether the app is in dark mode or not. This is used to determine which theme to apply to the UI. It can be either true for dark mode or false for light mode.
   */
  isDarkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  /**
   * The current language of the app. This is used to determine which language to display in the UI. It can be either 'pt' for Portuguese or 'en' for English.
   */
  language: 'pt' | 'en';
  setLanguage: (lang: 'pt' | 'en') => void;
  /**
   * The game currently animating into or out of the fullscreen splash, or null when idle.
   */
  launchingGame: LaunchingGame | null;
  setLaunchingGame: (launchingGame: LaunchingGame | null) => void;
  /**
   * The id of the game whose logo currently occupies the Header, or null when on the Hub.
   */
  activeGameId: string | null;
  setActiveGameId: (gameId: string | null) => void;
}

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
}));
