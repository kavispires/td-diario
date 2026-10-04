import type { Dispatch, SetStateAction } from 'react';
import type { DailyConjuntosThing } from 'types/games';
import type { DefaultGameState } from 'types/puzzles';

/**
 * Selectable areas of the Conjuntos diagram.
 */
export type DiagramArea = 0 | 1 | 2;

/**
 * One placement attempt made by the player.
 */
export type Guess = {
  /**
   * Id of the thing that was being placed.
   */
  thingId: string;
  /**
   * Area selected by the player for that thing.
   */
  sectionId: DiagramArea;
  /**
   * Final recorded result: the chosen area when correct, otherwise `false`.
   */
  result: DiagramArea | false;
};

/**
 * Persisted Conjuntos progress for the current day.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining hearts before the puzzle ends in a loss.
   */
  hearts: number;
  /**
   * Things currently available for the player to place.
   */
  hand: DailyConjuntosThing[];
  /**
   * Extra things that enter the hand after a wrong placement.
   */
  deck: DailyConjuntosThing[];
  /**
   * Things already confirmed inside the left/yellow circle.
   */
  rule1Things: DailyConjuntosThing[];
  /**
   * Things already confirmed inside the right/red circle.
   */
  rule2Things: DailyConjuntosThing[];
  /**
   * Things already confirmed inside the intersection.
   */
  intersectingThings: DailyConjuntosThing[];
  /**
   * Chronological list of the player's placement attempts.
   */
  guesses: Guess[];
  /**
   * Whether today's challenge date falls on a weekend.
   */
  isWeekend: boolean;
}>;

/**
 * Ephemeral UI-only state that should not be persisted between reloads.
 */
export type SessionState = {
  /**
   * Thing currently selected in the hand, if any.
   */
  activeThing: DailyConjuntosThing | null;
  /**
   * Diagram area currently selected for confirmation, if any.
   */
  activeArea: DiagramArea | null;
};

/**
 * Public state and actions returned by {@link useConjuntosEngine}.
 */
export type ConjuntosEngineState = {
  /**
   * Remaining hearts before the puzzle ends.
   */
  hearts: number;
  /**
   * Maximum hearts available at the start of today's puzzle.
   */
  maxHearts: number;
  /**
   * Things currently available for placement.
   */
  hand: DailyConjuntosThing[];
  /**
   * Things already confirmed inside the left/yellow circle.
   */
  rule1Things: DailyConjuntosThing[];
  /**
   * Things already confirmed inside the right/red circle.
   */
  rule2Things: DailyConjuntosThing[];
  /**
   * Things already confirmed inside the intersection.
   */
  intersectingThings: DailyConjuntosThing[];
  /**
   * Chronological list of placement attempts.
   */
  guesses: Guess[];
  /**
   * Number of things already resolved, regardless of being right or wrong.
   */
  placedThingsCount: number;
  /**
   * Total size of today's thing pool (hand plus remaining deck). Note this
   * is unrelated to the win condition, which only requires `maxHearts`
   * correct placements.
   */
  totalThings: number;
  /**
   * Current completion fraction from `0` to `1`, based on the number of
   * correct placements so far out of `maxHearts` (the number of correct
   * placements needed to win).
   */
  progress: number;
  /**
   * Score accumulated from correct placements.
   */
  score: number;
  /**
   * Whether today's puzzle uses the weekend extra heart/thing variant.
   */
  isWeekend: boolean;
  /**
   * Thing currently selected in the hand, if any.
   */
  activeThing: DailyConjuntosThing | null;
  /**
   * Diagram area currently selected for confirmation, if any.
   */
  activeArea: DiagramArea | null;
  /**
   * Whether the fullscreen results splash is visible.
   */
  showResults: boolean;
  /**
   * Controls the visibility of the fullscreen results splash.
   */
  setShowResults: Dispatch<SetStateAction<boolean>>;
  /**
   * Whether the puzzle ended in a win state.
   */
  isWin: boolean;
  /**
   * Whether the puzzle ended in a lose state.
   */
  isLose: boolean;
  /**
   * Whether the puzzle ended in any final state.
   */
  isComplete: boolean;
  /**
   * Selects or unselects a thing from the hand.
   */
  onSelectThing: (thing: DailyConjuntosThing) => void;
  /**
   * Selects or clears a diagram area for confirmation.
   */
  onSelectArea: (area: DiagramArea | null) => void;
  /**
   * Selects a thing and its target area together in one step, used when a
   * hand item is dropped directly onto a diagram area via drag-and-drop.
   */
  onDropThing: (thing: DailyConjuntosThing, area: DiagramArea) => void;
  /**
   * Confirms the currently selected thing/area pair.
   */
  onConfirmPlacement: () => void;
  /**
   * Clears the current pending placement selection.
   */
  onCancelPlacement: () => void;
};
