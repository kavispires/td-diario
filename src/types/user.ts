/**
 * A user's persisted daily-play profile: identity, streak stats, and
 * today's per-game results.
 */
export type DailyUser = {
  /**
   * Firebase authentication user id.
   */
  uid: string;
  /**
   * Name shown throughout the app.
   */
  displayName: string;
  /**
   * URL of the user's avatar image.
   */
  avatarUrl: string;
  /**
   * Unix timestamp (ms) when the user account was created.
   */
  createdAt: number;
  /**
   * Number of consecutive days the user has played, ending today or
   * yesterday.
   */
  currentStreak: number;
  /**
   * The longest streak the user has ever achieved.
   */
  longestStreak: number;
  /**
   * The last date (`YYYY-MM-DD`) the user played a game.
   */
  lastPlayedDate: string;
  /**
   * The user's results for the current day.
   */
  today: {
    /**
     * The current day's date (`YYYY-MM-DD`).
     */
    date: string;
    /**
     * Per-game results for the current day, keyed by game id.
     */
    results: Record<string, unknown>;
  };
  /**
   * Aggregate per-game statistics, keyed by game id.
   */
  stats: Record<string, unknown>;
};
