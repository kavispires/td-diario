import { useState } from 'react';
import type { DailyConexoesEntry } from 'types/games';
import { ConexoesGame } from './components/ConexoesGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyConexoesGame} component.
 */
type DailyConexoesGameProps = {
  /**
   * Today's Conexões payload, as resolved by `GameScreen`.
   */
  data: DailyConexoesEntry;
};

/**
 * Resolves today's persisted Conexões state, then delegates the full game UI
 * to {@link ConexoesGame}.
 *
 * @param props Today's Conexões payload.
 * @returns The rendered Conexões game.
 */
export function DailyConexoesGame({ data }: DailyConexoesGameProps) {
  const [initialState] = useState(() => getInitialState(data));

  return (
    <ConexoesGame
      data={data}
      initialState={initialState}
    />
  );
}
