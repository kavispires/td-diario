import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import type { DailyPirralhosKidEntry } from 'types/games';
import type { KidProfile } from '../utils/constants';
import { KIDS_LIBRARY, PIRRALHOS_TOTAL_HEARTS } from '../utils/constants';
import { buildShareText } from '../utils/helpers';
import { KidPortrait } from './KidPortrait';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the mystery ended in a solved state.
   */
  win: boolean;
  /**
   * Remaining accusation attempts after the final guess.
   */
  hearts: number;
  /**
   * Today's sequential challenge number, used in the shareable result.
   */
  challengeNumber: number;
  /**
   * Current score shown in the recap.
   */
  score: number;
  /**
   * Id of the kid who actually took the toy.
   */
  culpritId: string;
  /**
   * Ids of the kids whose statements were lies.
   */
  liarsIds: string[];
  /**
   * Ordered list of visible kids for today's mystery.
   */
  kids: DailyPirralhosKidEntry[];
  /**
   * Called to dismiss the splash and return to the completed board.
   */
  onClose: () => void;
};

/**
 * Fullscreen Pirralhos results splash shown after the player wins or loses:
 * it reveals the culprit, lists the liars, and offers either returning to
 * the Hub or closing the overlay.
 *
 * @param props Result state, recap data, and the close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  hearts,
  challengeNumber,
  score,
  culpritId,
  liarsIds,
  kids,
  onClose,
}: ResultsSplashProps) {
  const shareText = buildShareText({
    challengeNumber,
    hearts,
  });
  const culprit = KIDS_LIBRARY[culpritId];
  const liars = kids
    .filter((kidEntry) => liarsIds.includes(kidEntry.kidId))
    .map((kidEntry) => KIDS_LIBRARY[kidEntry.kidId])
    .filter((kid): kid is KidProfile => !!kid);

  return (
    <GameResultsSplash
      gameId="pirralhos"
      title={win ? 'Parabéns!' : 'Que pena!'}
      shareText={shareText}
      onClose={onClose}
    >
      <Text
        strong
        className="text-center"
      >
        {win
          ? `Você descobriu que ${culprit?.name.pt ?? 'o pirralho certo'} pegou o brinquedo.`
          : `Quem pegou o brinquedo hoje foi ${culprit?.name.pt ?? 'um dos pirralhos'}.`}
      </Text>

      {culprit && (
        <Surface className="flex w-full flex-col items-center gap-3 bg-white/70 px-5 py-5 text-center">
          <KidPortrait
            kid={culprit}
            width={96}
          />

          {liars.length === 0 && (
            <Text
              type="secondary"
              className="text-center"
            >
              Ninguém mentiu hoje.
            </Text>
          )}

          {liars.length > 0 && (
            <div className="flex flex-col">
              <Text
                strong
                className="text-center"
              >
                Quem estava mentindo
              </Text>

              <div className="flex flex-wrap justify-center gap-2">
                {liars.map((kid) => (
                  <div
                    key={kid.id}
                    className="flex flex-col items-center"
                  >
                    <KidPortrait
                      kid={kid}
                      width={48}
                      className="rounded-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Surface>
      )}

      <Hearts
        remaining={hearts}
        total={PIRRALHOS_TOTAL_HEARTS}
        emptyClassName="text-black"
        filledClassName="text-black"
      />

      <div className="flex items-center justify-center gap-2">
        <Score
          value={score}
          className="text-black"
        />
      </div>
    </GameResultsSplash>
  );
}
