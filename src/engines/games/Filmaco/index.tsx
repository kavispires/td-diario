import { useState } from 'react';
import type { DailyFilmacoEntry } from 'types/games';
import { FilmacoGame } from './components/FilmacoGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the Filmaco daily entrypoint.
 */
type DailyFilmacoGameProps = {
  /**
   * Today's Filmaco payload, validated by {@link isDailyFilmacoEntry}.
   */
  data: DailyFilmacoEntry;
};

/**
 * Restores Filmaco's initial per-day state, then delegates rendering to the
 * extracted game component.
 *
 * @param props Today's Filmaco payload.
 * @returns The rendered Filmaco game.
 */
export function DailyFilmacoGame({ data }: DailyFilmacoGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <FilmacoGame
      data={data}
      initialState={initialState}
    />
  );
}
