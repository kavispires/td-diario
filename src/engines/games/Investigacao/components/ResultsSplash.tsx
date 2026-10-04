import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Surface } from '@components/ui/Surface';
import { Text, Title } from '@components/ui/Typography';
import { cn } from '@utils/cn';
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
      title={win ? 'Parabéns!' : 'Que pena!'}
      shareText={shareText}
      onClose={onClose}
    >
      <Text
        strong
        className="text-center text-black"
      >
        {win
          ? `O culpado era ${culprit.name.pt}.`
          : `${culprit.name.pt} era a pessoa que deveria ter ficado por último.`}
      </Text>

      <Surface
        className={cn(
          'flex w-full flex-col items-center gap-4 px-5 py-5',
          win ? 'bg-gold-soft' : 'bg-white/75',
        )}
      >
        <SuspectPortrait
          suspectId={culprit.id}
          alt={`Retrato de ${culprit.name.pt}`}
          className="w-40"
        />

        <div className="flex flex-col items-center gap-1 text-center">
          <Title level={4}>{culprit.name.pt}</Title>
          <Text type="secondary">
            {win
              ? 'Você identificou corretamente quem deveria ficar por último.'
              : 'O suspeito errado foi liberado e o criminoso escapou.'}
          </Text>
          <Text strong>Crime: {reason}</Text>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {culprit.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-foreground shadow-sm"
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
