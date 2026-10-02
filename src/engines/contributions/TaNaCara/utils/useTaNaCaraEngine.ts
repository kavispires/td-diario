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
import { useEffect, useMemo, useState } from 'react';
import type { DailyTaNaCaraEntry, DailyTaNaCaraVariant } from 'types/games';
import { gameInfo } from '../info';
import {
  buildPreparedQuestions,
  buildSavePayload,
  canSubmitFromQuestion,
  countCompletedQuestions,
  countMarkedAnswers,
  getProgress,
  getResultQuestions,
  getScore,
  getSuspectDisplayName,
  hasMinimumAnswers,
  MIN_REQUIRED_QUESTIONS,
} from './helpers';
import type { GameState, TaNaCaraEngineState } from './types';

/**
 * Drives a single day's Ta Na Cara game: question-deck setup, answer
 * storage, local persistence, and saving the finished testimonies to the
 * backend contribution database.
 *
 * @param data - Today's Ta Na Cara payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via {@link getInitialState}.
 * @returns Everything the Ta Na Cara screen needs to render, navigate, and
 *   save today's testimonies.
 */
export function useTaNaCaraEngine(
  data: DailyTaNaCaraEntry,
  initialState: GameState,
): TaNaCaraEngineState {
  const [state, setState] = useState<GameState>(initialState);
  const [showResults, setShowResults] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is meant to trigger persistence
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  const testimoniesById = useMemo(
    () =>
      Object.fromEntries(
        data.testimonies.map((testimony) => [testimony.testimonyId, testimony]),
      ),
    [data.testimonies],
  );

  const totalQuestions = state.selectedTestimonyIds.length;
  const questionNumber = totalQuestions > 0 ? state.questionIndex + 1 : 0;
  const currentQuestion =
    testimoniesById[state.selectedTestimonyIds[state.questionIndex]] ?? null;
  const currentAnswers = state.answers[state.questionIndex] ?? null;
  const suspects = state.questionSuspectIds[state.questionIndex] ?? [];

  const answersToReview = useMemo(
    () => state.answers.slice(0, Math.max(state.questionIndex + 1, 0)),
    [state.answers, state.questionIndex],
  );

  const resultQuestions = useMemo(
    () => getResultQuestions(data, answersToReview),
    [answersToReview, data],
  );
  const allVisitedQuestionsValid = answersToReview.every(hasMinimumAnswers);

  const saveMutation = useMutation<void, Error, void>({
    mutationKey: ['ta-na-cara-save-testimonies', data.id],
    mutationFn: async () => {
      await DAILY_API.run({
        action: DAILY_API_ACTIONS.SAVE_TESTIMONIES,
        answers: buildSavePayload(answersToReview),
      });
    },
    onSuccess: () => {
      setState((previousState) => ({
        ...previousState,
        status: GAME_LIFECYCLE_STATUS.WIN,
        progress: 1,
      }));
      setSaveFailed(false);
      setShowResults(true);
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
      notification.success('Respostas salvas com sucesso!');
    },
    onError: () => {
      setSaveFailed(true);
      notification.error(
        'Não conseguimos salvar suas respostas agora. Tente novamente.',
      );
    },
  });

  /**
   * Starts today's Ta Na Cara run from the intro screen.
   */
  function startGame() {
    if (saveMutation.isPending || state.status === GAME_LIFECYCLE_STATUS.WIN) {
      return;
    }

    setSaveFailed(false);
    setState((previousState) => ({
      ...previousState,
      status: GAME_LIFECYCLE_STATUS.IN_PROGRESS,
    }));
  }

  /**
   * Rebuilds today's question deck based on the chosen NSFW mode.
   *
   * @param checked - Whether NSFW testimonies should be included.
   */
  function toggleNsfwMode(checked: boolean) {
    if (saveMutation.isPending || state.status !== GAME_LIFECYCLE_STATUS.IDLE) {
      return;
    }

    const nextMode = checked ? 'nsfw' : 'normal';
    const prepared = buildPreparedQuestions(data, nextMode);
    setSaveFailed(false);
    setState((previousState) => ({
      ...previousState,
      mode: nextMode,
      questionIndex: 0,
      selectedTestimonyIds: prepared.selectedTestimonyIds,
      questionSuspectIds: prepared.questionSuspectIds,
      answers: prepared.answers,
      score: 0,
      progress: 0,
    }));
  }

  /**
   * Changes the portrait style used for suspect images.
   *
   * @param variant - Next portrait variant.
   */
  function changeVariant(variant: DailyTaNaCaraVariant) {
    setState((previousState) => ({
      ...previousState,
      variant,
    }));
  }

  /**
   * Toggles one suspect answer inside the current testimony and updates the
   * score/progress metrics in state.
   *
   * @param suspectId - Suspect being answered.
   * @param answer - Next explicit answer chosen by the player.
   */
  function updateAnswer(suspectId: string, answer: boolean) {
    if (
      !currentAnswers ||
      saveMutation.isPending ||
      state.status !== GAME_LIFECYCLE_STATUS.IN_PROGRESS
    ) {
      return;
    }

    const currentValue = currentAnswers.answers[suspectId] ?? null;
    const nextValue = currentValue === answer ? null : answer;

    playSFX(nextValue === null ? 'select' : nextValue ? 'yah' : 'nah');
    setSaveFailed(false);
    setState((previousState) => {
      const answers = previousState.answers.map((entry, index) => {
        if (index !== previousState.questionIndex) {
          return entry;
        }

        return {
          ...entry,
          answers: {
            ...entry.answers,
            [suspectId]: nextValue,
          },
        };
      });

      return {
        ...previousState,
        answers,
        score: getScore(answers),
        progress: getProgress(
          answers,
          previousState.selectedTestimonyIds.length,
        ),
      };
    });
  }

  /**
   * Advances to the next testimony once the current one has enough answers.
   */
  function goToNextQuestion() {
    if (
      !currentAnswers ||
      !hasMinimumAnswers(currentAnswers) ||
      state.questionIndex >= totalQuestions - 1
    ) {
      return;
    }

    setSaveFailed(false);
    playSFX('swap');
    setState((previousState) => ({
      ...previousState,
      questionIndex: previousState.questionIndex + 1,
    }));
  }

  /**
   * Returns to the previous testimony.
   */
  function goToPreviousQuestion() {
    if (state.questionIndex <= 0) {
      return;
    }

    setSaveFailed(false);
    playSFX('swap');
    setState((previousState) => ({
      ...previousState,
      questionIndex: previousState.questionIndex - 1,
    }));
  }

  /**
   * Saves the current Ta Na Cara run to the backend.
   */
  function submitAnswers() {
    if (!canSubmit || saveMutation.isPending) {
      return;
    }

    setSaveFailed(false);
    saveMutation.mutate();
  }

  /**
   * Retries the last failed save without changing the stored answers.
   */
  function retrySave() {
    if (!saveFailed || saveMutation.isPending) {
      return;
    }

    saveMutation.mutate();
  }

  const answeredQuestions = countCompletedQuestions(state.answers);
  const markedAnswers = countMarkedAnswers(state.answers);
  const canGoNext =
    !!currentAnswers &&
    hasMinimumAnswers(currentAnswers) &&
    state.questionIndex < totalQuestions - 1;
  const canGoPrevious = state.questionIndex > 0;
  const canSubmit =
    !!currentAnswers &&
    hasMinimumAnswers(currentAnswers) &&
    canSubmitFromQuestion(questionNumber, totalQuestions) &&
    allVisitedQuestionsValid;
  const submitLabel =
    questionNumber >= totalQuestions
      ? 'Salvar e terminar'
      : questionNumber >= MIN_REQUIRED_QUESTIONS
        ? 'Cansei / Salvar'
        : 'Salvar';

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);

  return {
    currentQuestion,
    currentAnswers,
    suspects,
    questionNumber,
    totalQuestions,
    answeredQuestions,
    markedAnswers,
    showResults,
    setShowResults,
    progress: state.progress,
    score: state.score,
    mode: state.mode,
    variant: state.variant,
    isIdle: state.status === GAME_LIFECYCLE_STATUS.IDLE,
    isPlaying:
      state.status === GAME_LIFECYCLE_STATUS.IN_PROGRESS &&
      !saveMutation.isPending,
    isSaving: saveMutation.isPending,
    isRetryable: saveFailed && !saveMutation.isPending,
    isWin,
    isLose,
    isComplete,
    alreadyPlayed: isWin,
    canGoNext,
    canGoPrevious,
    canSubmit,
    submitLabel,
    resultQuestions,
    toggleNsfwMode,
    updateAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    submitAnswers,
    retrySave,
    startGame,
    changeVariant,
    getSuspectName: (suspectId: string) =>
      getSuspectDisplayName(suspectId, data.names),
  };
}
