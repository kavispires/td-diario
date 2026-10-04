import { useState } from 'react';
import type { DailyPicacoEntry } from 'types/games';
import { PicacoGame } from './components/PicacoGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyPicacoGame} component.
 */
type DailyPicacoGameProps = {
  /**
   * Today's Picaco payload, as resolved by `GameScreen`.
   */
  data: DailyPicacoEntry;
};

/**
 * Prepares Picaco's per-day initial state, then delegates the full gameplay
 * flow to {@link PicacoGame}.
 *
 * @param props Today's Picaco payload.
 * @returns The rendered Picaco game.
 */
export function DailyPicacoGame({ data }: DailyPicacoGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <PicacoGame
      data={data}
      initialState={initialState}
    />
  );
}
