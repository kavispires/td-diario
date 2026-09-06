import { LOCAL_STORAGE_KEYS } from '@utils/constants';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserSettingsState {
  /**
   * The ID of an active game. This is used to keep track of the last game the user was playing, so we can restore it when they come back.
   */
  activeGame: string | null;
  setActiveGame: (gameId: string | null) => void;
  /**
   * Whether the sound is enabled or not. This is used to keep track of the user's preference for sound, so we can restore it when they come back.
   */
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set) => ({
      activeGame: null,
      setActiveGame: (gameId) => set({ activeGame: gameId }),
      soundEnabled: true,
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
    }),
    {
      name: LOCAL_STORAGE_KEYS.SETTINGS,
    },
  ),
);
