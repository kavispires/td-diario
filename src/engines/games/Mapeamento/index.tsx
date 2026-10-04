import { useState } from 'react';
import type { DailyMapeamentoEntry } from 'types/games';
import { MapeamentoGame } from './components/MapeamentoGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyMapeamentoGame} component.
 */
type DailyMapeamentoGameProps = {
  /**
   * Today's Mapeamento payload, as resolved by `GameScreen`.
   */
  data: DailyMapeamentoEntry;
};

/**
 * Renders a full day of Mapeamento by restoring the persisted initial state
 * and delegating the interactive game body to {@link MapeamentoGame}.
 *
 * @param props Today's Mapeamento payload.
 * @returns The rendered Mapeamento game.
 */
export function DailyMapeamentoGame({ data }: DailyMapeamentoGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <MapeamentoGame
      data={data}
      initialState={initialState}
    />
  );
}
