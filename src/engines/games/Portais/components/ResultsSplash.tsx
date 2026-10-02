import { Hearts } from '@components/games/Hearts';
import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { withAlpha } from '@utils/helpers';
import { useNavigate } from 'react-router-dom';
import type { DailyPortaisCorridor } from 'types/games';
import { gameInfo, Logo } from '../info';
import { getTotalMoves } from '../utils/helpers';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the player solved every corridor before running out of hearts.
   */
  win: boolean;
  /**
   * Remaining hearts at the end of the run.
   */
  hearts: number;
  /**
   * Corridors that made up today's challenge.
   */
  corridors: DailyPortaisCorridor[];
  /**
   * Index of the corridor the engine was on when the run ended.
   */
  currentCorridorIndex: number;
  /**
   * Move count tracked for each corridor.
   */
  moves: number[];
  /**
   * Suggested move target for the whole run.
   */
  goal: number;
  /**
   * Final score accumulated across solved corridors.
   */
  score: number;
  /**
   * Called to dismiss the splash and return to the completed board.
   */
  onClose: () => void;
};

/**
 * Fullscreen Portais results splash shown after the game ends: recaps
 * which corridors were cleared, surfaces the final move count and score,
 * and offers to either return to the Hub or close the overlay.
 *
 * @param props Result state, recap data, and the close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  hearts,
  corridors,
  currentCorridorIndex,
  moves,
  goal,
  score,
  onClose,
}: ResultsSplashProps) {
  const navigate = useNavigate();
  const totalMoves = getTotalMoves(moves);
  const solvedCorridors = win ? corridors.length : currentCorridorIndex;

  return (
    <div
      className="fixed inset-0 z-100 overflow-y-auto px-6 py-8"
      style={{ backgroundColor: withAlpha(gameInfo.color, 0.96) }}
    >
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center gap-4">
        <div className="h-16 w-16">
          <Logo className="h-full w-full drop-shadow-sm" />
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
            ? 'Você atravessou todos os portais do dia.'
            : 'Os portais se fecharam antes da última palavra-chave.'}
        </Text>

        <Hearts
          remaining={hearts}
          total={4}
        />

        <div className="grid w-full gap-3">
          {corridors.map((corridor, index) => {
            const solved = index < solvedCorridors;

            return (
              <div
                key={corridor.passcode}
                className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[1.75rem] bg-white/75 px-4 py-3 shadow-sm"
              >
                <div className="min-w-0">
                  <Text
                    strong
                    className="block text-sm text-subtle-foreground"
                  >
                    Corredor {index + 1}
                  </Text>
                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold uppercase ${
                      solved
                        ? 'bg-gold-soft text-foreground'
                        : 'bg-surface-raised text-subtle-foreground'
                    }`}
                  >
                    {corridor.passcode}
                  </span>
                </div>

                <div className="text-right">
                  <Text
                    strong
                    className="block"
                  >
                    {moves[index] ?? 0} mov.
                  </Text>
                  <Text
                    type="secondary"
                    className="text-xs"
                  >
                    {solved ? 'Acertou' : 'Não concluiu'}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`flex w-full flex-col items-center gap-2 rounded-[2rem] px-5 py-4 text-center shadow-sm ${
            win ? 'bg-gold-soft' : 'bg-white/70'
          }`}
        >
          <Text strong>Pontuação final: {score}</Text>
          <Text type="secondary">
            {totalMoves} de {goal} movimentos projetados
          </Text>
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
