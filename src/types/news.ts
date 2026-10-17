import type { DateKey } from './puzzles';

/**
 * The kind of change a {@link NewsEntry} announces, used to pick its icon
 * and, where relevant, whether it's tied to a specific game.
 */
export type NewsEntryType =
  | 'new-game'
  | 'new-contribution'
  | 'rules-change'
  | 'feature'
  | 'weekend'
  | 'announcement';

/**
 * A single, hand-written entry in the app's user-facing news/changelog
 * feed. Entries describe changes to *gameplay* (new games, rule changes,
 * features), never internal/developer-only changes.
 */
export type NewsEntry = {
  /**
   * The date (`YYYY-MM-DD`) this entry became relevant. Entries are only
   * shown once this date has arrived.
   */
  date: DateKey;
  /**
   * The kind of change being announced, used to pick the entry's icon.
   */
  type: NewsEntryType;
  /**
   * The id of the game this entry is about (see `GameInfo.id`), when
   * applicable. Omitted for `'announcement'` entries that aren't tied to a
   * single game.
   */
  gameId?: string;
  /**
   * Hand-written, plain pt-BR description of the change.
   */
  description: string;
  /**
   * When `true`, this entry is only shown on its exact `date`, instead of
   * from that date onward (e.g. a one-off weekend-mode callout).
   */
  exact?: boolean;
};
