import { useState } from 'react';
import type { DailyVitraisInfinitosEntry } from 'types/games';
import { VitraisInfinitosGame } from './components/VitraisInfinitosGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyVitraisInfinitosGame} component.
 */
type DailyVitraisInfinitosGameProps = {
  /**
   * Today's Vitrais Infinitos payload, as resolved by `GameScreen`.
   */
  data: DailyVitraisInfinitosEntry;
};

/**
 * Initializes today's Vitrais Infinitos state, then delegates rendering of
 * the draggable stained-glass puzzle, progress stats, and results splash.
 *
 * @param props Today's Vitrais Infinitos payload.
 * @returns The rendered Vitrais Infinitos game.
 */
export function DailyVitraisInfinitosGame({
  data,
}: DailyVitraisInfinitosGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <VitraisInfinitosGame
      data={data}
      initialState={initialState}
    />
  );
}
