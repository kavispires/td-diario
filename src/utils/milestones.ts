import { MILESTONES } from '@data/milestones';
import type { MilestoneDefinition } from 'types/milestones';
import type { DailyUser } from 'types/user';

/**
 * A {@link MilestoneDefinition} augmented with whether the given user has
 * earned it.
 */
export type MilestoneStatus = MilestoneDefinition & {
  /**
   * Whether the user's `DailyUser` currently satisfies this milestone's
   * `check`.
   */
  earned: boolean;
};

/**
 * Evaluates every milestone in {@link MILESTONES} against a `DailyUser`,
 * in the same order they're defined (earned and locked milestones are
 * interleaved; sort/filter by `earned` at the call site if needed).
 *
 * @param dailyUser - The user's current `DailyUser` document.
 * @param totalGameCount - The total number of games currently in the
 *   app's `gameInfos` registry (used by milestones like "played every
 *   game").
 * @returns Every milestone, each with an `earned` flag.
 */
export function getMilestoneStatuses(
  dailyUser: DailyUser,
  totalGameCount: number,
): MilestoneStatus[] {
  return MILESTONES.map((milestone) => ({
    ...milestone,
    earned: milestone.check(dailyUser, totalGameCount),
  }));
}
