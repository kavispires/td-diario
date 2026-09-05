import { create } from 'zustand';

interface DailyState {
  streak: number;
  completedCount: number;
  totalGames: number;
  // We will add actions here later (e.g., completeGame, fetchUserData)
}

export const useDailyStore = create<DailyState>(() => ({
  streak: 5, // Mock data
  completedCount: 4, // Mock data
  totalGames: 11, // Derived from your GAME_REGISTRY later
}));
