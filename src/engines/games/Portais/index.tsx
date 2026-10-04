import { useState } from 'react';
import type { DailyPortaisEntry } from 'types/games';
import { PortaisGame } from './components/PortaisGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyPortaisGame} component.
 */
type DailyPortaisGameProps = {
  /**
   * Today's Portais payload, as resolved by `GameScreen`.
   */
  data: DailyPortaisEntry;
};

/**
 * Resolves today's initial Portais state and delegates rendering to
 * {@link PortaisGame}.
 *
 * @param props Today's Portais payload.
 * @returns The rendered Portais game.
 */
export function DailyPortaisGame({ data }: DailyPortaisGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <PortaisGame
      data={data}
      initialState={initialState}
    />
  );
}
