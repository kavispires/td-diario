export interface DailyUser {
  uid: string;
  displayName: string;
  avatarUrl: string;
  createdAt: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
  today: {
    date: string;
    results: Record<string, unknown>;
  };
  stats: Record<string, unknown>;
}
