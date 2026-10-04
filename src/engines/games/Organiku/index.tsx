import { useState } from 'react';
import type { DailyOrganikuEntry } from '../../../types/games';
import { OrganikuGame } from './components/OrganikuGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyOrganikuGame} component.
 */
type DailyOrganikuGameProps = {
  /**
   * Today's Organiku payload, as resolved by `GameScreen`.
   */
  data: DailyOrganikuEntry;
};

/**
 * Prepares today's Organiku initial state, then delegates rendering to
 * {@link OrganikuGame}.
 *
 * @param props Today's Organiku payload.
 * @returns The rendered Organiku game.
 */
export function DailyOrganikuGame({ data }: DailyOrganikuGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <OrganikuGame
      data={data}
      initialState={initialState}
    />
  );
}
