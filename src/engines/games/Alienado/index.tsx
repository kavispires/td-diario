import { useState } from 'react';
import type { DailyAlienadoEntry } from 'types/games';
import { AlienadoGame } from './components/AlienadoGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyAlienadoGame} component.
 */
type DailyAlienadoGameProps = {
  /**
   * Today's Alienado payload, as resolved by `GameScreen`.
   */
  data: DailyAlienadoEntry;
};

/**
 * Restores Alienado's persisted daily state, then delegates the full
 * interactive experience to {@link AlienadoGame}.
 *
 * @param props Today's Alienado payload.
 * @returns The rendered Alienado game wrapper.
 */
export function DailyAlienadoGame({ data }: DailyAlienadoGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <AlienadoGame
      data={data}
      initialState={initialState}
    />
  );
}
