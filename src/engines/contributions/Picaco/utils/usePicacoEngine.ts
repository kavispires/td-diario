import {
  gameIdToLocalTodayKey,
  useDailyLocalToday,
} from '@hooks/useDailyLocalToday';
import { DAILY_API, DAILY_API_ACTIONS } from '@services/adapters';
import {
  getGameAnalyticsEventName,
  logAnalyticsEvent,
} from '@services/firebase';
import { useAuthStore } from '@store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { getGameStatuses } from '@utils/helpers';
import { notification } from '@utils/notification';
import { useEffect, useMemo, useState } from 'react';
import type { DailyPicacoCard, DailyPicacoEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  buildSavePayload,
  isDrawingWorthSaving,
  serializeDrawing,
} from './helpers';
import type { CanvasLine, GameState, PicacoEngineState } from './types';

/**
 * Drives a single day's Picaco game: prompt order selection, local
 * persistence, timed-round completion, and saving finished drawings to the
 * backend contribution database.
 *
 * @param data - Today's Picaco challenge payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via {@link getInitialState}.
 * @returns Everything the Picaco screen needs to render the current state
 *   and move through the timed drawing rounds.
 */
export function usePicacoEngine(
  data: DailyPicacoEntry,
  initialState: GameState,
): PicacoEngineState {
  const [state, setState] = useState<GameState>(initialState);
  const [showResults, setShowResults] = useState(false);
  const user = useAuthStore((store) => store.user);

  const cardsById = useMemo<Record<string, DailyPicacoCard>>(
    () =>
      Object.fromEntries(data.cards.map((card) => [card.id, card] as const)),
    [data.cards],
  );

  const selectedCards = useMemo(
    () =>
      state.selectedCardIds
        .map((cardId) => cardsById[cardId])
        .filter((card): card is DailyPicacoCard => !!card),
    [cardsById, state.selectedCardIds],
  );

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: gameIdToLocalTodayKey(gameInfo.id),
    dateId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is meant to trigger persistence
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  const saveMutation = useMutation<void, Error, GameState>({
    mutationKey: ['picaco-save-drawings', data.id],
    mutationFn: async (stateToSave) => {
      if (!user?.uid) {
        throw new Error('Faça login novamente para salvar seus desenhos.');
      }

      const drawings = buildSavePayload(stateToSave, cardsById, user.uid);
      const language = Object.values(drawings)[0]?.cardId.split('-')[2] ?? 'pt';

      await DAILY_API.run({
        action: DAILY_API_ACTIONS.SAVE_DRAWING,
        drawings,
        language,
      });
    },
    onSuccess: () => {
      setState((previousState) => ({
        ...previousState,
        status: GAME_LIFECYCLE_STATUS.WIN,
      }));
      setShowResults(true);
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.id, 'win'));
      notification.success('Desenhos salvos com sucesso!');
    },
    onError: () => {
      notification.error(
        'Não conseguimos salvar seus desenhos agora. Tente novamente.',
      );
    },
  });

  /**
   * Starts today's Picaco run from the intro screen.
   */
  function startGame() {
    setState((previousState) => ({
      ...previousState,
      status: GAME_LIFECYCLE_STATUS.IN_PROGRESS,
    }));
  }

  /**
   * Re-attempts the final save using the drawings already stored in state.
   */
  function retrySave() {
    if (saveMutation.isPending || state.status === GAME_LIFECYCLE_STATUS.WIN) {
      return;
    }

    saveMutation.mutate(state);
  }

  /**
   * Commits the drawing produced for the current prompt and, after the last
   * prompt, triggers the backend save step.
   *
   * @param lines - Strokes captured during the just-finished timed round.
   */
  function submitDrawing(lines: CanvasLine[]) {
    const currentCard = selectedCards[state.currentCardIndex];
    if (!currentCard || saveMutation.isPending) {
      return;
    }

    const serializedDrawing = serializeDrawing(lines);
    const nextCardIndex = state.currentCardIndex + 1;
    const nextState: GameState = {
      ...state,
      status: GAME_LIFECYCLE_STATUS.IN_PROGRESS,
      currentCardIndex: nextCardIndex,
      drawings: [
        ...state.drawings,
        {
          cardId: currentCard.id,
          drawing: serializedDrawing,
        },
      ],
      score:
        state.score +
        (isDrawingWorthSaving(serializedDrawing) ? currentCard.level * 10 : 0),
      progress:
        selectedCards.length > 0 ? nextCardIndex / selectedCards.length : 1,
    };

    setState(nextState);

    if (nextCardIndex >= selectedCards.length) {
      saveMutation.mutate(nextState);
    }
  }

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);
  const hasFinishedAllRounds =
    state.currentCardIndex >= selectedCards.length && selectedCards.length > 0;

  return {
    selectedCards,
    currentCard: selectedCards[state.currentCardIndex] ?? null,
    currentCardNumber: Math.min(
      state.currentCardIndex + 1,
      selectedCards.length || 1,
    ),
    completedDrawings: state.drawings,
    showResults,
    setShowResults,
    progress: state.progress,
    score: state.score,
    isIdle:
      state.status === GAME_LIFECYCLE_STATUS.IDLE &&
      state.currentCardIndex === 0,
    isPlaying:
      state.status === GAME_LIFECYCLE_STATUS.IN_PROGRESS &&
      !hasFinishedAllRounds,
    isSaving: saveMutation.isPending,
    isRetryable: hasFinishedAllRounds && !isComplete && !saveMutation.isPending,
    isWin,
    isLose,
    isComplete,
    startGame,
    submitDrawing,
    retrySave,
  };
}
