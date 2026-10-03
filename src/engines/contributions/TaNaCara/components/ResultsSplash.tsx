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
   * Final score accumulated from all marked answers.
   */
  score: number;
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
 * @param props Saved question summaries, final score, and close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  questions,
  score,
  onClose,
}: ResultsSplashProps) {
  const markedAnswers = useMemo(
    () =>
      questions.reduce(
        (total, question) =>
          total + question.relatedNames.length + question.unrelatedNames.length,
        0,
      ),
    [questions],
  );

  return (
    <GameResultsSplash
      gameId="ta-na-cara"
      title="Respostas enviadas!"
      onClose={onClose}
    >
      <Text
        strong
        className="text-center"
      >
        {questions.length} depoimentos respondidos e {markedAnswers} julgamentos
        registrados
      </Text>

      <Text
        type="secondary"
        className="text-center"
      >
        Valeu pela contribuição — essas marcações ajudam o TD a calibrar futuros
        desafios.
      </Text>

      <div className="grid w-full gap-3">
        {questions.map((question, index) => (
          <div
            key={question.testimonyId}
            className="rounded-3xl bg-white/70 p-4 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <Text strong>#{index + 1}</Text>
              <Text className="text-right text-sm">{question.question}</Text>
            </div>

            <div className="grid gap-2">
              <div>
                <Text
                  strong
                  className="text-sm text-foreground"
                >
                  Sim
                </Text>
                <div className="mt-1 flex flex-wrap gap-2">
                  {question.relatedNames.length > 0 ? (
                    question.relatedNames.map((name) => (
                      <span
                        key={`${question.testimonyId}-yes-${name}`}
                        className="rounded-full bg-primary-soft px-3 py-1 text-sm font-medium text-primary"
                      >
                        {name}
                      </span>
                    ))
                  ) : (
                    <Text
                      type="secondary"
                      className="text-sm"
                    >
                      Nenhum.
                    </Text>
                  )}
                </div>
              </div>

              <div>
                <Text
                  strong
                  className="text-sm text-foreground"
                >
                  Não
                </Text>
                <div className="mt-1 flex flex-wrap gap-2">
                  {question.unrelatedNames.length > 0 ? (
                    question.unrelatedNames.map((name) => (
                      <span
                        key={`${question.testimonyId}-no-${name}`}
                        className="rounded-full bg-chrome/10 px-3 py-1 text-sm font-medium text-chrome"
                      >
                        {name}
                      </span>
                    ))
                  ) : (
                    <Text
                      type="secondary"
                      className="text-sm"
                    >
                      Nenhum.
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Text
        type="secondary"
        className="text-center"
      >
        Pontuação final: {score}
      </Text>
    </GameResultsSplash>
  );
}
