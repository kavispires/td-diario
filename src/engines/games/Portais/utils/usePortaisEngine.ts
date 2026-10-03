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
import { useEffect, useMemo, useState } from 'react';
import type { DailyPortaisEntry } from 'types/games';
import { gameInfo } from '../info';
import { getCurrentGuess, getStartingCorridorIndexes } from './helpers';
import type { GameState } from './types';

/**
 * Drives a single day's Portais game: rotating word columns, guess
 * submission, hearts, win/lose detection, and local persistence so a
 * reload doesn't interrupt the run.
 *
 * @param data Today's Portais challenge payload.
 * @param initialState The engine's starting `GameState`, usually loaded via
 *   {@link getInitialState}.
 * @returns Everything the Portais screen needs to render and interact with
 *   the active corridor and end-of-game state.
 */
export function usePortaisEngine(
  data: DailyPortaisEntry,
  initialState: GameState,
) {
  const [state, setState] = useState<GameState>(initialState);
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

  const currentCorridor = data.corridors[state.currentCorridorIndex] ?? null;
  const latestGuess = currentCorridor
    ? (state.guesses[state.currentCorridorIndex]?.[
        (state.guesses[state.currentCorridorIndex]?.length ?? 1) - 1
      ] ?? '')
    : '';

  const currentGuess = useMemo(() => {
    if (!currentCorridor) {
      return '';
    }

    return getCurrentGuess(currentCorridor, state.currentCorridorIndexes);
  }, [currentCorridor, state.currentCorridorIndexes]);

  function onSlideWordPosition(index: number) {
    let didMove = false;

    setState((prev) => {
      const corridor = data.corridors[prev.currentCorridorIndex];

      if (!corridor) {
        return prev;
      }

      const word = corridor.words[index];
      const latestStoredGuess =
        prev.guesses[prev.currentCorridorIndex]?.[
          (prev.guesses[prev.currentCorridorIndex]?.length ?? 1) - 1
        ] ?? '';

      if (
        !word ||
        latestStoredGuess[index] === corridor.passcode[index] ||
        prev.status === GAME_LIFECYCLE_STATUS.WIN ||
        prev.status === GAME_LIFECYCLE_STATUS.LOSE
      ) {
        return prev;
      }

      const nextIndexes = [...prev.currentCorridorIndexes];
      const currentIndex = nextIndexes[index] ?? Math.min(word.length - 1, 1);
      nextIndexes[index] =
        currentIndex >= word.length - 1 ? 0 : currentIndex + 1;

      const moves = prev.moves.map((moveCount, moveIndex) =>
        moveIndex === prev.currentCorridorIndex ? moveCount + 1 : moveCount,
      );

      didMove = true;

      return {
        ...prev,
        status:
          prev.status === GAME_LIFECYCLE_STATUS.IDLE
            ? GAME_LIFECYCLE_STATUS.IN_PROGRESS
            : prev.status,
        currentCorridorIndexes: nextIndexes,
        moves,
      };
    });

    if (didMove) {
      playSFX('swap');
    }
  }

  function onSubmitPasscode() {
    let didSubmit = false;
    let isCorrect = false;
    let passcode = '';
    let shouldLogOutcome: 'win' | 'lose' | null = null;
    let nextSound: 'sparks' | 'win' | 'wrong' | 'lose' | null = null;

    setState((prev) => {
      const corridor = data.corridors[prev.currentCorridorIndex];

      if (!corridor) {
        return prev;
      }

      const guess = getCurrentGuess(corridor, prev.currentCorridorIndexes);
      const guesses = prev.guesses.map((batch, batchIndex) =>
        batchIndex === prev.currentCorridorIndex ? [...batch, guess] : batch,
      );
      const latestStoredGuess =
        prev.guesses[prev.currentCorridorIndex]?.[
          (prev.guesses[prev.currentCorridorIndex]?.length ?? 1) - 1
        ] ?? '';

      if (!guess || guess === latestStoredGuess) {
        return prev;
      }

      didSubmit = true;
      passcode = corridor.passcode;
      isCorrect = guess === corridor.passcode;

      if (isCorrect) {
        const nextCorridorIndex = prev.currentCorridorIndex + 1;
        const didFinishGame = nextCorridorIndex === data.corridors.length;
        const scoreIncrement = prev.hearts * (didFinishGame ? 20 : 10);

        nextSound = didFinishGame ? 'win' : 'sparks';
        shouldLogOutcome = didFinishGame ? 'win' : null;

        return {
          ...prev,
          status: didFinishGame
            ? GAME_LIFECYCLE_STATUS.WIN
            : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
          guesses,
          currentCorridorIndex: didFinishGame
            ? data.corridors.length - 1
            : nextCorridorIndex,
          currentCorridorIndexes: didFinishGame
            ? prev.currentCorridorIndexes
            : getStartingCorridorIndexes(data.corridors[nextCorridorIndex]),
          score: prev.score + scoreIncrement,
          progress: didFinishGame
            ? 1
            : nextCorridorIndex / data.corridors.length,
        };
      }

      const hearts = prev.hearts - 1;
      const didLoseGame = hearts <= 0;

      nextSound = didLoseGame ? 'lose' : 'wrong';
      shouldLogOutcome = didLoseGame ? 'lose' : null;

      return {
        ...prev,
        status: didLoseGame
          ? GAME_LIFECYCLE_STATUS.LOSE
          : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
        guesses,
        hearts,
      };
    });

    if (!didSubmit) {
      return;
    }

    if (isCorrect) {
      notification.success(`Você acertou: ${passcode.toUpperCase()}!`);
    } else {
      notification.warning('Palavra-chave incorreta. Tente novamente!');
    }

    if (nextSound) {
      playSFX(nextSound);
    }

    if (shouldLogOutcome) {
      logAnalyticsEvent(
        getGameAnalyticsEventName(gameInfo.key, shouldLogOutcome),
      );
    }
  }

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);

  useAutoShowResults(isComplete, setShowResults);

  return {
    hearts: state.hearts,
    guesses: state.guesses,
    currentCorridorIndex: state.currentCorridorIndex,
    currentCorridor,
    currentCorridorIndexes: state.currentCorridorIndexes,
    moves: state.moves,
    score: state.score,
    progress: state.progress,
    currentGuess,
    latestGuess,
    showResults,
    setShowResults,
    isWin,
    isLose,
    isComplete,
    onSlideWordPosition,
    onSubmitPasscode,
  };
}
