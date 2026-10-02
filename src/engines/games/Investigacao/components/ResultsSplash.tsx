import { GameLogos } from '@components/hub/GameLogos';
import { Button } from '@components/ui/Button';
import { Pill } from '@components/ui/Pill';
import { Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { cn } from '@utils/cn';
import { withAlpha } from '@utils/helpers';
import { Heart, Search, UserRoundCheck } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DailyInvestigacaoSuspect } from 'types/games';
import { getFeatureLabel } from '../utils/helpers';
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
  onClose,
}: ResultsSplashProps) {
  const navigate = useNavigate();
  const gameInfo = gameInfos.investigacao;

  return (
    <div
      className="fixed inset-0 z-100 overflow-y-auto px-6 py-8"
      style={{ backgroundColor: withAlpha(gameInfo.color, 0.96) }}
    >
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center gap-4">
        <div className="h-16 w-16">
          <GameLogos
            gameId="investigacao"
            className="h-full w-full drop-shadow-sm"
          />
        </div>

        <Pill
          className={cn(
            'px-4 py-2 text-sm shadow-sm',
            win ? 'bg-gold text-chrome' : 'bg-white/85 text-foreground',
          )}
        >
          {win ? 'Caso encerrado' : 'Culpado solto'}
        </Pill>

        <Title
          level={2}
          className="text-center"
        >
          {win ? 'Parabéns!' : 'Que pena!'}
        </Title>

        <Text
          type="secondary"
          className="text-center"
        >
          {win
            ? 'Você identificou corretamente quem deveria ficar por último.'
            : 'O suspeito errado foi liberado e o criminoso escapou.'}
        </Text>

        <div
          className={cn(
            'flex w-full flex-col items-center gap-4 rounded-[2rem] px-5 py-5 shadow-sm',
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
        </div>

        <div className="grid w-full grid-cols-3 gap-3">
          <ResultStat
            icon={UserRoundCheck}
            label="Inocentes"
            value={`${releasedCount}/${Math.max(totalSuspects - 1, 0)}`}
          />
          <ResultStat
            icon={Heart}
            label="Dicas"
            value={`${hearts}/${totalHearts}`}
          />
          <ResultStat
            icon={Search}
            label="Suspeitos"
            value={`${totalSuspects}`}
          />
        </div>

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

/**
 * Props accepted by the {@link ResultStat} component.
 */
type ResultStatProps = {
  /**
   * Icon shown above the stat label.
   */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /**
   * Small label describing the stat.
   */
  label: string;
  /**
   * Value shown for the stat.
   */
  value: string;
};

function ResultStat({ icon: Icon, label, value }: ResultStatProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-[1.5rem] bg-white/80 px-3 py-4 text-center shadow-sm">
      <Icon
        className="h-4 w-4 text-primary"
        aria-hidden="true"
      />
      <Text
        strong
        className="text-sm"
      >
        {value}
      </Text>
      <Text
        type="secondary"
        className="text-xs"
      >
        {label}
      </Text>
    </div>
  );
}
