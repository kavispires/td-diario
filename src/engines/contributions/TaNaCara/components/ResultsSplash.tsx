import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Text } from '@components/ui/Typography';
import { useMemo } from 'react';
import { MIN_REQUIRED_QUESTIONS } from '../utils/constants';
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
    >
      <div className="flex w-full max-w-xs flex-col gap-4 text-center">
        <Text strong>
          Estas foram as marcações que você enviou para os depoimentos de hoje.
        </Text>
      </div>

      <Hearts
        remaining={questions.length}
        total={MIN_REQUIRED_QUESTIONS}
        emptyClassName="text-black"
      />

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

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center text-black"
        >
          {answeredQuestionsLabel} e {markedAnswers} julgamentos registrados
        </Text>
        <Divider orientation="vertical" />
        <Score
          value={score}
          className="text-black"
        />
      </div>
    </GameResultsSplash>
  );
}
