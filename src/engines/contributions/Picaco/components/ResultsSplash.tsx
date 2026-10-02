import { GameLogos } from '@components/hub/GameLogos';
import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { withAlpha } from '@utils/helpers';
import { useNavigate } from 'react-router-dom';
import type { DailyPicacoCard } from 'types/games';
import { countAcceptedDrawings } from '../utils/helpers';
import type { PicacoDrawing } from '../utils/types';
import { DrawingPreview } from './Canvas';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Prompt cards selected for today's run, in play order.
   */
  cards: DailyPicacoCard[];
  /**
   * Finished drawings collected for today's run.
   */
  drawings: PicacoDrawing[];
  /**
   * Score accumulated from drawings with enough strokes to be saved.
   */
  score: number;
  /**
   * Called to dismiss the splash and return to the completed game view.
   */
  onClose: () => void;
};

/**
 * Fullscreen Picaco results splash shown after the drawings finish saving:
 * it recaps how many prompts were completed, previews the sketches, and
 * offers to either return to the Hub or close the overlay.
 *
 * @param props Today's selected cards, drawings, score, and close handler.
 * @returns The rendered Picaco results splash.
 */
export function ResultsSplash({
  cards,
  drawings,
  score,
  onClose,
}: ResultsSplashProps) {
  const navigate = useNavigate();
  const gameInfo = gameInfos.picaco;
  const acceptedDrawings = countAcceptedDrawings(drawings);

  return (
    <div
      className="fixed inset-0 z-100 overflow-y-auto px-6 py-8"
      style={{ backgroundColor: withAlpha(gameInfo.color, 0.85) }}
    >
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center gap-4">
        <div className="h-16 w-16">
          <GameLogos
            gameId="picaco"
            className="h-full w-full drop-shadow-sm"
          />
        </div>

        <Title
          level={2}
          className="text-center"
        >
          Desenhos enviados!
        </Title>

        <Text
          strong
          className="text-center"
        >
          {acceptedDrawings} de {cards.length} desenhos foram aproveitados
        </Text>

        <Text
          type="secondary"
          className="text-center"
        >
          Quanto mais traços úteis você fizer, maior a chance de ajudar os
          desafios futuros.
        </Text>

        <div className="grid w-full gap-3">
          {cards.map((card, index) => {
            const drawing = drawings[index];

            return (
              <div
                key={card.id}
                className="grid grid-cols-[96px_1fr] gap-3 rounded-3xl bg-white/70 p-3 shadow-sm"
              >
                <DrawingPreview
                  drawing={drawing?.drawing ?? '[]'}
                  label={`Prévia do desenho para ${card.text}`}
                />

                <div className="flex min-w-0 flex-col justify-center gap-1">
                  <Text
                    strong
                    className="text-sm"
                  >
                    #{index + 1}
                  </Text>
                  <Text className="line-clamp-3 text-sm">{card.text}</Text>
                  <Text
                    type="secondary"
                    className="text-xs"
                  >
                    Nível {card.level}
                  </Text>
                </div>
              </div>
            );
          })}
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
