import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Text } from '@components/ui/Typography';
import type { DailyPicacoCard } from 'types/games';
import { countAcceptedDrawings } from '../utils/helpers';
import type { PicacoDrawing } from '../utils/types';

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
   * Called to dismiss the splash and return to the completed game view.
   */
  onClose: () => void;
};

/**
 * Fullscreen Picaco results splash shown after the drawings finish saving:
 * it recaps how many prompts were completed, previews the sketches, and
 * offers to either return to the Hub or close the overlay.
 *
 * @param props Today's selected cards, drawings, and close handler.
 * @returns The rendered Picaco results splash.
 */
export function ResultsSplash({
  cards,
  drawings,
  onClose,
}: ResultsSplashProps) {
  const acceptedDrawings = countAcceptedDrawings(drawings);
  const rejectedDrawings = Math.max(cards.length - acceptedDrawings, 0);

  return (
    <GameResultsSplash
      gameId="picaco"
      title="Desenhos enviados!"
      onClose={onClose}
      hideShare
    >
      <Text
        type="secondary"
        className="text-center"
      >
        Quanto mais traços úteis você fizer, maior a chance de ajudar os
        desafios futuros.
      </Text>

      <Text className="text-center">
        {rejectedDrawings === 0
          ? 'Todos os rabiscos passaram no corte mínimo'
          : `${rejectedDrawings} ${
              rejectedDrawings === 1 ? 'rabisco ficou' : 'rabiscos ficaram'
            } curtos demais para entrar no banco`}
      </Text>
    </GameResultsSplash>
  );
}
