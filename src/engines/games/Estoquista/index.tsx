import { useState } from 'react';
import type { DailyEstoquistaEntry } from 'types/games';
import { EstoquistaGame } from './components/EstoquistaGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyEstoquistaGame} component.
 */
type DailyEstoquistaGameProps = {
  /**
   * Today's Estoquista payload, as resolved by `GameScreen`.
   */
  data: DailyEstoquistaEntry;
};

/**
 * Restores today's Estoquista state and delegates the full interactive game
 * flow to {@link EstoquistaGame}.
 *
 * @param props Today's Estoquista payload.
 * @returns The rendered Estoquista game.
 */
export function DailyEstoquistaGame({ data }: DailyEstoquistaGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <EstoquistaGame
      data={data}
      initialState={initialState}
    />
  );
}
