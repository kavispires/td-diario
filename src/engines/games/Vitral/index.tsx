import { useState } from 'react';
import type { DailyVitralEntry } from 'types/games';
import { VitralGame } from './components/VitralGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyVitralGame} component.
 */
type DailyVitralGameProps = {
  /**
   * Today's Vitral payload, as resolved by `GameScreen`.
   */
  data: DailyVitralEntry;
};

/**
 * Resolves today's initial Vitral state, then renders the full game
 * experience.
 *
 * @param props Today's Vitral payload.
 * @returns The rendered Vitral game.
 */
export function DailyVitralGame({ data }: DailyVitralGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <VitralGame
      data={data}
      initialState={initialState}
    />
  );
}
