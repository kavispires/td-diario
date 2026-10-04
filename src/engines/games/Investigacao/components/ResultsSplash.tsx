import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import type { DailyInvestigacaoSuspect } from 'types/games';
import { buildShareText, getFeatureLabel } from '../utils/helpers';
import { SuspectPortrait } from './SuspectPortrait';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the player solved the case.
   */
  win: boolean;
  /**
   * Culprit that remained for the final reveal.
   */
  culprit: DailyInvestigacaoSuspect;
  /**
   * Crime summary shown under the culprit reveal.
   */
  reason: string;
  /**
   * Remaining extra clues at the end of the run.
   */
  hearts: number;
  /**
   * Total extra clues available at the start of the run.
   */
  totalHearts: number;
  /**
   * Number of innocents released during the run.
   */
  releasedCount: number;
  /**
   * Total suspects shown in today's lineup.
   */
  totalSuspects: number;
  /**
   * Final score achieved for the case.
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
 * Fullscreen Investigação results splash shown after a win or loss: reveals
 * the culprit, restates the crime, and offers to either revisit the board
 * or return to the Hub.
 *
 * @param props Result state, culprit data, and close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  culprit,
  reason,
  hearts,
  totalHearts,
  releasedCount,
  totalSuspects,
  score,
  challengeNumber,
  onClose,
}: ResultsSplashProps) {
  const releaseGoal = Math.max(totalSuspects - 1, 0);
  const shareText = buildShareText({
    challengeNumber,
    hearts,
    totalHearts,
    releasedCount,
    totalSuspects,
  });

  return (
    <GameResultsSplash
      gameId="investigacao"
      title={win ? 'Capturado!' : 'Que pena!'}
      shareText={shareText}
      onClose={onClose}
    >
      <Surface className="flex w-full flex-col items-center gap-4 bg-white/35 p-4">
        <div className="flex w-full justify-center items-center gap-4">
          <SuspectPortrait
            suspectId={culprit.id}
            alt={`Retrato de ${culprit.name.pt}`}
            className="w-40"
          />

          <div className="flex flex-col text-sm">
            <Text strong>
              {win
                ? `O culpado era ${culprit.name.pt}.`
                : `${culprit.name.pt} era a pessoa que deveria ter ficado por último.`}
            </Text>

            <Text> Crime: {reason}</Text>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {culprit.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-white/85 px-3 py-1 text-xs text-foreground shadow-sm"
            >
              {getFeatureLabel(feature, culprit.gender)}
            </span>
          ))}
        </div>
      </Surface>

      <Hearts
        remaining={hearts}
        total={totalHearts}
        emptyClassName="text-black"
      />

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center text-black"
        >
          {releasedCount} de {releaseGoal} inocentes liberados
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
