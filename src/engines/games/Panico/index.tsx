import { useState } from 'react';
import type { DailyPanicoEntry } from 'types/games';
import { PanicoGame } from './components/PanicoGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by {@link DailyPanicoGame}.
 */
type DailyPanicoGameProps = {
  /**
   * Today's Panico payload resolved by the shared game screen.
   */
  data: DailyPanicoEntry;
};

/**
 * Restores the persisted Panico progress state and delegates rendering to the
 * extracted game component.
 *
 * @param props Today's Panico payload.
 * @returns The rendered Panico game.
 */
export function DailyPanicoGame({ data }: DailyPanicoGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <PanicoGame
      data={data}
      initialState={initialState}
    />
  );
}
