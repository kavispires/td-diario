import { useState } from 'react';
import type { DailyQuartetosEntry } from 'types/games';
import { QuartetosGame } from './components/QuartetosGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyQuartetosGame} component.
 */
type DailyQuartetosGameProps = {
  /**
   * Dynamic payload resolved by `GameScreen` for today's Quartetos route.
   */
  data: DailyQuartetosEntry;
};

/**
 * Renders Quartetos with fully narrowed data and delegates the full game body
 * to {@link QuartetosGame}.
 *
 * @param props Today's Quartetos payload.
 * @returns The rendered game UI.
 */
export function DailyQuartetosGame({ data }: DailyQuartetosGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <QuartetosGame
      data={data}
      initialState={initialState}
    />
  );
}
