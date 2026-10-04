import { useState } from 'react';
import type { DailyConjuntosEntry } from 'types/games';
import { ConjuntosGame } from './components/ConjuntosGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyConjuntosGame} component.
 */
type DailyConjuntosGameProps = {
  /**
   * Today's Conjuntos payload, as resolved by `GameScreen`.
   */
  data: DailyConjuntosEntry;
};

/**
 * Resolves today's initial Conjuntos state and delegates the full gameplay
 * experience to {@link ConjuntosGame}.
 *
 * @param props Today's Conjuntos payload.
 * @returns The rendered Conjuntos game.
 */
export function DailyConjuntosGame({ data }: DailyConjuntosGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <ConjuntosGame
      data={data}
      initialState={initialState}
    />
  );
}
