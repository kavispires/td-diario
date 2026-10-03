import { DailyItem } from '@components/games/DailyItem';
import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import type { DailyAlienadoAttribute, DailyAlienadoRequest } from 'types/games';
import { buildShareText } from '../utils/helpers';
import { AlienSign } from './AlienSign';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the player solved the full request list.
   */
  win: boolean;
  /**
   * Remaining hearts at the end of the game.
   */
  hearts: number;
  /**
   * Final request list with the correct requested items.
   */
  requests: DailyAlienadoRequest[];
  /**
   * Attribute dictionary used to explain the alien symbols after the round.
   */
  attributes: DailyAlienadoAttribute[];
  /**
   * Previous submitted guesses, split into ordered item-id arrays.
   */
  guesses: string[][];
  /**
   * Final encoded solution in the original slot order.
   */
  solution: string;
  /**
   * Final score recorded for the day.
   */
  score: number;
  /**
   * Today's sequential challenge number, used in the shareable result.
   */
  challengeNumber: number;
  /**
   * Called to dismiss the splash and return to the completed board.
   */
  onClose: () => void;
};

/**
 * Fullscreen, game-colored splash shown when Alienado ends in a win or loss:
 * it reveals the correct requested items, decodes the symbols again, and
 * offers to either return to the Hub or close the overlay.
 *
 * @param props Result state, recap data, and the close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  hearts,
  requests,
  attributes,
  guesses,
  solution,
  score,
  challengeNumber,
  onClose,
}: ResultsSplashProps) {
  const shareText = buildShareText({
    challengeNumber,
    hearts,
    guesses,
    solution,
  });

  return (
    <GameResultsSplash
      gameId="alienado"
      title={win ? 'Parabéns!' : 'Que pena!'}
      shareText={shareText}
      onClose={onClose}
    >
      <Text
        strong
        className="text-center"
      >
        {win
          ? 'O alienígena levou exatamente o que queria.'
          : 'O alienígena foi embora decepcionado com as entregas.'}
      </Text>

      <Text
        type="secondary"
        className="text-center"
      >
        {hearts} de {requests.length} corações restantes • {guesses.length}{' '}
        tentativas • {score} pontos
      </Text>

      <div className="grid w-full grid-cols-2 gap-3">
        {requests.map((request, index) => (
          <div
            key={request.itemId}
            className="flex flex-col items-center gap-3 rounded-3xl bg-white/70 p-3 shadow-sm"
          >
            <Text strong>Pedido {index + 1}</Text>

            <div className="flex items-center gap-2">
              {request.spritesIds.map((spriteId) => (
                <AlienSign
                  key={`${request.itemId}-${spriteId}`}
                  signId={spriteId}
                  width={46}
                />
              ))}
            </div>

            <div className="rounded-2xl bg-gold-soft p-1">
              <DailyItem
                itemId={request.itemId}
                width={60}
                padding={4}
              />
            </div>
          </div>
        ))}
      </div>

      <Surface className="w-full space-y-3 bg-white/70 p-4">
        <Text strong>Dicionário alienígena</Text>

        <div className="space-y-3">
          {attributes.map((attribute) => (
            <div
              key={attribute.id}
              className="flex items-start gap-3 rounded-2xl bg-white/60 p-3"
            >
              <AlienSign
                signId={attribute.spriteId}
                width={44}
              />

              <div className="min-w-0 space-y-1">
                <Text strong>{attribute.name}</Text>
                <Text
                  type="secondary"
                  className="block text-sm"
                >
                  {attribute.description}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </Surface>

      {guesses.length > 0 && (
        <Surface className="w-full space-y-3 bg-white/70 p-4">
          <Text strong>Tentativas enviadas</Text>

          <div className="space-y-2">
            {guesses.map((guess, guessIndex) => (
              <div
                key={`${guess.join('-')}-${guessIndex}`}
                className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-white/60 p-3"
              >
                {guess.map((itemId, itemIndex) => (
                  <DailyItem
                    key={`${itemId}-${itemIndex}`}
                    itemId={itemId}
                    width={38}
                    padding={3}
                  />
                ))}
              </div>
            ))}
          </div>
        </Surface>
      )}
    </GameResultsSplash>
  );
}
