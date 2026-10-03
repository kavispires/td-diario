import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import type { DailyAlienadoAttribute, DailyAlienadoRequest } from 'types/games';
import { ALIENADO_GAME_ID, ALIENADO_RESULTS_LAYOUT } from '../utils/constants';
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
      gameId={ALIENADO_GAME_ID}
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

      <Hearts
        remaining={hearts}
        total={requests.length}
        emptyClassName="text-black"
      />

      <Surface className="w-full space-y-3 bg-white/70 p-4">
        <Text
          strong
          className="block text-center"
        >
          Dicionário alienígena-português
        </Text>

        <div className="space-y-3">
          {attributes.map((attribute) => (
            <div
              key={attribute.id}
              className="flex items-center gap-3 rounded-2xl bg-white/60 p-3"
            >
              <AlienSign
                signId={attribute.spriteId}
                width={ALIENADO_RESULTS_LAYOUT.attributeSignWidth}
              />

              <div className="min-w-0">
                <Text strong>{attribute.name}</Text>
                <Text
                  type="secondary"
                  className="text-sm"
                >
                  , {attribute.description}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </Surface>

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center"
        >
          {guesses.length} tentativas
        </Text>

        <Divider orientation="vertical" />
        <Score value={score} />
      </div>
    </GameResultsSplash>
  );
}
