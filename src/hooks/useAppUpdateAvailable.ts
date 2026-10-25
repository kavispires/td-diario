import { useGetDailyChallenges } from '@hooks/useGetDailyChallenges';
import { isVersionNewer } from '@utils/version';

/**
 * Checks whether a newer app version has been published than the one
 * currently running on the client, by comparing today's daily payload's
 * optional `minAppVersion` field against the build-time `__APP_VERSION__`
 * constant.
 *
 * @returns Whether a newer app version is available. Always `false` while
 *   the daily payload hasn't loaded yet or doesn't include `minAppVersion`.
 */
export function useAppUpdateAvailable(): boolean {
  const { data } = useGetDailyChallenges();
  const serverVersion = data?.minAppVersion;

  if (!serverVersion) {
    return false;
  }

  return isVersionNewer(serverVersion, __APP_VERSION__);
}
