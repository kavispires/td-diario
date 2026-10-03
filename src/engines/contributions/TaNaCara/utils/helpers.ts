import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type {
  DailyTaNaCaraEntry,
  DailyTaNaCaraTestimony,
  DailyTaNaCaraVariant,
} from 'types/games';
import { gameInfo } from '../info';
import {
  DEFAULT_MODE,
  DEFAULT_VARIANT,
  MAX_PREFERRED_SUSPECTS_PER_QUESTION,
  MIN_REQUIRED_ANSWERS,
  MIN_REQUIRED_QUESTIONS,
  SCORE_PER_MARKED_ANSWER,
  SUSPECTS_PER_QUESTION,
  VARIANT_OPTIONS,
} from './constants';
import type {
  AnswerToSave,
  GameState,
  PreliminaryAnswer,
  TaNaCaraMode,
  TaNaCaraResultQuestion,
} from './types';

/**
 * Builds the default `GameState` for a fresh Ta Na Cara day.
 *
 * @param data - Today's Ta Na Cara payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyTaNaCaraEntry): GameState {
  const prepared = buildPreparedQuestions(data, DEFAULT_MODE);

  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    progress: 0,
    score: 0,
    mode: DEFAULT_MODE,
    variant: normalizeVariant(data.variant),
    questionIndex: 0,
    selectedTestimonyIds: prepared.selectedTestimonyIds,
    questionSuspectIds: prepared.questionSuspectIds,
    answers: prepared.answers,
  };
}

/**
 * Retrieves today's Ta Na Cara state, restoring it from local storage when
 * it still matches today's entry and a valid question layout, or rebuilding
 * a fresh state otherwise.
 *
 * @param data - Today's Ta Na Cara payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyTaNaCaraEntry): GameState {
  const defaultState = getDefaultState(data);
  const restoredState = loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: defaultState,
  });

  return isValidState(restoredState, data) ? restoredState : defaultState;
}

/**
 * Rebuilds the question deck used for a given Ta Na Cara mode.
 *
 * @param data - Today's Ta Na Cara payload.
 * @param mode - Whether NSFW testimonies are allowed.
 * @returns Ordered testimony ids, per-question suspect ids, and blank answers.
 */
export function buildPreparedQuestions(
  data: DailyTaNaCaraEntry,
  mode: TaNaCaraMode,
): Pick<GameState, 'selectedTestimonyIds' | 'questionSuspectIds' | 'answers'> {
  const filteredTestimonies =
    mode === 'nsfw'
      ? data.testimonies
      : data.testimonies.filter((testimony) => !testimony.nsfw);
  const testimonies =
    filteredTestimonies.length > 0 ? filteredTestimonies : data.testimonies;

  return {
    selectedTestimonyIds: testimonies.map((testimony) => testimony.testimonyId),
    questionSuspectIds: testimonies.map((testimony) =>
      pickQuestionSuspects(testimony, data.suspectsIds),
    ),
    answers: testimonies.map((testimony) => ({
      testimonyId: testimony.testimonyId,
      answers: {},
    })),
  };
}

/**
 * Builds the backend payload expected by the Ta Na Cara save endpoint.
 *
 * @param answers - Question answers to persist.
 * @returns Save-ready testimonies grouped into related/unrelated suspect ids.
 */
export function buildSavePayload(answers: PreliminaryAnswer[]): AnswerToSave[] {
  return answers.map((answer) => ({
    testimonyId: answer.testimonyId,
    related: Object.entries(answer.answers)
      .filter(([, value]) => value === true)
      .map(([suspectId]) => removeStyleMidFix(suspectId)),
    unrelated: Object.entries(answer.answers)
      .filter(([, value]) => value === false)
      .map(([suspectId]) => removeStyleMidFix(suspectId)),
  }));
}

/**
 * Counts how many suspects have a non-null answer across all testimonies.
 *
 * @param answers - All per-testimony answer maps.
 * @returns The number of marked suspects.
 */
export function countMarkedAnswers(answers: PreliminaryAnswer[]): number {
  return answers.reduce(
    (total, answer) => total + countAnsweredSuspects(answer),
    0,
  );
}

/**
 * Counts how many testimonies already reached Ta Na Cara's minimum answer
 * threshold.
 *
 * @param answers - All per-testimony answer maps.
 * @returns The number of testimonies with enough marked suspects.
 */
export function countCompletedQuestions(answers: PreliminaryAnswer[]): number {
  return answers.filter(hasMinimumAnswers).length;
}

/**
 * Returns whether a testimony already has the minimum number of marked
 * suspects required to continue.
 *
 * @param answer - One testimony's answer map.
 * @returns Whether the answer is complete enough to advance.
 */
export function hasMinimumAnswers(answer: PreliminaryAnswer): boolean {
  return countAnsweredSuspects(answer) >= MIN_REQUIRED_ANSWERS;
}

/**
 * Computes Ta Na Cara's score from the currently marked suspects.
 *
 * @param answers - All per-testimony answer maps.
 * @returns The current score.
 */
export function getScore(answers: PreliminaryAnswer[]): number {
  return countMarkedAnswers(answers) * SCORE_PER_MARKED_ANSWER;
}

/**
 * Computes Ta Na Cara's progress from the currently marked suspects, capped
 * at `1` once the submission threshold has been fully satisfied.
 *
 * @param answers - All per-testimony answer maps.
 * @param totalQuestions - Total testimonies in today's active question deck.
 * @returns Current progress from `0` to `1`.
 */
export function getProgress(
  answers: PreliminaryAnswer[],
  totalQuestions: number,
): number {
  const denominator = totalQuestions * MIN_REQUIRED_ANSWERS;
  if (denominator <= 0) {
    return 0;
  }

  return Math.min(countMarkedAnswers(answers) / denominator, 1);
}

/**
 * Resolves a suspect id to the portrait image id used by TD's image CDN for
 * the selected style variant.
 *
 * @param suspectId - Original suspect id from the daily payload.
 * @param variant - Visual style variant chosen by the player.
 * @returns The variant-adjusted image id.
 */
export function getSuspectImageId(
  suspectId: string,
  variant: DailyTaNaCaraVariant,
): string {
  const [prefix, , suffix] = suspectId.split('-');

  return prefix && suffix ? `${prefix}-${variant}-${suffix}` : suspectId;
}

/**
 * Resolves the display name for a suspect, falling back to a generic label
 * when the daily payload does not include a custom name.
 *
 * @param suspectId - Suspect id used in the daily payload.
 * @param names - Optional id-to-name lookup returned with today's entry.
 * @returns A display-ready suspect name.
 */
export function getSuspectDisplayName(
  suspectId: string,
  names?: Record<string, string>,
): string {
  const resolvedName = names?.[suspectId];
  if (resolvedName) {
    return resolvedName;
  }

  return `Pessoa #${suspectId.split('-').at(-1) ?? suspectId}`;
}

/**
 * Determines whether a testimony index is far enough into the run for the
 * player to submit Ta Na Cara early.
 *
 * @param questionNumber - One-based testimony number currently on screen.
 * @param totalQuestions - Total testimonies in today's active question deck.
 * @returns Whether the submit button should be available.
 */
export function canSubmitFromQuestion(
  questionNumber: number,
  totalQuestions: number,
): boolean {
  return questionNumber >= Math.min(MIN_REQUIRED_QUESTIONS, totalQuestions);
}

/**
 * Resolves saved Ta Na Cara answers into display-ready result cards.
 *
 * @param data - Today's Ta Na Cara payload.
 * @param answers - Answers that were submitted or are about to be shown.
 * @returns Result questions with names already expanded.
 */
export function getResultQuestions(
  data: DailyTaNaCaraEntry,
  answers: PreliminaryAnswer[],
): TaNaCaraResultQuestion[] {
  const testimoniesById = Object.fromEntries(
    data.testimonies.map((testimony) => [testimony.testimonyId, testimony]),
  );

  return answers.map((answer) => {
    const testimony = testimoniesById[answer.testimonyId];
    const relatedNames: string[] = [];
    const unrelatedNames: string[] = [];

    for (const [suspectId, value] of Object.entries(answer.answers)) {
      if (value === true) {
        relatedNames.push(getSuspectDisplayName(suspectId, data.names));
      }

      if (value === false) {
        unrelatedNames.push(getSuspectDisplayName(suspectId, data.names));
      }
    }

    return {
      testimonyId: answer.testimonyId,
      question: testimony?.question ?? 'Depoimento indisponível',
      relatedNames,
      unrelatedNames,
    };
  });
}

/**
 * Normalizes Ta Na Cara's visual variant, falling back to `gb` when today's
 * payload omits it or includes an unsupported value.
 *
 * @param variant - Optional variant from today's payload.
 * @returns A supported Ta Na Cara portrait variant.
 */
export function normalizeVariant(
  variant?: DailyTaNaCaraVariant,
): DailyTaNaCaraVariant {
  return variant && VARIANT_OPTIONS.includes(variant)
    ? variant
    : DEFAULT_VARIANT;
}

/**
 * Randomly picks the suspects shown for one testimony, mirroring the
 * original Ta Na Cara rule of drawing up to five suspects from the
 * testimony itself, then filling the remaining slots from the day's wider
 * suspect pool.
 *
 * @param testimony - Testimony whose suspects should be displayed.
 * @param dailySuspectIds - Fallback pool of suspect ids for the day.
 * @returns Up to six unique suspect ids for this testimony.
 */
function pickQuestionSuspects(
  testimony: DailyTaNaCaraTestimony,
  dailySuspectIds: string[],
): string[] {
  const preferredSuspects = uniqueStrings(testimony.suspectsIds ?? []);
  const pickedPreferred = sampleIds(
    preferredSuspects,
    Math.min(MAX_PREFERRED_SUSPECTS_PER_QUESTION, preferredSuspects.length),
  );
  const fallbackPool = uniqueStrings(dailySuspectIds).filter(
    (suspectId) => !pickedPreferred.includes(suspectId),
  );
  const fallbackSuspects = sampleIds(
    fallbackPool,
    Math.max(0, SUSPECTS_PER_QUESTION - pickedPreferred.length),
  );
  const combined = [...pickedPreferred, ...fallbackSuspects];

  if (combined.length > 0) {
    return combined.slice(0, SUSPECTS_PER_QUESTION);
  }

  return sampleIds(uniqueStrings(dailySuspectIds), SUSPECTS_PER_QUESTION);
}

/**
 * Determines whether a restored Ta Na Cara state still matches today's
 * payload and contains a coherent prepared-question layout.
 *
 * @param state - Restored local state to validate.
 * @param data - Today's Ta Na Cara payload.
 * @returns Whether the restored state is safe to reuse.
 */
function isValidState(state: GameState, data: DailyTaNaCaraEntry): boolean {
  const prepared = buildPreparedQuestions(data, state.mode);
  const selectedIds = state.selectedTestimonyIds;
  const questionCount = selectedIds.length;
  const availableTestimonyIds = new Set(prepared.selectedTestimonyIds);
  const availableSuspectIds = new Set([
    ...data.suspectsIds,
    ...data.testimonies.flatMap((testimony) => testimony.suspectsIds ?? []),
  ]);

  return (
    questionCount > 0 &&
    questionCount === state.questionSuspectIds.length &&
    questionCount === state.answers.length &&
    state.questionIndex >= 0 &&
    state.questionIndex < questionCount &&
    selectedIds.every((testimonyId) =>
      availableTestimonyIds.has(testimonyId),
    ) &&
    state.answers.every(
      (answer, index) =>
        answer.testimonyId === state.selectedTestimonyIds[index],
    ) &&
    state.questionSuspectIds.every(
      (suspects) =>
        suspects.length > 0 &&
        suspects.length <= SUSPECTS_PER_QUESTION &&
        new Set(suspects).size === suspects.length &&
        suspects.every((suspectId) => availableSuspectIds.has(suspectId)),
    )
  );
}

/**
 * Counts marked suspects inside one testimony answer.
 *
 * @param answer - One testimony's answer map.
 * @returns The number of non-null suspect answers.
 */
function countAnsweredSuspects(answer: PreliminaryAnswer): number {
  return Object.values(answer.answers).filter((value) => value !== null).length;
}

/**
 * Returns a de-duplicated copy of a string list while preserving the
 * original order.
 *
 * @param values - String list to clean up.
 * @returns Unique values in their original order.
 */
function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}

/**
 * Returns a random subset of an array without mutating the original list.
 *
 * @param values - Source array to sample from.
 * @param size - Maximum number of values to return.
 * @returns A shuffled subset of up to `size` items.
 */
function sampleIds(values: string[], size: number): string[] {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled.slice(0, size);
}

/**
 * Removes the style segment from a suspect id before it is sent to the
 * backend, matching the original Ta Na Cara save payload.
 *
 * @param suspectId - Variant-specific suspect id from the client.
 * @returns The backend-facing suspect id without the style middle segment.
 */
function removeStyleMidFix(suspectId: string): string {
  const parts = suspectId.split('-');

  return parts.length > 2 ? [parts[0], parts.at(-1)].join('-') : suspectId;
}
