import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Text } from '@components/ui/Typography';
import { useMemo } from 'react';
import type { TaNaCaraResultQuestion } from '../utils/types';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Answered Ta Na Cara questions, already resolved into display-ready names.
   */
  questions: TaNaCaraResultQuestion[];
  /**
   * Called to dismiss the splash and return to the completed game view.
   */
  onClose: () => void;
};

/**
 * Fullscreen Ta Na Cara results splash shown after the answers are saved: it
 * recaps how many testimonies were answered, lists the marked names, and
 * offers to either return to the Hub or close the overlay.
 *
 * @param props Saved question summaries and close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({ questions, onClose }: ResultsSplashProps) {
  const markedAnswers = useMemo(
    () =>
      questions.reduce(
        (total, question) =>
          total + question.relatedNames.length + question.unrelatedNames.length,
        0,
      ),
    [questions],
  );
  const answeredQuestionsLabel = useMemo(
    () =>
      `${questions.length} ${
        questions.length === 1
          ? 'depoimento respondido'
          : 'depoimentos respondidos'
      }`,
    [questions.length],
  );

  return (
    <GameResultsSplash
      gameId="ta-na-cara"
      title="Respostas enviadas!"
      onClose={onClose}
      hideShare
    >
      <Text className="text-center">
        {answeredQuestionsLabel} e {markedAnswers} julgamentos registrados
      </Text>
    </GameResultsSplash>
  );
}
