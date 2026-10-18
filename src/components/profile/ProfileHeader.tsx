import { Avatar } from '@components/ui/Avatar';
import { Text, Title } from '@components/ui/Typography';
import { UserRound } from 'lucide-react';
import type { DailyUser } from 'types/user';

/**
 * Props accepted by the {@link ProfileHeader} component.
 */
type ProfileHeaderProps = {
  /**
   * The signed-in user's `DailyUser` document.
   */
  dailyUser: DailyUser;
};

const MEMBER_SINCE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
});

/**
 * Renders the Profile screen's header: the user's avatar, first name, and
 * the month/year they joined, derived from `DailyUser.createdAt`.
 *
 * @param props The signed-in user's `DailyUser` document.
 * @returns The rendered profile header.
 */
export function ProfileHeader({ dailyUser }: ProfileHeaderProps) {
  const memberSince = MEMBER_SINCE_FORMATTER.format(
    new Date(dailyUser.createdAt),
  );
  // Only the first name is shown, since full display names can be long
  // and a first name feels friendlier for this header.
  const firstName = dailyUser.displayName.split(' ')[0];

  return (
    <div className="flex flex-col items-center gap-2 py-4 text-center">
      <Avatar
        src={dailyUser.avatarUrl}
        alt=""
        icon={<UserRound className="h-8 w-8" />}
        size={72}
      />

      <Title
        level={2}
        className="mb-0"
      >
        {firstName}
      </Title>

      <Text
        type="secondary"
        className="capitalize"
      >
        Jogador(a) desde {memberSince}
      </Text>
    </div>
  );
}
