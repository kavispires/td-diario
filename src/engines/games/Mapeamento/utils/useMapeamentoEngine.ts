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
import type { DailyMapeamentoEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  getAvailableClues,
  getLocationFragments,
  hasFoundAllLocationLetters,
  MAPEAMENTO_HEARTS,
  normalizeComparableLocationText,
} from './helpers';
import type { GameState, MapeamentoEngineState } from './types';

/**
 * Drives a single day's Mapeamento game: guess validation, clue and
 * fragment progression, hearts, win/lose detection, and local persistence.
 *
 * @param data - Today's Mapeamento challenge payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via {@link getInitialState}.
 * @returns Everything the Mapeamento screen needs to render and submit
 *   guesses for today's challenge.
 */
export function useMapeamentoEngine(
  data: DailyMapeamentoEntry,
  initialState: GameState,
): MapeamentoEngineState {
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

  const locationFragments = useMemo(
    () => getLocationFragments(data.location, state.guesses),
    [data.location, state.guesses],
  );

  const hasFoundAllLetters = useMemo(
    () => hasFoundAllLocationLetters(data.location, state.guesses),
    [data.location, state.guesses],
  );

  const availableClues = useMemo(
    () => getAvailableClues(data.clues, state.hearts),
    [data.clues, state.hearts],
  );

  /**
   * Validates and submits one typed location guess.
   *
   * @param location - Raw guess typed by the player.
   * @returns Whether the guess was accepted and consumed.
   */
  function submitLocation(location: string): boolean {
    const trimmedLocation = location.trim();

    if (!trimmedLocation) {
      notification.warning('Digite um palpite antes de tentar.');
      return false;
    }

    const fragmentLetters = locationFragments.join('').replaceAll('_', '');
    const fragmentLettersSet = new Set(
      normalizeComparableLocationText(fragmentLetters).toUpperCase().split(''),
    );
    const locationLettersSet = new Set(
      normalizeComparableLocationText(trimmedLocation).toUpperCase().split(''),
    );

    for (const letter of fragmentLettersSet) {
      if (letter && !locationLettersSet.has(letter)) {
        playSFX('wrong');
        notification.warning(
          'Sua tentativa precisa incluir todas as letras já reveladas no fragmento.',
          5000,
        );
        return false;
      }
    }

    const isCorrect =
      normalizeComparableLocationText(trimmedLocation) ===
      normalizeComparableLocationText(data.location);

    if (isCorrect) {
      setState((previousState) => ({
        ...previousState,
        status: GAME_LIFECYCLE_STATUS.WIN,
        progress: 1,
        score: previousState.hearts * 25,
      }));
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
      playSFX('win');
      return true;
    }

    setState((previousState) => {
      const hearts = previousState.hearts - 1;
      const isLose = hearts <= 0;

      if (isLose) {
        logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'lose'));
        playSFX('lose');
      } else {
        playSFX('no');
      }

      return {
        ...previousState,
        hearts,
        guesses: [...previousState.guesses, trimmedLocation],
        status: isLose
          ? GAME_LIFECYCLE_STATUS.LOSE
          : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
        progress: isLose
          ? 1
          : (previousState.guesses.length + 1) / MAPEAMENTO_HEARTS,
      };
    });

    return true;
  }

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);

  useEffect(() => {
    if (isComplete) {
      setShowResults(true);
    }
  }, [isComplete]);

  return {
    hearts: state.hearts,
    guesses: state.guesses,
    allClues: data.clues,
    availableClues,
    locationFragments,
    hasFoundAllLetters,
    showResults,
    setShowResults,
    score: state.score,
    progress: state.progress,
    isWin,
    isLose,
    isComplete,
    submitLocation,
  };
}
