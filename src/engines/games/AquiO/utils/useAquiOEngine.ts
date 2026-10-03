import { useDailyLocalToday } from '@hooks/useDailyLocalToday';
import {
  getGameAnalyticsEventName,
  logAnalyticsEvent,
} from '@services/firebase';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { getGameStatuses } from '@utils/helpers';
import { playSFX } from '@utils/soundEffects';
import { vibrate } from '@utils/vibrate';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { DailyAquiOEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  CORRECT_MATCH_SCORE,
  ROUND_DURATION_SECONDS,
  SPEECH_LANGUAGE,
  SPEECH_RATE,
  TIMER_TICK_INTERVAL_MS,
  WIN_MATCH_SCORE,
} from './constants';
import { getDiscs } from './helpers';
import type { GameState, RoundStopType, SessionState } from './types';

const INITIAL_SESSION: SessionState = {
  discIndex: 0,
  discs: [],
  stopType: 'idle',
};

function speakInPortuguese(text: string) {
  if (
    typeof window === 'undefined' ||
    !('speechSynthesis' in window) ||
    !text.trim()
  ) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANGUAGE;
  utterance.rate = SPEECH_RATE;
  window.speechSynthesis.speak(utterance);
}

/**
 * Drives a single day's Aqui O game: disc generation, timed-round flow,
 * hearts, retry handling, and win/lose detection. Persists the day-level
 * state to local storage so the player can resume later in the same day.
 *
 * @param data - Today's Aqui O challenge payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via {@link getInitialState}.
 * @param itemLabels - Dictionary of item names used for optional voice callouts.
 * @returns All state and actions required by the Aqui O screen.
 */
export function useAquiOEngine(
  data: DailyAquiOEntry,
  initialState: GameState,
  itemLabels: Dictionary<string>,
) {
  const [state, setState] = useState<GameState>(initialState);
  const [session, setSession] = useState<SessionState>(INITIAL_SESSION);
  const [voice, setVoice] = useState<'on' | 'off'>('off');
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const endAtRef = useRef<number | null>(null);

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is meant to trigger persistence
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  useEffect(() => {
    if (voice === 'off' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [voice]);

  useEffect(() => {
    if (!isPlaying || endAtRef.current === null) {
      return;
    }

    const updateTimer = () => {
      const msRemaining = endAtRef.current ? endAtRef.current - Date.now() : 0;
      const nextTimeLeft = Math.max(0, msRemaining / 1000);
      setTimeLeft(nextTimeLeft);

      if (msRemaining <= 0) {
        endAtRef.current = null;
        setIsPlaying(false);
        setShowResults(true);
        setSession((prev) => ({ ...prev, stopType: 'timeout' }));
        setState((prev) => ({
          ...prev,
          status: getGameStatuses(prev.status).isComplete
            ? prev.status
            : GAME_LIFECYCLE_STATUS.IDLE,
        }));
      }
    };

    updateTimer();
    const timerId = window.setInterval(updateTimer, TIMER_TICK_INTERVAL_MS);

    return () => window.clearInterval(timerId);
  }, [isPlaying]);

  const discA = session.discs[session.discIndex];
  const discB = session.discs[session.discIndex + 1];

  const result = useMemo(() => discB?.match ?? '', [discB]);

  function updateSession(next: Partial<SessionState>) {
    setSession((prev) => ({ ...prev, ...next }));
  }

  function stopRound(stopType: RoundStopType) {
    endAtRef.current = null;
    setIsPlaying(false);
    setShowResults(true);
    updateSession({ stopType });
  }

  function onStart() {
    if (getGameStatuses(state.status).isComplete) {
      return;
    }

    setShowResults(false);
    setTimeLeft(ROUND_DURATION_SECONDS);
    endAtRef.current = Date.now() + ROUND_DURATION_SECONDS * 1000;
    setIsPlaying(true);
    setSession({
      discIndex: 0,
      stopType: 'idle',
      discs: getDiscs(data, state.hardMode),
    });
    setState((prev) => ({
      ...prev,
      attempts: prev.attempts + 1,
      status: GAME_LIFECYCLE_STATUS.IN_PROGRESS,
    }));

    playSFX('addCorrect');

    if (voice === 'on') {
      speakInPortuguese('Já!');
    }
  }

  function onSelect(itemId: string) {
    if (!isPlaying || !result) {
      return;
    }

    if (itemId === result) {
      const nextDiscIndex = session.discIndex + 1;
      const isWin = nextDiscIndex === state.goal;

      setState((prev) => {
        const nextMaxProgress = Math.max(prev.maxProgress, nextDiscIndex);
        const hasNewRecord = nextMaxProgress > prev.maxProgress;
        const nextScore = hasNewRecord
          ? prev.score +
            prev.hearts * (isWin ? WIN_MATCH_SCORE : CORRECT_MATCH_SCORE)
          : prev.score;

        return {
          ...prev,
          status: isWin
            ? GAME_LIFECYCLE_STATUS.WIN
            : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
          maxProgress: nextMaxProgress,
          progress: nextMaxProgress / prev.goal,
          score: nextScore,
        };
      });

      setSession((prev) => ({ ...prev, discIndex: nextDiscIndex }));
      playSFX(isWin ? 'win' : 'correct');

      if (voice === 'on') {
        const itemName = itemLabels[itemId];
        if (itemName) {
          speakInPortuguese(itemName);
        }
      }

      if (isWin) {
        stopRound('win');
        logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
      }

      return;
    }

    if (state.hearts === 1) {
      setState((prev) => ({
        ...prev,
        hearts: 0,
        status: GAME_LIFECYCLE_STATUS.LOSE,
      }));
      playSFX('lose');
      vibrate('lose');
      stopRound('lose');
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'lose'));
      return;
    }

    setState((prev) => ({
      ...prev,
      hearts: prev.hearts - 1,
      status: GAME_LIFECYCLE_STATUS.IN_PROGRESS,
    }));
    playSFX('wrong');
    vibrate('wrong');
  }

  function onModeChange(newMode: 'normal' | 'challenge') {
    setState((prev) => ({
      ...prev,
      hardMode: newMode === 'challenge',
    }));
  }

  function onVoiceChange(newVoice: 'on' | 'off') {
    setVoice(newVoice);
  }

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);

  return {
    hearts: state.hearts,
    attempts: state.attempts,
    maxProgress: state.maxProgress,
    goal: state.goal,
    score: state.score,
    discIndex: session.discIndex,
    discA,
    discB,
    result,
    stopType: session.stopType,
    isWin,
    isLose,
    isComplete,
    isPlaying,
    timeLeft,
    mode: state.hardMode ? ('challenge' as const) : ('normal' as const),
    onModeChange,
    voice,
    onVoiceChange,
    onStart,
    onSelect,
    showResults,
    setShowResults,
  };
}
