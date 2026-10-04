import { useState } from 'react';
import type { DailyPirralhosEntry } from 'types/games';
import { PirralhosGame } from './components/PirralhosGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyPirralhosGame} component.
 */
type DailyPirralhosGameProps = {
  /**
   * Today's Pirralhos payload, as resolved by `GameScreen`.
   */
  data: DailyPirralhosEntry;
};

/**
 * Renders a full day of Pirralhos by deriving the persisted starting state
 * and delegating the gameplay UI to {@link PirralhosGame}.
 *
 * @param props Today's Pirralhos payload.
 * @returns The rendered Pirralhos game.
 */
export function DailyPirralhosGame({ data }: DailyPirralhosGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <PirralhosGame
      data={data}
      initialState={initialState}
    />
  );
}
