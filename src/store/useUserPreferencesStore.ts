import { LOCAL_STORAGE_KEYS } from '@utils/constants';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreferencesState {
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
  /**
   * The date of the last news item the user has seen. This is used to determine if there are new news items that the user hasn't seen yet.
   */
  lastSeenNews: string | null;
  setLastSeenNews: (date: string | null) => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      activeGame: null,
      setActiveGame: (gameId) => set({ activeGame: gameId }),
      soundEnabled: true,
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      lastSeenNews: null,
      setLastSeenNews: (date) => set({ lastSeenNews: date }),
    }),
    {
      name: LOCAL_STORAGE_KEYS.PREFERENCES,
    },
  ),
);
