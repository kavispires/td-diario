import { USE_MOCK_DATA } from '@dev-config';
import { generateDailyIdeiasEntry } from '@engines/contributions/Ideias/utils/generator';
import { getEpocasDemo } from '@engines/games/Epocas/utils/demo';
import { generateDailyEstoquistaEntry } from '@engines/games/Estoquista/utils/generator';
import { DAILY_API, DAILY_API_ACTIONS } from '@services/adapters';
import { logAnalyticsEvent } from '@services/firebase';
import { useAuthStore } from '@store/useAuthStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMillisecondsUntilTomorrow, getToday, print } from '@utils/helpers';
import { useEffect } from 'react';
import type { DailyResponse, GamesEntries } from '../types/puzzles';

const LOCAL_GAME_DEMOS: {
  [Id in keyof GamesEntries]?: (id: DailyResponse['id']) => GamesEntries[Id];
} = {
  epocas: getEpocasDemo,
};

/**
 * Registry of games that are always generated locally rather than arriving
 * in the `dailyEngine` response (e.g. because their puzzle content is
 * synthesized on the client). Each entry's generator receives today's date
 * key and returns a freshly built payload for that game.
 */
const LOCAL_GAME_GENERATORS: {
  [Id in keyof GamesEntries]?: (id: DailyResponse['id']) => GamesEntries[Id];
} = {
  estoquista: generateDailyEstoquistaEntry,
};

/**
 * Registry mirroring {@link LOCAL_GAME_GENERATORS}, but for contributions:
 * entries that are always generated locally rather than arriving in the
 * `dailyEngine` response.
 */
const LOCAL_CONTRIBUTION_GENERATORS: {
  [Id in keyof DailyResponse['contributions']]?: (
    id: DailyResponse['id'],
  ) => DailyResponse['contributions'][Id];
} = {
  ideias: generateDailyIdeiasEntry,
};

/**
 * Fills in any locally-generated games/contributions missing from a
 * fetched/mocked daily response, mutating neither input, so entries that
 * never arrive from the API (see {@link LOCAL_GAME_GENERATORS} and
 * {@link LOCAL_CONTRIBUTION_GENERATORS}) are still playable.
 *
 * @param responseData - The daily response to inject local entries into.
 * @returns A new `DailyResponse` with every locally-generated entry filled
 *   in.
 */
function injectLocallyGeneratedGames(
  responseData: DailyResponse,
): DailyResponse {
  const challenges = { ...responseData.challenges };

  for (const id of Object.keys(LOCAL_GAME_GENERATORS) as Array<
    keyof GamesEntries
  >) {
    if (!challenges[id]) {
      const generate = LOCAL_GAME_GENERATORS[id];
      // @ts-expect-error -- each generator's return type matches its own key
      challenges[id] = generate?.(responseData.id);
    }
  }

  for (const id of Object.keys(LOCAL_GAME_DEMOS) as Array<keyof GamesEntries>) {
    if (!challenges[id]) {
      const generate = LOCAL_GAME_DEMOS[id];
      // @ts-expect-error -- each generator's return type matches its own key
      challenges[id] = generate?.();
    }
  }

  const contributions = { ...responseData.contributions };

  for (const id of Object.keys(LOCAL_CONTRIBUTION_GENERATORS) as Array<
    keyof DailyResponse['contributions']
  >) {
    if (!contributions[id]) {
      const generate = LOCAL_CONTRIBUTION_GENERATORS[id];
      // @ts-expect-error -- each generator's return type matches its own key
      contributions[id] = generate?.(responseData.id);
    }
  }

  return { ...responseData, challenges, contributions };
}

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
      if (USE_MOCK_DATA) {
        // biome-ignore lint/suspicious/noConsole: debug purposes
        console.warn(
          'Using mock data during dev, skipping daily challenges fetch.',
        );
        // Dynamically imported so this large mock dataset (and the game
        // mocks/generators it pulls in) is only ever bundled/loaded when
        // mock data is actually enabled.
        const { MOCK_DAILY_RESPONSE } = await import('@data/mock');
        // Delay of 3 seconds to simulate async behavior
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Ensure async context
        const result = injectLocallyGeneratedGames(MOCK_DAILY_RESPONSE);
        print({ diario: result }, 'table');
        return result;
      }

      // biome-ignore lint/suspicious/noConsole: debug purposes
      console.count(`Fetching Daily Challenge...`);
      const response = await DAILY_API.run({
        action: DAILY_API_ACTIONS.GET_DAILY,
        date: getToday(),
        document: 'diario',
      });
      const responseData = response.data as DailyResponse;
      logAnalyticsEvent('daily_challenges_fetched');
      const result = injectLocallyGeneratedGames(responseData);
      print({ diario: result }, 'table');
      return result;
    },
    enabled: !!user?.uid,
    retry: false,
  });
  return query;
}
