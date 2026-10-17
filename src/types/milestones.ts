import type { ComponentType } from 'react';
import type { DailyUser } from 'types/user';

/**
 * Shape of the icon component accepted by a {@link MilestoneDefinition},
 * matching `lucide-react`'s icon component signature.
 */
export type MilestoneIcon = ComponentType<{
  className?: string;
  strokeWidth?: number;
}>;

/**
 * A single achievement a player can earn, evaluated against their
 * `DailyUser`. Hand-written and data-driven, similar in spirit to
 * `NewsEntry`, so new milestones are easy to add later.
 */
export type MilestoneDefinition = {
  /**
   * Stable, unique identifier for this milestone.
   */
  id: string;
  /**
   * Icon shown for this milestone, both earned and locked.
   */
  icon: MilestoneIcon;
  /**
   * Short, player-facing title (pt-BR).
   */
  title: string;
  /**
   * One-line description of how to earn this milestone (pt-BR).
   */
  description: string;
  /**
   * Whether the given `DailyUser` has earned this milestone.
   *
   * @param dailyUser - The user's current `DailyUser` document.
   * @param totalGameCount - The total number of games currently in the
   *   app's `gameInfos` registry.
   * @returns `true` when the milestone's condition is met.
   */
  check: (dailyUser: DailyUser, totalGameCount: number) => boolean;
};
