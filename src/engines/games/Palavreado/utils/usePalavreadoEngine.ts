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
import type { DailyPalavreadoEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  PALAVREADO_SECRET_WORD_SCORE,
  PALAVREADO_WORD_SCORE,
} from './constants';
import {
  buildWordsFromLetters,
  calculateProgress,
  smartShuffle as smartShuffleHelper,
  swapLetterPositions,
} from './helpers';
import type {
  GameState,
  PalavreadoEngineState,
  PalavreadoLetterState,
  ScoringSummary,
  SessionState,
} from './types';

const INITIAL_SCORING_SUMMARY: ScoringSummary = {
  correctWords: [],
  extraWordsFound: [],
};

const INITIAL_SESSION: SessionState = {
  selection: null,
  swap: [],
  latestCorrectLettersCount: 0,
  letterScore: 0,
  scoringSummary: INITIAL_SCORING_SUMMARY,
};

/**
 * Drives a single day's Palavreado game: tile selection/swapping,
 * submission scoring, smart-shuffle hint usage, outcome transitions, and
 * local persistence.
 *
 * @param data - Today's Palavreado challenge payload.
 * @param initialState - Starting game state, usually restored via
 *   `getInitialState`.
 * @returns Everything the Palavreado screen needs to render and play.
 */
export function usePalavreadoEngine(
  data: DailyPalavreadoEntry,
  initialState: GameState,
): PalavreadoEngineState {
  const [state, setState] = useState<GameState>(initialState);
  const [session, setSession] = useState<SessionState>(INITIAL_SESSION);
  const [showResults, setShowResults] = useState(false);
  const size = data.keyword.length;

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is meant to trigger persistence
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  /**
   * Merges a partial session update into the current ephemeral state.
   *
   * @param next - Session fields to replace.
   */
  function updateSession(next: Partial<SessionState>) {
    setSession((previousSession) => ({ ...previousSession, ...next }));
  }

  /**
   * Swaps two tile positions on the board and records the interaction.
   *
   * @param firstIndex - First tile index.
   * @param secondIndex - Second tile index.
   */
  function commitSwap(firstIndex: number, secondIndex: number) {
    playSFX('swap');
    updateSession({
      selection: null,
      swap: [firstIndex, secondIndex],
    });
    setState((previousState) => ({
      ...previousState,
      letters: swapLetterPositions(
        previousState.letters,
        firstIndex,
        secondIndex,
      ),
      swaps: previousState.swaps + 1,
    }));
  }

  /**
   * Handles selecting a tile, deselecting it, or swapping it with a second
   * selected tile.
   *
   * @param index - Tile index the player tapped.
   */
  function selectLetter(index: number) {
    if (
      state.letters[index]?.locked ||
      getGameStatuses(state.status).isComplete
    ) {
      return;
    }

    if (session.selection === index) {
      playSFX('bubbleOut');
      updateSession({
        selection: null,
        swap: [],
      });
      return;
    }

    if (session.selection === null) {
      playSFX('select');
      updateSession({
        selection: index,
        swap: [],
      });
      return;
    }

    commitSwap(session.selection, index);
  }

  /**
   * Applies the one-time smart-shuffle hint when it is currently allowed.
   */
  function smartShuffle() {
    if (
      getGameStatuses(state.status).isComplete ||
      state.hearts <= 1 ||
      state.usedSmartShuffle
    ) {
      return;
    }

    playSFX('shuffle');
    updateSession({
      selection: null,
      swap: [],
    });
    setState((previousState) => ({
      ...previousState,
      letters: smartShuffleHelper(
        previousState.letters,
        previousState.guesses,
        size,
      ),
      usedSmartShuffle: true,
    }));
  }

  /**
   * Evaluates the current board, locking correct letters and words,
   * applying score/life changes, and transitioning to win/lose when needed.
   */
  function submitGrid() {
    const { isComplete } = getGameStatuses(state.status);
    if (isComplete) {
      return;
    }

    const answer = data.words.join('');
    const nextLetters = state.letters.map((letter) => ({ ...letter }));
    const originalLetters = state.letters.map((letter) => ({ ...letter }));
    const currentHearts = state.hearts;
    let letterScore = 0;
    let latestCorrectLettersCount = 0;
    let correctWordsScore = 0;
    let secretWordsScore = 0;
    let swapPenalty = 0;

    nextLetters.forEach((letter, index) => {
      if (letter.state === 'idle' && letter.letter === answer[index]) {
        letter.state = String(
          Math.floor(index / size),
        ) as PalavreadoLetterState;
        letter.locked = true;
        letterScore += currentHearts;
        latestCorrectLettersCount += 1;
      }
    });

    const generatedWords = buildWordsFromLetters(nextLetters, size);
    const correctWords: string[] = [];
    const extraWordsFound: string[] = [];

    generatedWords.forEach((word) => {
      if (data.scoringWords.includes(word)) {
        secretWordsScore += PALAVREADO_SECRET_WORD_SCORE;
        extraWordsFound.push(word);
      }
    });

    generatedWords.forEach((word, wordIndex) => {
      if (data.words[wordIndex] !== word) {
        return;
      }

      const rowStartIndex = wordIndex * size;
      const wasAlreadyCorrect = Array.from(
        { length: size },
        (_, offset) => rowStartIndex + offset,
      ).every((index) => originalLetters[index]?.locked);

      word.split('').forEach((_, offset) => {
        nextLetters[rowStartIndex + offset] = {
          ...nextLetters[rowStartIndex + offset],
          state: String(wordIndex) as PalavreadoLetterState,
          locked: true,
        };
      });

      if (!wasAlreadyCorrect) {
        correctWords.push(word);
        correctWordsScore += PALAVREADO_WORD_SCORE;
      }
    });

    const isWin = nextLetters.every((letter) => letter.locked);
    const updatedHearts = isWin ? currentHearts : currentHearts - 1;
    const isLose = !isWin && updatedHearts <= 0;

    if (isWin) {
      swapPenalty -= state.swaps;
      playSFX('win');
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
    } else {
      if (isLose) {
        swapPenalty -= state.swaps;
        logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'lose'));
      }
      playSFX(isLose ? 'lose' : 'wrong');
      vibrate(isLose ? 'lose' : 'wrong');
    }

    updateSession({
      selection: null,
      swap: [],
      latestCorrectLettersCount,
      letterScore,
      scoringSummary: {
        correctWords,
        extraWordsFound,
      },
    });

    setState((previousState) => ({
      ...previousState,
      guesses: [...previousState.guesses, generatedWords],
      letters: nextLetters,
      hearts: updatedHearts,
      score:
        previousState.score +
        letterScore +
        correctWordsScore +
        secretWordsScore +
        swapPenalty,
      progress: calculateProgress(nextLetters, size),
      status: isWin
        ? GAME_LIFECYCLE_STATUS.WIN
        : isLose
          ? GAME_LIFECYCLE_STATUS.LOSE
          : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
    }));
  }

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);

  useAutoShowResults(isComplete, setShowResults);

  return {
    hearts: state.hearts,
    letters: state.letters,
    guesses: state.guesses,
    swaps: state.swaps,
    usedSmartShuffle: state.usedSmartShuffle,
    selection: session.selection,
    swap: session.swap,
    showResults,
    setShowResults,
    isWin,
    isLose,
    isComplete,
    selectLetter,
    submitGrid,
    smartShuffle,
    keyword: data.keyword,
    size,
    words: data.words,
    score: state.score,
    progress: state.progress,
    latestCorrectLettersCount: session.latestCorrectLettersCount,
    letterScore: session.letterScore,
    scoringSummary: session.scoringSummary,
  };
}
