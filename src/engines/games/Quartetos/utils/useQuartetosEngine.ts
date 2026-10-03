import { useAutoShowResults } from '@hooks/useAutoShowResults';
import { useDailyLocalToday } from '@hooks/useDailyLocalToday';
import {
  getGameAnalyticsEventName,
  logAnalyticsEvent,
} from '@services/firebase';

import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { getGameStatuses } from '@utils/helpers';
import { playSFX } from '@utils/soundEffects';
import { vibrate } from '@utils/vibrate';
import { useEffect, useState } from 'react';
import type { DailyQuartetosEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  CORRECT_GUESS_SCORE,
  QUARTETOS_GROUP_SIZE,
  WIN_BONUS_SCORE,
} from './constants';
import { buildSetKey, shuffleItems } from './helpers';
import type { GameState, QuartetosEngineState, SessionState } from './types';

const INITIAL_SESSION: SessionState = {
  selection: [],
  latestAttempt: 0,
  feedback: null,
};

/**
 * Drives a single day's Quartetos game: selection, quartet validation,
 * remaining-heart tracking, win/lose detection, and per-day persistence.
 *
 * @param data - Today's Quartetos challenge payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via {@link getInitialState}.
 * @returns Everything the Quartetos screen needs to render and interact
 *   with today's puzzle.
 */
export function useQuartetosEngine(
  data: DailyQuartetosEntry,
  initialState: GameState,
): QuartetosEngineState {
  const [state, setState] = useState<GameState>(initialState);
  const [session, setSession] = useState<SessionState>(INITIAL_SESSION);
  const [showResults, setShowResults] = useState(false);

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

  function clearFeedback() {
    updateSession({ feedback: null });
  }

  function onSelectItem(itemId: string) {
    if (getGameStatuses(state.status).isComplete) {
      return;
    }

    const isSelected = session.selection.includes(itemId);
    if (!isSelected && session.selection.length === QUARTETOS_GROUP_SIZE) {
      updateSession({
        feedback: 'Você só pode selecionar quatro itens por vez.',
      });
      return;
    }

    updateSession({
      selection: isSelected
        ? session.selection.filter(
            (selectedItemId) => selectedItemId !== itemId,
          )
        : [...session.selection, itemId],
      feedback: null,
    });
    playSFX(isSelected ? 'bubbleIn' : 'bubbleOut');
  }

  function onDeselectAll() {
    if (session.selection.length === 0) {
      return;
    }

    updateSession({ selection: [], feedback: null });
    playSFX('bubbleOut');
  }

  function onShuffle() {
    if (state.grid.length === 0 || getGameStatuses(state.status).isComplete) {
      return;
    }

    setState((prev) => ({
      ...prev,
      grid: shuffleItems(prev.grid),
    }));
    updateSession({ feedback: null });
    playSFX('shuffle');
  }

  function onSubmit() {
    if (
      session.selection.length !== QUARTETOS_GROUP_SIZE ||
      getGameStatuses(state.status).isComplete
    ) {
      return;
    }

    const guessKey = buildSetKey(session.selection);
    if (state.guesses.includes(guessKey)) {
      updateSession({
        feedback: 'Você já tentou essa combinação.',
      });
      return;
    }

    const matchedSet = data.sets.find(
      (quartetSet) => buildSetKey(quartetSet.itemsIds) === guessKey,
    );

    if (matchedSet) {
      const nextMatches = [...state.matches, matchedSet];
      const isWin = nextMatches.length === data.sets.length;

      setState((prev) => {
        const selectedItems = new Set(session.selection);

        return {
          ...prev,
          status: isWin
            ? GAME_LIFECYCLE_STATUS.WIN
            : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
          guesses: [...prev.guesses, guessKey],
          matches: nextMatches,
          grid: prev.grid.filter((itemId) => !selectedItems.has(itemId)),
          score:
            prev.score +
            (isWin
              ? prev.hearts * WIN_BONUS_SCORE
              : prev.hearts * CORRECT_GUESS_SCORE),
          progress: nextMatches.length / data.sets.length,
        };
      });

      if (isWin) {
        playSFX('win');
        logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
      } else {
        playSFX('correct');
      }

      updateSession({ selection: [], feedback: null });
      return;
    }

    const nextHearts = state.hearts - 1;
    const isLose = nextHearts <= 0;

    setState((prev) => {
      const remainingSets = isLose
        ? data.sets.filter(
            (quartetSet) =>
              !prev.matches.some(
                (matchedSetItem) => matchedSetItem.id === quartetSet.id,
              ),
          )
        : [];

      return {
        ...prev,
        status: isLose
          ? GAME_LIFECYCLE_STATUS.LOSE
          : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
        guesses: [...prev.guesses, guessKey],
        hearts: nextHearts,
        matches: isLose ? [...prev.matches, ...remainingSets] : prev.matches,
        grid: isLose ? [] : prev.grid,
      };
    });

    if (isLose) {
      playSFX('lose');
      vibrate('lose');
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'lose'));
      updateSession({
        selection: [],
        latestAttempt: Date.now(),
        feedback: null,
      });
      return;
    }

    playSFX('wrong');
    vibrate('wrong');
    updateSession({
      latestAttempt: Date.now(),
      feedback: null,
    });
  }

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);

  useAutoShowResults(isComplete, setShowResults);

  return {
    hearts: state.hearts,
    guesses: state.guesses,
    matches: state.matches,
    grid: state.grid,
    selection: session.selection,
    latestAttempt: session.latestAttempt,
    score: state.score,
    progress: state.progress,
    feedback: session.feedback,
    showResults,
    setShowResults,
    isWin,
    isLose,
    isComplete,
    onSelectItem,
    onDeselectAll,
    onShuffle,
    onSubmit,
    clearFeedback,
  };
}
