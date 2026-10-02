import type { DefaultGameState } from 'types/puzzles';
import type { PoolGroupEntry } from './data';

/**
 * Encoded button actions supported by Panico.
 */
export type PanicoExpectedAction =
  | 'PRESS'
  | 'DO_NOT_PRESS'
  | 'MULTI_PRESS'
  | 'PRESS_LESS'
  | 'PRESS_MORE'
  | 'ANY'
  | 'TBD';

/**
 * When a Panico button should be evaluated.
 */
export type PanicoVerification = 'IMMEDIATE' | 'DEFAULT';

/**
 * Countdown length bucket attached to a Panico button.
 */
export type PanicoDurationScale = 'quick' | 'normal' | 'long';

/**
 * The layout/color variant applied to a Panico button face.
 */
export type PanicoButtonVariant = 'RED' | 'YELLOW' | 'BLUE';

/**
 * Runtime-resolved Panico button shown to the player.
 */
export type ButtonEntry = {
  /**
   * Unique id for the button within today's sequence.
   */
  id: string;
  /**
   * Button definition key used to decide rendering and validation behavior.
   */
  key: string;
  /**
   * High-level category grouping similar button mechanics.
   */
  category:
    | 'standard'
    | 'trick'
    | 'memory'
    | 'logic'
    | 'question'
    | 'conditional'
    | 'math'
    | 'count';
  /**
   * How many presses are expected for a correct answer.
   */
  targetCount: number;
  /**
   * Validation strategy for the interaction.
   */
  expectedAction: PanicoExpectedAction;
  /**
   * Whether correctness is checked immediately or after the timer ends.
   */
  verification: PanicoVerification;
  /**
   * Duration bucket controlling the circular countdown.
   */
  durationScale: PanicoDurationScale;
  /**
   * Optional keyword used by dependency/resolver rules.
   */
  keyword?: string;
  /**
   * Optional prerequisite button key that must have appeared earlier.
   */
  dependsOn?: string;
  /**
   * Optional set of mutually-exclusive sibling button keys.
   */
  eitherOr?: string[];
  /**
   * Optional color/style variant applied to the rendered button.
   */
  buttonVariant?: PanicoButtonVariant;
  /**
   * Optional resolved pool payload used for text, sprites, and counts.
   */
  pool?: PoolGroupEntry;
};

/**
 * Persisted per-day Panico progress stored in local storage.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining lives.
   */
  hearts: number;
  /**
   * Total number of buttons in today's sequence.
   */
  totalButtons: number;
  /**
   * Highest completed button count reached so far.
   */
  farthestButtonIndex: number;
}>;

/**
 * Ephemeral session state for the current Panico run.
 */
export type SessionState = {
  /**
   * Resolved buttons for today's sequence.
   */
  buttons: ButtonEntry[];
  /**
   * Index of the active button, or `-1` when waiting to start.
   */
  activeButtonIndex: number;
  /**
   * Whether a run is waiting to start or currently in progress.
   */
  status: 'idle' | 'ongoing';
};
