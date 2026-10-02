import { GameLogos } from '@components/hub/GameLogos';
import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { withAlpha } from '@utils/helpers';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const gameInfo = gameInfos['ta-na-cara'];

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
    <div
      className="fixed inset-0 z-100 overflow-y-auto px-6 py-8"
      style={{ backgroundColor: withAlpha(gameInfo.color, 0.85) }}
    >
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center gap-4">
        <div className="h-16 w-16">
          <GameLogos
            gameId="ta-na-cara"
            className="h-full w-full drop-shadow-sm"
          />
        </div>

        <Title
          level={2}
          className="text-center"
        >
          Respostas enviadas!
        </Title>

        <Text
          strong
          className="text-center"
        >
          {questions.length} depoimentos respondidos e {markedAnswers}{' '}
          julgamentos registrados
        </Text>

        <Text
          type="secondary"
          className="text-center"
        >
          Valeu pela contribuição — essas marcações ajudam o TD a calibrar
          futuros desafios.
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

        <div className="flex w-full flex-col gap-3 pt-2">
          <Button
            variant="primary"
            size="small"
            block
            onClick={() => navigate('/')}
          >
            Voltar ao Hub
          </Button>
          <Button
            variant="outlined"
            size="small"
            block
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
