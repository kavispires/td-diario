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
import { useEffect, useState } from 'react';
import type { DailyConjuntosEntry, DailyConjuntosThing } from 'types/games';
import { gameInfo } from '../info';
import {
  CONJUNTOS_INTERSECTION_AREA,
  CONJUNTOS_RULE1_AREA,
  CONJUNTOS_RULE2_AREA,
  CONJUNTOS_SCORE_PER_REMAINING_HEART,
  CONJUNTOS_WRONG_GUESS_HEART_PENALTY,
} from './constants';
import { getAreaThingsKey, getTotalHearts } from './helpers';
import type {
  ConjuntosEngineState,
  DiagramArea,
  GameState,
  Guess,
  SessionState,
} from './types';

const INITIAL_SESSION: SessionState = {
  activeThing: null,
  activeArea: null,
};

/**
 * Drives a single day's Conjuntos game: hand/deck flow, diagram placement,
 * hearts, score, win/lose detection, and local persistence.
 *
 * @param data - Today's Conjuntos challenge payload.
 * @param initialState - Restored or fresh `GameState` for this challenge.
 * @returns Everything the Conjuntos screen needs to render and interact.
 */
export function useConjuntosEngine(
  data: DailyConjuntosEntry,
  initialState: GameState,
): ConjuntosEngineState {
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

  const totalThings = data.things.length;
  const maxHearts = getTotalHearts(data.id);

  function updateSession(next: Partial<SessionState>) {
    setSession((previousSession) => ({ ...previousSession, ...next }));
  }

  /**
   * Toggles selection of a hand item.
   *
   * @param thing - Thing the player tapped in the hand.
   */
  function onSelectThing(thing: DailyConjuntosThing) {
    const isActive = session.activeThing?.id === thing.id;
    playSFX(isActive ? 'bubbleOut' : 'select');

    updateSession({
      activeThing: isActive ? null : thing,
      activeArea: null,
    });
  }

  /**
   * Selects or clears the diagram area that will receive the active thing.
   *
   * @param area - Area chosen by the player, or `null` to clear it.
   */
  function onSelectArea(area: DiagramArea | null) {
    if (!session.activeThing) {
      return;
    }

    if (area === null) {
      playSFX('bubbleOut');
      updateSession({ activeArea: null });
      return;
    }

    const isSameArea = session.activeArea === area;
    playSFX(isSameArea ? 'bubbleOut' : 'swap');
    updateSession({ activeArea: isSameArea ? null : area });
  }

  /**
   * Clears the pending placement without consuming a guess.
   */
  function onCancelPlacement() {
    playSFX('bubbleOut');
    setSession(INITIAL_SESSION);
  }

  /**
   * Confirms the current thing/area pair, resolves correctness, mutates the
   * diagram, and transitions the lifecycle state when needed.
   */
  function onConfirmPlacement() {
    const { activeThing, activeArea } = session;

    if (!activeThing || activeArea === null) {
      return;
    }

    const correctArea = activeThing.rule;
    const isValidCorrectArea =
      correctArea === CONJUNTOS_INTERSECTION_AREA ||
      correctArea === CONJUNTOS_RULE1_AREA ||
      correctArea === CONJUNTOS_RULE2_AREA;

    if (!isValidCorrectArea) {
      notification.error(
        'Não deu para validar essa coisa agora. Recarregue a página.',
      );
      return;
    }

    const isCorrect = correctArea === activeArea;
    const nextHand = state.hand.filter((thing) => thing.id !== activeThing.id);
    const replacementThing = !isCorrect ? state.deck.at(-1) : undefined;
    const nextDeck = !isCorrect ? state.deck.slice(0, -1) : state.deck;
    const areaThingsKey = getAreaThingsKey(correctArea);
    const nextGuesses: Guess[] = [
      ...state.guesses,
      {
        thingId: activeThing.id,
        sectionId: activeArea,
        result: isCorrect ? activeArea : false,
      },
    ];
    const nextProgress = totalThings > 0 ? nextGuesses.length / totalThings : 1;
    const nextHearts = isCorrect
      ? state.hearts
      : Math.max(state.hearts - CONJUNTOS_WRONG_GUESS_HEART_PENALTY, 0);
    const resolvedHand = replacementThing
      ? [...nextHand, replacementThing]
      : nextHand;
    const hasFinishedAllPlacements = resolvedHand.length === 0;
    const isLose = nextHearts === 0 && !hasFinishedAllPlacements;
    const isWin = hasFinishedAllPlacements && !isLose;
    const nextStatus = isWin
      ? GAME_LIFECYCLE_STATUS.WIN
      : isLose
        ? GAME_LIFECYCLE_STATUS.LOSE
        : GAME_LIFECYCLE_STATUS.IN_PROGRESS;

    if (isCorrect) {
      notification.success('Correto!');
      playSFX(isWin ? 'win' : 'correct');
    } else {
      notification.error('Incorreto!');
      playSFX(isLose ? 'lose' : 'wrong');
      vibrate(isLose ? 'lose' : 'wrong');
    }

    if (isWin) {
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
    } else if (isLose) {
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'lose'));
    }

    setState((previousState) => ({
      ...previousState,
      hearts: nextHearts,
      hand: resolvedHand,
      deck: nextDeck,
      [areaThingsKey]: [...previousState[areaThingsKey], activeThing],
      guesses: nextGuesses,
      progress: nextProgress,
      score: isCorrect
        ? previousState.score +
          previousState.hearts * CONJUNTOS_SCORE_PER_REMAINING_HEART
        : previousState.score,
      status: nextStatus,
    }));
    setSession(INITIAL_SESSION);
  }

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);

  useAutoShowResults(isComplete, setShowResults);

  return {
    hearts: state.hearts,
    maxHearts,
    hand: state.hand,
    rule1Things: state.rule1Things,
    rule2Things: state.rule2Things,
    intersectingThings: state.intersectingThings,
    guesses: state.guesses,
    placedThingsCount: state.guesses.length,
    totalThings,
    progress: state.progress,
    score: state.score,
    isWeekend: state.isWeekend,
    activeThing: session.activeThing,
    activeArea: session.activeArea,
    showResults,
    setShowResults,
    isWin,
    isLose,
    isComplete,
    onSelectThing,
    onSelectArea,
    onConfirmPlacement,
    onCancelPlacement,
  };
}
