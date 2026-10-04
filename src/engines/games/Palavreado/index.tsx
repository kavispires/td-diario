import { useState } from 'react';
import type { DailyPalavreadoEntry } from 'types/games';
import { PalavreadoGame } from './components/PalavreadoGame';
import { getInitialState } from './utils/helpers';

/**
 * Props accepted by the {@link DailyPalavreadoGame} component.
 */
type DailyPalavreadoGameProps = {
  /**
   * Today's Palavreado payload, as resolved by `GameScreen`.
   */
  data: DailyPalavreadoEntry;
};

/**
 * Initializes today's persisted Palavreado state, then delegates the full
 * interactive experience to {@link PalavreadoGame}.
 *
 * @param props - Today's Palavreado payload.
 * @returns The rendered Palavreado game.
 */
export function DailyPalavreadoGame({ data }: DailyPalavreadoGameProps) {
  const [initialState] = useState(() => getInitialState(data));

  return (
    <PalavreadoGame
      data={data}
      initialState={initialState}
    />
  );
}
