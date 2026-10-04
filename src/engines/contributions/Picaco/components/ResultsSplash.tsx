import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Text } from '@components/ui/Typography';
import type { DailyPicacoCard } from 'types/games';
import { DRAWINGS_COUNT } from '../utils/constants';
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
  const rejectedDrawings = Math.max(cards.length - acceptedDrawings, 0);

  return (
    <GameResultsSplash
      gameId="picaco"
      title="Desenhos enviados!"
      onClose={onClose}
    >
      <div className="flex w-full max-w-xs flex-col gap-4 text-center">
        <Text strong>Os temas de hoje eram estes:</Text>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {cards.map((card) => (
            <span
              key={card.id}
              className="rounded-md bg-white/70 px-3 py-1 text-sm font-semibold text-black shadow-sm"
            >
              {card.text}
            </span>
          ))}
        </div>
      </div>

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

      <Hearts
        remaining={acceptedDrawings}
        total={Math.min(DRAWINGS_COUNT, cards.length)}
        emptyClassName="text-black"
        filledClassName="text-black"
      />

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center text-black"
        >
          {rejectedDrawings === 0
            ? 'Todos os rabiscos passaram no corte mínimo'
            : `${rejectedDrawings} ${
                rejectedDrawings === 1 ? 'rabisco ficou' : 'rabiscos ficaram'
              } curtos demais para entrar no banco`}
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
