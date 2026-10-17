import { MilestoneBadge } from '@components/profile/MilestoneBadge';
import { Title } from '@components/ui/Typography';
import type { MilestoneStatus } from '@utils/milestones';

/**
 * Props accepted by the {@link MilestonesSection} component.
 */
type MilestonesSectionProps = {
  /**
   * Every milestone, each with an `earned` flag, from `getMilestoneStatuses`.
   */
  milestones: MilestoneStatus[];
};

/**
 * Renders the Profile screen's milestones section: a grid of earned and
 * locked achievement badges.
 *
 * @param props Every milestone with its earned status.
 * @returns The rendered milestones section.
 */
export function MilestonesSection({ milestones }: MilestonesSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <Title
        level={4}
        className="mb-0"
      >
        Conquistas
      </Title>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
        {milestones.map((milestone) => (
          <MilestoneBadge
            key={milestone.id}
            milestone={milestone}
          />
        ))}
      </div>
    </section>
  );
}
