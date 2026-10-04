import { useState } from 'react';
import type { DailyTaNaCaraEntry } from 'types/games';
import { TaNaCaraGame } from './components/TaNaCaraGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyTaNaCaraGame} component.
 */
type DailyTaNaCaraGameProps = {
  /**
   * Today's Ta Na Cara payload, as resolved by `GameScreen`.
   */
  data: DailyTaNaCaraEntry;
};

/**
 * Seeds Ta Na Cara with today's initial engine state, then delegates the
 * full interactive experience to {@link TaNaCaraGame}.
 *
 * @param props Today's Ta Na Cara payload.
 * @returns The rendered Ta Na Cara game.
 */
export function DailyTaNaCaraGame({ data }: DailyTaNaCaraGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  return (
    <TaNaCaraGame
      data={data}
      initialState={initialState}
    />
  );
}
