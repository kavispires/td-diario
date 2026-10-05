import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Text } from '@components/ui/Typography';
import { buildShare } from '../utils/helpers';
import { WarehouseGoodItem } from './WarehouseGoodItem';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the player solved every order correctly.
   */
  win: boolean;
  /**
   * Theme title shown for today's warehouse.
   */
  orders: string[];
  /**
   * Hearts remaining at the end of the game.
   */
  hearts: number;
  /**
   * Total hearts available at the start of the game.
   */
  totalHearts: number;
  /**
   * Per-attempt correctness rows aligned to the submitted orders.
   */
  evaluations: boolean[][];
  /**
   * Final score accumulated by the player.
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
 * Fullscreen, game-colored splash shown when Estoquista ends in a win or
 * loss, summarizing the run and offering either dismissal or a trip back to
 * the hub.
 *
 * @param props Result data and dismissal handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  orders,
  hearts,
  totalHearts,
  evaluations,
  score,
  challengeNumber,
  onClose,
}: ResultsSplashProps) {
  const share = buildShare({
    challengeNumber,
    hearts,
    totalHearts,
    evaluations,
  });
  const totalOrders = evaluations[0]?.length ?? 0;
  const bestAttempt = evaluations.reduce((best, attempt) => {
    const correctOrders = attempt.filter(Boolean).length;

    return Math.max(best, correctOrders);
  }, 0);

  return (
    <GameResultsSplash
      gameId="estoquista"
      title={win ? 'Funcionário do Mês!' : 'O estoque te venceu hoje'}
      share={share}
      onClose={onClose}
    >
      <div className="flex w-full max-w-xs flex-col gap-4 text-center">
        <Text>
          {win
            ? 'Você organizou e separou todos os pedidos do galpão de hoje.'
            : 'O galpão de hoje era este:'}
        </Text>
      </div>

      <ul className="flex w-full max-w-xs justify-center gap-2 text-center">
        {orders.map((goodId, index) => (
          <li key={index}>
            <WarehouseGoodItem
              goodId={goodId}
              width={48}
              className="p-1 border-none shadow-none"
            />
          </li>
        ))}
      </ul>

      <Hearts
        remaining={hearts}
        total={totalHearts}
        emptyClassName="text-black"
        filledClassName="text-black"
      />

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center text-black"
        >
          Melhor envio: {bestAttempt}/{totalOrders} pedidos
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
