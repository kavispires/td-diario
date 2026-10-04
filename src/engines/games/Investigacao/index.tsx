import { useState } from 'react';
import type { DailyInvestigacaoEntry } from 'types/games';
import { InvestigacaoGame } from './components/InvestigacaoGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyInvestigacaoGame} component.
 */
type DailyInvestigacaoGameProps = {
  /**
   * Today's Investigação payload, as resolved by `GameScreen`.
   */
  data: DailyInvestigacaoEntry;
};

/**
 * Initializes today's Investigação state and delegates the full game UI to
 * {@link InvestigacaoGame}.
 *
 * @param props Today's Investigação payload.
 * @returns The rendered Investigação game.
 */
export function DailyInvestigacaoGame({ data }: DailyInvestigacaoGameProps) {
  const [initialState] = useState(() => getInitialState(data));

  return (
    <InvestigacaoGame
      data={data}
      initialState={initialState}
    />
  );
}
