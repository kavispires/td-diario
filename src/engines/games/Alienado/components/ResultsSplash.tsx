import { DailyItem } from '@components/games/DailyItem';
import { GameLogos } from '@components/hub/GameLogos';
import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { withAlpha } from '@utils/helpers';
import { useNavigate } from 'react-router-dom';
import type { DailyAlienadoAttribute, DailyAlienadoRequest } from 'types/games';
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
   * Final score recorded for the day.
   */
  score: number;
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
  score,
  onClose,
}: ResultsSplashProps) {
  const navigate = useNavigate();
  const info = gameInfos.alienado;

  return (
    <div
      className="fixed inset-0 z-100 overflow-y-auto px-6 py-8"
      style={{ backgroundColor: withAlpha(info.color, 0.96) }}
    >
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center gap-4">
        <div className="h-16 w-16">
          <GameLogos
            gameId="alienado"
            className="h-full w-full drop-shadow-sm"
          />
        </div>

        <Title
          level={2}
          className="text-center"
        >
          {win ? 'Parabéns!' : 'Que pena!'}
        </Title>

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

        <div className="w-full space-y-3 rounded-[2rem] bg-white/70 p-4 shadow-sm">
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
        </div>

        {guesses.length > 0 && (
          <div className="w-full space-y-3 rounded-[2rem] bg-white/70 p-4 shadow-sm">
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
          </div>
        )}

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
