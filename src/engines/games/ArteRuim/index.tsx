import { useState } from 'react';
import type { DailyArteRuimEntry } from 'types/games';
import { ArteRuimGame } from './components/ArteRuimGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyArteRuimGame} component.
 */
type DailyArteRuimGameProps = {
  /**
   * Today's Arte Ruim payload, as resolved by `GameScreen`.
   */
  data: DailyArteRuimEntry;
};

/**
 * Prepares today's initial Arte Ruim state, then delegates rendering to the
 * extracted game body component.
 *
 * @param props Today's validated Arte Ruim payload.
 * @returns The rendered Arte Ruim game.
 */
export function DailyArteRuimGame({ data }: DailyArteRuimGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <ArteRuimGame
      data={data}
      initialState={initialState}
    />
  );
}
