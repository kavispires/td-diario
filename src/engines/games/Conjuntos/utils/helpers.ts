import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { ShareResult } from '@utils/shareResults';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyConjuntosEntry, DailyConjuntosThing } from 'types/games';
import { gameInfo } from '../info';
import {
  CONJUNTOS_AREA_LABELS,
  CONJUNTOS_AREA_THINGS_KEYS,
  CONJUNTOS_BASE_HEARTS,
  CONJUNTOS_DIAGRAM_AREAS,
  CONJUNTOS_GUESS_RESULT_EMOJIS,
  CONJUNTOS_INITIAL_DIAGRAM_THINGS_COUNT,
  CONJUNTOS_INTERSECTION_AREA,
  CONJUNTOS_RULE1_AREA,
  CONJUNTOS_RULE2_AREA,
  CONJUNTOS_VOWELS,
  CONJUNTOS_WEEKEND_DAY_INDICES,
  CONJUNTOS_WEEKEND_EXTRA_HEARTS,
} from './constants';
import type { DiagramArea, GameState, Guess } from './types';

/**
 * Removes diacritics from a word so vowel counting treats accented letters
 * the same way as their base Latin vowels.
 *
 * @param word - Word to normalize.
 * @returns The same word without combining accents.
 */
function removeAccents(word: string): string {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Determines whether a daily challenge date lands on a weekend in the
 * local timezone, matching the original Conjuntos weekend variant.
 *
 * @param dateId - Daily challenge id in `YYYY-MM-DD` format.
 * @returns Whether the challenge should use weekend rules.
 */
export function isWeekendChallenge(dateId: string): boolean {
  const dayOfWeek = new Date(`${dateId}T00:00:00`).getDay();
  return CONJUNTOS_WEEKEND_DAY_INDICES.some(
    (weekendDay) => weekendDay === dayOfWeek,
  );
}

/**
 * Returns the number of starting hearts for a given challenge date.
 *
 * @param dateId - Daily challenge id in `YYYY-MM-DD` format.
 * @returns `4` on weekdays and `5` on weekends.
 */
export function getTotalHearts(dateId: string): number {
  return (
    CONJUNTOS_BASE_HEARTS +
    (isWeekendChallenge(dateId) ? CONJUNTOS_WEEKEND_EXTRA_HEARTS : 0)
  );
}

/**
 * Returns the number of hand slots Conjuntos starts with for a given date.
 *
 * @param dateId - Daily challenge id in `YYYY-MM-DD` format.
 * @returns `4` on weekdays and `5` on weekends.
 */
export function getInitialHandSize(dateId: string): number {
  return (
    CONJUNTOS_BASE_HEARTS +
    (isWeekendChallenge(dateId) ? CONJUNTOS_WEEKEND_EXTRA_HEARTS : 0)
  );
}

/**
 * Builds the fresh persisted state for today's Conjuntos challenge.
 *
 * @param data - Today's Conjuntos payload.
 * @returns A brand-new `GameState`.
 */
function getDefaultState(data: DailyConjuntosEntry): GameState {
  const isWeekend = isWeekendChallenge(data.id);
  const initialHandSize = getInitialHandSize(data.id);

  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IN_PROGRESS,
    progress: 0,
    score: 0,
    hearts: getTotalHearts(data.id),
    hand: data.things.slice(0, initialHandSize),
    deck: data.things.slice(initialHandSize),
    rule1Things: [
      {
        ...data.rule1.thing,
        rule: CONJUNTOS_RULE1_AREA,
      },
    ],
    rule2Things: [
      {
        ...data.rule2.thing,
        rule: CONJUNTOS_RULE2_AREA,
      },
    ],
    intersectingThings: [
      {
        ...data.intersectingThing,
        rule: CONJUNTOS_INTERSECTION_AREA,
      },
    ],
    guesses: [],
    isWeekend,
  };
}

/**
 * Checks whether an arbitrary value looks like a Conjuntos thing.
 *
 * @param value - Unknown value to validate.
 * @returns Whether the value can be treated as a `DailyConjuntosThing`.
 */
function isThing(value: unknown): value is DailyConjuntosThing {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const rule = candidate.rule;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    (rule === undefined ||
      CONJUNTOS_DIAGRAM_AREAS.some((area) => area === rule))
  );
}

/**
 * Checks whether an arbitrary value looks like a recorded placement guess.
 *
 * @param value - Unknown value to validate.
 * @returns Whether the value can be treated as a `Guess`.
 */
function isGuess(value: unknown): value is Guess {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.thingId === 'string' &&
    CONJUNTOS_DIAGRAM_AREAS.some((area) => area === candidate.sectionId) &&
    (candidate.result === false ||
      CONJUNTOS_DIAGRAM_AREAS.some((area) => area === candidate.result))
  );
}

/**
 * Validates that a restored Conjuntos state is structurally coherent and
 * still matches today's payload closely enough to resume.
 *
 * @param state - Restored local state to validate.
 * @param data - Today's Conjuntos payload.
 * @returns Whether the restored state is safe to reuse.
 */
function isValidState(state: GameState, data: DailyConjuntosEntry): boolean {
  const knownThingIds = new Set([
    data.rule1.thing.id,
    data.rule2.thing.id,
    data.intersectingThing.id,
    ...data.things.map((thing) => thing.id),
  ]);
  const totalHearts = getTotalHearts(data.id);
  const totalThingsOnBoard =
    data.things.length + CONJUNTOS_INITIAL_DIAGRAM_THINGS_COUNT;
  const currentThingsOnBoard =
    state.hand.length +
    state.deck.length +
    state.rule1Things.length +
    state.rule2Things.length +
    state.intersectingThings.length;
  const validStatuses = new Set(Object.values(GAME_LIFECYCLE_STATUS));
  const hasKnownThingIds = (things: DailyConjuntosThing[]) =>
    things.every((thing) => knownThingIds.has(thing.id) && isThing(thing));

  return (
    validStatuses.has(state.status) &&
    state.hearts >= 0 &&
    state.hearts <= totalHearts &&
    state.progress >= 0 &&
    state.progress <= 1 &&
    state.guesses.length <= data.things.length &&
    currentThingsOnBoard === totalThingsOnBoard &&
    hasKnownThingIds(state.hand) &&
    hasKnownThingIds(state.deck) &&
    hasKnownThingIds(state.rule1Things) &&
    hasKnownThingIds(state.rule2Things) &&
    hasKnownThingIds(state.intersectingThings) &&
    state.guesses.every(isGuess)
  );
}

/**
 * Restores today's Conjuntos state from local storage when valid, or
 * rebuilds a fresh state otherwise.
 *
 * @param data - Today's Conjuntos payload.
 * @returns The initial `GameState` for the engine hook.
 */
export function getInitialState(data: DailyConjuntosEntry): GameState {
  const defaultState = getDefaultState(data);
  const restoredState = loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: defaultState,
  });

  return isValidState(restoredState, data) ? restoredState : defaultState;
}

/**
 * Builds a compact grammar summary for a thing name, matching the original
 * tooltip shown on item sprites.
 *
 * @param word - Thing label shown to the player.
 * @returns A count of letters, vowels, and consonants.
 */
export function countThing(word: string): string {
  const letters = word.replace(/[\s-]/g, '').length;
  const vowels = removeAccents(word.toLowerCase())
    .split('')
    .filter((letter) => CONJUNTOS_VOWELS.includes(letter)).length;
  const consonants = letters - vowels;

  return `${letters} letras, ${vowels} vogais, ${consonants} consoantes`;
}

/**
 * Returns the human-readable label for a diagram area.
 *
 * @param area - Diagram area id.
 * @returns A short Portuguese label.
 */
export function getAreaLabel(area: DiagramArea): string {
  return CONJUNTOS_AREA_LABELS[area];
}

/**
 * Returns the persisted state key that should receive a placed thing.
 *
 * @param area - Correct area for the thing.
 * @returns The matching `GameState` collection key.
 */
export function getAreaThingsKey(
  area: DiagramArea,
): keyof Pick<GameState, 'rule1Things' | 'rule2Things' | 'intersectingThings'> {
  return CONJUNTOS_AREA_THINGS_KEYS[area];
}

/**
 * Builds the shareable result for today's Conjuntos run, reusing
 * the original per-attempt emoji summary and spaced heart row.
 *
 * @param options - Today's challenge number and final run state.
 * @returns The assembled `{ title, text, url }` share result.
 */
export function buildShare({
  challengeNumber,
  hearts,
  totalHearts,
  guesses,
  score,
}: {
  challengeNumber: number;
  hearts: number;
  totalHearts: number;
  guesses: Array<Pick<Guess, 'result'>>;
  score: number;
}): ShareResult {
  const additionalLines = [
    guesses
      .map((guess) => {
        return CONJUNTOS_GUESS_RESULT_EMOJIS[String(guess.result)];
      })
      .join(' '),
  ].filter(Boolean);

  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts,
    remainingHearts: hearts,
    heartsSuffix: `(${score}pts)`,
    heartsSpacing: ' ',
    additionalLines,
  });
}

/**
 * Builds today's Conjuntos share result directly from persisted progress,
 * without mounting the game engine or results components.
 *
 * @param data - Today's Conjuntos challenge payload.
 * @param state - Persisted Conjuntos progress for today's challenge.
 * @returns The assembled `{ title, text, url }` share result.
 */
export function buildShareFromProgress(
  data: DailyConjuntosEntry,
  state: GameState,
): ShareResult {
  return buildShare({
    challengeNumber: data.number,
    hearts: state.hearts,
    totalHearts: getTotalHearts(data.id),
    guesses: state.guesses,
    score: state.score,
  });
}
