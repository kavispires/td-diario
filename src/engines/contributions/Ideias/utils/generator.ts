import { differenceInCalendarDays } from 'date-fns';
import type { DailyIdeiasEntry } from 'types/games';
import type { DateKey } from 'types/puzzles';
import { gameInfo } from '../info';

/**
 * Synthesizes today's Ideias payload locally, since it never arrives from
 * the `dailyEngine` response and its submission form never changes day to
 * day (see `LOCAL_CONTRIBUTION_GENERATORS` in `useGetDailyChallenges`).
 *
 * @param id - Today's daily challenge id (a date string).
 * @returns Today's Ideias payload.
 */

export function generateDailyIdeiasEntry(id: DateKey): DailyIdeiasEntry {
  const number =
    differenceInCalendarDays(new Date(id), new Date(gameInfo.releaseDate)) + 1;

  return { id, number, type: 'ideias' };
}
