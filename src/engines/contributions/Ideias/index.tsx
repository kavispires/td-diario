import type { DailyIdeiasEntry } from 'types/games';
import { IdeiasGame } from './components/IdeiasGame';

/**
 * Props accepted by the {@link DailyIdeiasGame} component.
 */
type DailyIdeiasGameProps = {
  /**
   * Today's Ideias payload, as resolved by `GameScreen`.
   */
  data: DailyIdeiasEntry;
};

/**
 * Entry point for the Ideias contribution, delegating the full submission
 * flow to {@link IdeiasGame}.
 *
 * @param props Today's Ideias payload.
 * @returns The rendered Ideias game.
 */
export function DailyIdeiasGame({ data }: DailyIdeiasGameProps) {
  return <IdeiasGame data={data} />;
}
