import { DAILY_API, DAILY_API_ACTIONS } from '@services/adapters';
import { logAnalyticsEvent } from '@services/firebase';
import { useAuthStore } from '@store/useAuthStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMillisecondsUntilTomorrow, getToday, print } from '@utils/helpers';
import { useEffect } from 'react';
import type { DailyResponse } from '../types/puzzles';

export function useGetDailyChallenges() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  // The user is refreshed every midnight, so we need to invalidate the query at that time
  useEffect(() => {
    if (!user?.uid) return;
    const msUntilMidnight = getMillisecondsUntilTomorrow();

    const timer = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['dailyChallenges'] });
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [user?.uid, queryClient]);

  const query = useQuery<DailyResponse>({
    queryKey: ['dailyChallenges'],
    queryFn: async () => {
      // biome-ignore lint/suspicious/noConsole: debug purposes
      console.count(`Fetching Daily Challenge...`);
      const response = await DAILY_API.run({
        action: DAILY_API_ACTIONS.GET_DAILY,
        date: getToday(),
        document: 'diario',
      });
      const responseData = response.data as DailyResponse;
      print({ diario: responseData }, 'table');
      logAnalyticsEvent('daily_challenges_fetched');
      return responseData;
    },
    enabled: !!user?.uid,
    retry: false,
  });
  return query;
}
