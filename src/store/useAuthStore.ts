import { onAuthStateChanged, type User } from 'firebase/auth';
import { create } from 'zustand';
import { auth } from '../services/firebase';

/**
 * Shape of the {@link useAuthStore} state and actions.
 */
type AuthState = {
  /**
   * The currently authenticated Firebase user, or null when signed out.
   */
  user: User | null;
  /**
   * Whether the initial Firebase auth state is still being resolved.
   */
  isAuthLoading: boolean;
  /**
   * Subscribes to Firebase auth state changes, updating `user` and
   * `isAuthLoading` as they occur. Safe to call multiple times.
   */
  initAuthListener: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthLoading: true,
  initAuthListener: () => {
    onAuthStateChanged(auth, (currentUser) => {
      set({ user: currentUser, isAuthLoading: false });
    });
  },
}));
