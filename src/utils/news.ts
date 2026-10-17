import type { NewsEntry } from 'types/news';

/**
 * Returns the subset of `entries` that should currently be visible: those
 * dated today or earlier, further restricting `exact`-flagged entries to
 * only their exact date, sorted newest first.
 *
 * @param entries All known news entries (e.g. `NEWS_ENTRIES`).
 * @param today Today's date (`YYYY-MM-DD`), e.g. from `getToday()`.
 * @returns The currently-visible entries, newest first.
 */
export function getVisibleNewsEntries(
  entries: NewsEntry[],
  today: string,
): NewsEntry[] {
  return entries
    .filter((entry) =>
      entry.exact ? entry.date === today : entry.date <= today,
    )
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/**
 * Determines whether there's news the user hasn't seen yet, by comparing
 * the newest visible entry's date against the last-seen watermark.
 *
 * @param visibleEntries Entries returned by `getVisibleNewsEntries`,
 *   already sorted newest first.
 * @param lastSeenNews The last news date the user acknowledged (see
 *   `useUserPreferencesStore`'s `lastSeenNews`), or `null` if never seen.
 * @returns `true` if the newest visible entry is newer than `lastSeenNews`.
 */
export function hasUnseenNews(
  visibleEntries: NewsEntry[],
  lastSeenNews: string | null,
): boolean {
  const [newest] = visibleEntries;
  if (!newest) {
    return false;
  }
  return lastSeenNews === null || newest.date > lastSeenNews;
}

const NEWS_DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
});

/**
 * Formats a `NewsEntry.date` (`YYYY-MM-DD`) as a short, pt-BR day/month
 * string (e.g. `17 de outubro`), for display alongside an entry.
 *
 * @param date - A `YYYY-MM-DD` date string.
 * @returns The formatted date, or the original string if it can't be
 *   parsed.
 */
export function formatNewsDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) {
    return date;
  }
  // Constructed from local year/month/day (rather than `new Date(date)`)
  // to avoid UTC-vs-local timezone shifts rolling the date back a day.
  return NEWS_DATE_FORMATTER.format(new Date(year, month - 1, day));
}
