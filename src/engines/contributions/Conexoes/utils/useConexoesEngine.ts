import { useDailyLocalToday } from '@hooks/useDailyLocalToday';
import { DAILY_API, DAILY_API_ACTIONS } from '@services/adapters';
import {
  getGameAnalyticsEventName,
  logAnalyticsEvent,
} from '@services/firebase';
import { useMutation } from '@tanstack/react-query';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { getGameStatuses } from '@utils/helpers';
import { notification } from '@utils/notification';
import { playSFX } from '@utils/soundEffects';
import { vibrate } from '@utils/vibrate';
import { useEffect, useState } from 'react';
import type { DailyConexoesEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  CONEXOES_SAVE_MUTATION_KEY,
  GENERATED_PAIRS_BATCH_SIZE,
  MIN_REQUIRED_PAIRS,
} from './constants';
import {
  buildSavePayload,
  generatePairs,
  getProgress,
  getScore,
} from './helpers';
import type {
  ConexoesEngineState,
  GameState,
  RelatedPair,
  SessionState,
} from './types';

const INITIAL_SESSION_STATE: SessionState = {
  showResults: false,
  saveFailed: false,
};

/**
 * Drives a single day's Conexões game: pair generation, relation marking,
 * local persistence, save/retry states, and win/lose transitions.
 *
 * @param data - Today's Conexões payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via {@link getInitialState}.
 * @returns Everything the Conexões screen needs to render and progress.
 */
export function useConexoesEngine(
  data: DailyConexoesEntry,
  initialState: GameState,
): ConexoesEngineState {
  const [state, setState] = useState<GameState>(initialState);
  const [session, setSession] = useState<SessionState>(INITIAL_SESSION_STATE);

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is meant to trigger persistence
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  const saveMutation = useMutation<void, Error, RelatedPair[]>({
    mutationKey: [CONEXOES_SAVE_MUTATION_KEY, data.id],
    mutationFn: async (pairsToSave) => {
      await DAILY_API.run({
        action: DAILY_API_ACTIONS.SAVE_CONEXOES,
        ...buildSavePayload(pairsToSave),
      });
    },
    onSuccess: () => {
      setState((previousState) => ({
        ...previousState,
        status: GAME_LIFECYCLE_STATUS.WIN,
        progress: 1,
      }));
      setSession((previousSession) => ({
        ...previousSession,
        saveFailed: false,
      }));
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
      notification.success('Conexões salvas com sucesso!');
    },
    onError: () => {
      setSession((previousSession) => ({
        ...previousSession,
        saveFailed: true,
      }));
      notification.error(
        'Não conseguimos salvar suas conexões agora. Tente novamente.',
      );
    },
  });

  const currentPair = state.pairs[state.currentPairIndex] ?? null;
  const { isWin, isLose, isComplete } = getGameStatuses(state.status);
  const canSave =
    state.evaluatedCount >= MIN_REQUIRED_PAIRS && state.relatedPairs.length > 0;
  const canComplete =
    state.evaluatedCount >= MIN_REQUIRED_PAIRS &&
    state.relatedPairs.length === 0;

  /**
   * Starts today's Conexões run from the intro screen.
   */
  function startGame() {
    if (saveMutation.isPending || isComplete) {
      return;
    }

    setSession((previousSession) => ({
      ...previousSession,
      saveFailed: false,
    }));
    setState((previousState) => ({
      ...previousState,
      status: GAME_LIFECYCLE_STATUS.IN_PROGRESS,
    }));
  }

  /**
   * Records the player's answer for the current pair and advances the queue,
   * generating more pairs when the existing batch runs out.
   *
   * @param isRelated - Whether the current pair should be saved as related.
   */
  function evaluatePair(isRelated: boolean) {
    if (
      saveMutation.isPending ||
      state.status !== GAME_LIFECYCLE_STATUS.IN_PROGRESS
    ) {
      return;
    }

    playSFX(isRelated ? 'yah' : 'nah');
    setSession((previousSession) => ({
      ...previousSession,
      saveFailed: false,
    }));

    setState((previousState) => {
      const pair = previousState.pairs[previousState.currentPairIndex];
      if (!pair) {
        return previousState;
      }

      const relatedPairs = isRelated
        ? [
            ...previousState.relatedPairs,
            { imageId1: pair.imageId1, imageId2: pair.imageId2 },
          ]
        : previousState.relatedPairs;
      const evaluatedCount = previousState.evaluatedCount + 1;
      const currentPairIndex = previousState.currentPairIndex + 1;
      let pairs = previousState.pairs;
      let generatedPairIds = previousState.generatedPairIds;

      if (currentPairIndex >= previousState.pairs.length) {
        const newPairs = generatePairs(
          data.imageIds,
          new Set(previousState.generatedPairIds),
          GENERATED_PAIRS_BATCH_SIZE,
        );

        if (newPairs.length > 0) {
          pairs = [...previousState.pairs, ...newPairs];
          generatedPairIds = [
            ...previousState.generatedPairIds,
            ...newPairs.map((nextPair) => nextPair.pairId),
          ];
        }
      }

      return {
        ...previousState,
        pairs,
        currentPairIndex,
        relatedPairs,
        generatedPairIds,
        evaluatedCount,
        score: getScore(relatedPairs.length),
        progress: getProgress(evaluatedCount),
      };
    });
  }

  /**
   * Sends the currently found related pairs to the backend.
   */
  function savePairs() {
    if (!canSave || saveMutation.isPending) {
      return;
    }

    setSession((previousSession) => ({
      ...previousSession,
      saveFailed: false,
    }));
    saveMutation.mutate(state.relatedPairs);
  }

  /**
   * Retries the last failed save using the already stored related pairs.
   */
  function retrySave() {
    if (
      !session.saveFailed ||
      saveMutation.isPending ||
      state.relatedPairs.length === 0
    ) {
      return;
    }

    saveMutation.mutate(state.relatedPairs);
  }

  /**
   * Finishes today's run without saving any relationship, marking the day as
   * complete with a loss state.
   */
  function finishWithoutSaving() {
    if (
      saveMutation.isPending ||
      state.status !== GAME_LIFECYCLE_STATUS.IN_PROGRESS ||
      !canComplete
    ) {
      return;
    }

    playSFX('lose');
    vibrate('lose');
    setSession((previousSession) => ({
      ...previousSession,
      saveFailed: false,
    }));
    setState((previousState) => ({
      ...previousState,
      status: GAME_LIFECYCLE_STATUS.LOSE,
      progress: 1,
    }));
    logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'lose'));
  }

  return {
    currentPair,
    relatedPairs: state.relatedPairs,
    evaluatedCount: state.evaluatedCount,
    showResults: session.showResults,
    setShowResults: (value) =>
      setSession((previousSession) => ({
        ...previousSession,
        showResults: value,
      })),
    progress: state.progress,
    score: state.score,
    isIdle: state.status === GAME_LIFECYCLE_STATUS.IDLE,
    isPlaying: state.status === GAME_LIFECYCLE_STATUS.IN_PROGRESS,
    isSaving: saveMutation.isPending,
    isRetryable: session.saveFailed && !saveMutation.isPending,
    isWin,
    isLose,
    isComplete,
    canSave,
    canComplete,
    startGame,
    evaluatePair,
    savePairs,
    retrySave,
    finishWithoutSaving,
  };
}
