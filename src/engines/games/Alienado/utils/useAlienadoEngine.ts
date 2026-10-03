import { useAutoShowResults } from '@hooks/useAutoShowResults';
import { useDailyLocalToday } from '@hooks/useDailyLocalToday';
import {
  getGameAnalyticsEventName,
  logAnalyticsEvent,
} from '@services/firebase';

import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { getGameStatuses } from '@utils/helpers';
import { notification } from '@utils/notification';
import { playSFX } from '@utils/soundEffects';
import { vibrate } from '@utils/vibrate';
import { useEffect, useMemo, useState } from 'react';
import type { DailyAlienadoEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  ALIENADO_DUPLICATE_GUESS_MESSAGE,
  ALIENADO_GUESS_DELIMITER,
  ALIENADO_INCORRECT_GUESS_MESSAGE,
  ALIENADO_SCORE_PER_REMAINING_HEART,
  ALIENADO_SELECT_SLOT_MESSAGE,
} from './constants';
import { countMatchedPositions, splitGuess } from './helpers';
import type { AlienadoEngineState, GameState, SessionState } from './types';

const INITIAL_SESSION: SessionState = {
  selection: [null, null, null, null],
  slotIndex: null,
  latestAttempt: null,
};

/**
 * Drives a single day's Alienado game: assembling guesses, validating
 * submissions, tracking hearts, and persisting daily progress.
 *
 * @param data Today's Alienado challenge payload.
 * @param initialState The engine's starting `GameState`, usually loaded via
 *   {@link getInitialState}.
 * @returns Everything the Alienado screen needs to render and interact with
 *   the current puzzle.
 */
export function useAlienadoEngine(
  data: DailyAlienadoEntry,
  initialState: GameState,
): AlienadoEngineState {
  const [state, setState] = useState<GameState>(initialState);
  const [session, setSession] = useState<SessionState>(INITIAL_SESSION);
  const [showResults, setShowResults] = useState(false);
  const solutionItems = useMemo(
    () => splitGuess(data.solution),
    [data.solution],
  );

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is meant to trigger persistence
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  function updateSession(next: Partial<SessionState>) {
    setSession((prev) => ({ ...prev, ...next }));
  }

  function onSelectSlot(index: number) {
    updateSession({ slotIndex: index });
    playSFX('select');
  }

  function onClearSlot(index: number) {
    setSession((prev) => {
      const nextSelection = [...prev.selection];
      nextSelection[index] = null;

      return {
        ...prev,
        selection: nextSelection,
        slotIndex: index,
      };
    });
    playSFX('bubbleOut');
  }

  function onSelectItem(itemId: string) {
    const targetIndex =
      session.slotIndex === null
        ? session.selection.indexOf(null)
        : session.slotIndex;

    if (targetIndex === -1) {
      notification.info(ALIENADO_SELECT_SLOT_MESSAGE);
      return;
    }

    setSession((prev) => {
      const nextSelection = [...prev.selection];
      const existingIndex = nextSelection.indexOf(itemId);

      if (existingIndex !== -1) {
        nextSelection[existingIndex] = null;
      }

      nextSelection[targetIndex] = itemId;

      return {
        ...prev,
        selection: nextSelection,
        slotIndex: null,
      };
    });
    playSFX('bubbleIn');
  }

  function submitGuess() {
    if (!session.selection.every(Boolean)) {
      return;
    }

    const guessItems = session.selection.filter(
      (itemId): itemId is string => itemId !== null,
    );
    const guess = guessItems.join(ALIENADO_GUESS_DELIMITER);

    if (state.guesses.includes(guess)) {
      notification.warning(ALIENADO_DUPLICATE_GUESS_MESSAGE);
      playSFX('wrong');
      vibrate('wrong');
      updateSession({ latestAttempt: Date.now() });
      return;
    }

    const isCorrect = guess === data.solution;
    const remainingHearts = isCorrect ? state.hearts : state.hearts - 1;
    const isLose = !isCorrect && remainingHearts === 0;
    const matchedPositions = countMatchedPositions(guessItems, solutionItems);
    const progress = Math.max(
      state.progress,
      matchedPositions / data.requests.length,
    );

    if (isCorrect) {
      playSFX('alienYay');
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
    } else {
      notification.warning(ALIENADO_INCORRECT_GUESS_MESSAGE);
      playSFX('alienBoo');
      vibrate(isLose ? 'lose' : 'wrong');

      if (isLose) {
        logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'lose'));
      }
    }

    setState((prev) => ({
      ...prev,
      guesses: [...prev.guesses, guess],
      hearts: remainingHearts,
      status: isCorrect
        ? GAME_LIFECYCLE_STATUS.WIN
        : isLose
          ? GAME_LIFECYCLE_STATUS.LOSE
          : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
      progress: isCorrect ? 1 : progress,
      score: isCorrect
        ? remainingHearts * ALIENADO_SCORE_PER_REMAINING_HEART
        : prev.score,
    }));

    updateSession({
      latestAttempt: Date.now(),
      slotIndex: null,
    });
  }

  const isReady = session.selection.every(Boolean);
  const { isWin, isLose, isComplete } = getGameStatuses(state.status);

  useAutoShowResults(isComplete, setShowResults);

  return {
    hearts: state.hearts,
    guesses: state.guesses,
    selection: session.selection,
    slotIndex: session.slotIndex,
    latestAttempt: session.latestAttempt,
    isReady,
    isComplete,
    isWin,
    isLose,
    showResults,
    score: state.score,
    setShowResults,
    onSelectSlot,
    onSelectItem,
    onClearSlot,
    submitGuess,
  };
}
