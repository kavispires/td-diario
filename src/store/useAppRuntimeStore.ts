import { create } from 'zustand';

interface AppRuntimeState {
  /** Whether the current app or game UI should use dark mode. */
  isDarkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
}

export const useAppRuntimeStore = create<AppRuntimeState>((set) => ({
  isDarkMode: false,
  setDarkMode: (enabled) => set({ isDarkMode: enabled }),
}));
