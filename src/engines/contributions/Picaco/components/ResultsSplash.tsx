import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Text } from '@components/ui/Typography';
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
  const acceptedDrawings = countAcceptedDrawings(drawings);

  return (
    <GameResultsSplash
      gameId="picaco"
      title="Desenhos enviados!"
      onClose={onClose}
    >
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
    </GameResultsSplash>
  );
}
