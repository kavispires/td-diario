import { useState } from 'react';
import type { DailyEpocasEntry } from 'types/games';
import { EpocasGame } from './components/EpocasGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyEpocasGame} component.
 */
type DailyEpocasGameProps = {
  /**
   * Dynamic payload resolved by `GameScreen` for today's Épocas route.
   */
  data: DailyEpocasEntry;
};

/**
 * Renders Épocas with fully narrowed data and delegates the full game body
 * to {@link EpocasGame}.
 *
 * @param props Today's Épocas payload.
 * @returns The rendered game UI.
 */
export function DailyEpocasGame({ data }: DailyEpocasGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <EpocasGame
      data={data}
      initialState={initialState}
    />
  );
}
