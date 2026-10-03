import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyConjuntosEntry, DailyConjuntosThing } from 'types/games';
import { gameInfo } from '../info';
import type { DiagramArea, GameState, Guess } from './types';

const BASE_HEARTS = 4;

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
  return dayOfWeek === 0 || dayOfWeek === 6;
}

/**
 * Returns the number of starting hearts for a given challenge date.
 *
 * @param dateId - Daily challenge id in `YYYY-MM-DD` format.
 * @returns `4` on weekdays and `5` on weekends.
 */
export function getTotalHearts(dateId: string): number {
  return BASE_HEARTS + (isWeekendChallenge(dateId) ? 1 : 0);
}

/**
 * Returns the number of hand slots Conjuntos starts with for a given date.
 *
 * @param dateId - Daily challenge id in `YYYY-MM-DD` format.
 * @returns `4` on weekdays and `5` on weekends.
 */
export function getInitialHandSize(dateId: string): number {
  return BASE_HEARTS + (isWeekendChallenge(dateId) ? 1 : 0);
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
        rule: 1,
      },
    ],
    rule2Things: [
      {
        ...data.rule2.thing,
        rule: 2,
      },
    ],
    intersectingThings: [
      {
        ...data.intersectingThing,
        rule: 0,
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
    (rule === undefined || rule === 0 || rule === 1 || rule === 2)
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
    (candidate.sectionId === 0 ||
      candidate.sectionId === 1 ||
      candidate.sectionId === 2) &&
    (candidate.result === false ||
      candidate.result === 0 ||
      candidate.result === 1 ||
      candidate.result === 2)
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
  const totalThingsOnBoard = data.things.length + 3;
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
    .filter((letter) => 'aeiou'.includes(letter)).length;
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
  return {
    0: 'interseção',
    1: 'círculo amarelo',
    2: 'círculo vermelho',
  }[area];
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
  switch (area) {
    case 0:
      return 'intersectingThings';
    case 1:
      return 'rule1Things';
    case 2:
      return 'rule2Things';
  }
}

/**
 * Builds the plain-text shareable result for today's Conjuntos run, reusing
 * the original per-attempt emoji summary and spaced heart row.
 *
 * @param options - Today's challenge number and final run state.
 * @returns The assembled shareable result text.
 */
export function buildShareText({
  challengeNumber,
  hearts,
  totalHearts,
  guesses,
}: {
  challengeNumber: number;
  hearts: number;
  totalHearts: number;
  guesses: Array<Pick<Guess, 'result'>>;
}): string {
  const additionalLines = [
    guesses
      .map((guess) => {
        return {
          1: '🟡',
          2: '🔴',
          0: '🟠',
          false: '✖️',
        }[String(guess.result)];
      })
      .join(' '),
  ].filter(Boolean);

  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts,
    remainingHearts: hearts,
    heartsSpacing: ' ',
    additionalLines,
  });
}
