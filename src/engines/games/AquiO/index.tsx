import { useState } from 'react';
import type { DailyAquiOEntry } from 'types/games';
import { AquiOGame } from './components/AquiOGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyAquiOGame} component.
 */
type DailyAquiOGameProps = {
  /**
   * Today's Aqui O payload, as resolved by `GameScreen`.
   */
  data: DailyAquiOEntry;
};

/**
 * Restores today's Aqui O state, then delegates the full interactive game
 * rendering to {@link AquiOGame}.
 *
 * @param props Today's Aqui O payload.
 * @returns The rendered Aqui O game.
 */
export function DailyAquiOGame({ data }: DailyAquiOGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <AquiOGame
      data={data}
      initialState={initialState}
    />
  );
}
