import { useDailyLocalToday } from '@hooks/useDailyLocalToday';
import { DAILY_API, DAILY_API_ACTIONS } from '@services/adapters';
import {
  getGameAnalyticsEventName,
  logAnalyticsEvent,
} from '@services/firebase';
import { useAuthStore } from '@store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { notification } from '@utils/notification';
import { useEffect, useState } from 'react';
import type { DailyIdeiasEntry } from 'types/games';
import { gameInfo } from '../info';
import type {
  GameState,
  IdeaCategory,
  IdeaDraft,
  IdeaToSave,
  IdeiasEngineState,
} from './types';

/**
 * Drives Ideias' submission flow: persisting whether the player already
 * contributed an idea today, and saving each submitted idea to the
 * backend contribution database.
 *
 * @param data - Today's Ideias challenge payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via `getInitialState`.
 * @returns Everything the Ideias screen needs to render the current state
 *   and submit new ideas.
 */
export function useIdeiasEngine(
  data: DailyIdeiasEntry,
  initialState: GameState,
): IdeiasEngineState {
  const [state, setState] = useState<GameState>(initialState);
  const [isSubmittingAnother, setIsSubmittingAnother] = useState(false);
  const user = useAuthStore((store) => store.user);

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is meant to trigger persistence
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  const saveMutation = useMutation<
    void,
    Error,
    { category: IdeaCategory; draft: IdeaDraft }
  >({
    mutationKey: ['ideias-save', data.id],
    mutationFn: async ({ category, draft }) => {
      if (!user?.uid) {
        throw new Error('Faça login novamente para enviar sua ideia.');
      }

      const idea: IdeaToSave = { category, draft, playerId: user.uid };

      await DAILY_API.run({ action: DAILY_API_ACTIONS.SAVE_IDEA, idea });
    },
    onSuccess: (_result, { category }) => {
      setState((previousState) => ({
        ...previousState,
        status: GAME_LIFECYCLE_STATUS.WIN,
        progress: 1,
        lastCategory: category,
        submissionCount: previousState.submissionCount + 1,
      }));
      setIsSubmittingAnother(false);
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
      notification.success('Ideia enviada com sucesso!');
    },
    onError: () => {
      notification.error(
        'Não conseguimos enviar sua ideia agora. Tente novamente.',
      );
    },
  });

  /**
   * Switches the form back to the category picker to submit another idea.
   */
  function startAnother() {
    setIsSubmittingAnother(true);
  }

  /**
   * Submits one idea to the backend for today's contribution.
   *
   * @param category - Category the idea belongs to.
   * @param draft - Category-specific fields collected from the form.
   */
  function submitIdea(category: IdeaCategory, draft: IdeaDraft) {
    if (saveMutation.isPending) {
      return;
    }

    saveMutation.mutate({ category, draft });
  }

  const isWin = state.status === GAME_LIFECYCLE_STATUS.WIN;

  return {
    isIdle: !isWin || isSubmittingAnother,
    isWin: isWin && !isSubmittingAnother,
    isSaving: saveMutation.isPending,
    submissionCount: state.submissionCount,
    isSubmittingAnother,
    startAnother,
    submitIdea,
  };
}
