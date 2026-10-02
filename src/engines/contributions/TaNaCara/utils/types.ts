import type { DailyTaNaCaraTestimony, DailyTaNaCaraVariant } from 'types/games';
import type { DefaultGameState } from 'types/puzzles';

/**
 * Ta Na Cara question-deck filter mode.
 */
export type TaNaCaraMode = 'normal' | 'nsfw';

/**
 * Answers given for one testimony, keyed by suspect id.
 */
export type PreliminaryAnswer = {
  /**
   * Id of the testimony this answer belongs to.
   */
  testimonyId: string;
  /**
   * Per-suspect answers: `true` for "Sim", `false` for "Não", and `null`
   * when the player left that suspect blank.
   */
  answers: Record<string, boolean | null>;
};

/**
 * Persisted per-day progress for Ta Na Cara, kept in local storage so a
 * reload does not lose the player's current testimony deck or answers.
 */
export type GameState = DefaultGameState<{
  /**
   * Whether NSFW testimonies are included in today's active question deck.
   */
  mode: TaNaCaraMode;
  /**
   * Current portrait style selected for suspect images.
   */
  variant: DailyTaNaCaraVariant;
  /**
   * Zero-based index of the testimony currently being answered.
   */
  questionIndex: number;
  /**
   * Ordered ids of the testimonies active in today's run.
   */
  selectedTestimonyIds: string[];
  /**
   * Ordered suspect ids shown for each testimony in today's run.
   */
  questionSuspectIds: string[][];
  /**
   * Stored answers for each testimony in today's run.
   */
  answers: PreliminaryAnswer[];
}>;

/**
 * Payload sent to the daily save endpoint for one answered testimony.
 */
export type AnswerToSave = {
  /**
   * Id of the testimony being saved.
   */
  testimonyId: string;
  /**
   * Backend-facing suspect ids marked as related to the testimony.
   */
  related: string[];
  /**
   * Backend-facing suspect ids marked as unrelated to the testimony.
   */
  unrelated: string[];
};

/**
 * Display-ready Ta Na Cara result row used by the fullscreen splash.
 */
export type TaNaCaraResultQuestion = {
  /**
   * Id of the testimony shown in this result row.
   */
  testimonyId: string;
  /**
   * Testimony question text displayed in the recap.
   */
  question: string;
  /**
   * Suspect names marked with "Sim".
   */
  relatedNames: string[];
  /**
   * Suspect names marked with "Não".
   */
  unrelatedNames: string[];
};

/**
 * Public state and actions returned by {@link useTaNaCaraEngine}.
 */
export type TaNaCaraEngineState = {
  /**
   * Testimony currently being shown to the player, or `null` when the saved
   * state has no active question deck.
   */
  currentQuestion: DailyTaNaCaraTestimony | null;
  /**
   * Stored answers for the testimony currently on screen, or `null` when no
   * question deck is active.
   */
  currentAnswers: PreliminaryAnswer | null;
  /**
   * Suspect ids currently rendered for the active testimony.
   */
  suspects: string[];
  /**
   * One-based number of the testimony currently on screen.
   */
  questionNumber: number;
  /**
   * Total testimonies in today's active question deck.
   */
  totalQuestions: number;
  /**
   * Number of testimonies that already reached the minimum answer threshold.
   */
  answeredQuestions: number;
  /**
   * Number of suspects with a non-null answer across all testimonies.
   */
  markedAnswers: number;
  /**
   * Whether the fullscreen results splash is currently visible.
   */
  showResults: boolean;
  /**
   * Controls the visibility of the fullscreen results splash.
   */
  setShowResults: (value: boolean) => void;
  /**
   * Fraction of today's answer quota already covered, from `0` to `1`.
   */
  progress: number;
  /**
   * Score accumulated from marked suspect answers.
   */
  score: number;
  /**
   * Whether NSFW testimonies are included in today's active question deck.
   */
  mode: TaNaCaraMode;
  /**
   * Current portrait style selected for suspect images.
   */
  variant: DailyTaNaCaraVariant;
  /**
   * Whether the player has not started today's run yet.
   */
  isIdle: boolean;
  /**
   * Whether the player is currently answering testimonies.
   */
  isPlaying: boolean;
  /**
   * Whether the current submission is being saved to the backend.
   */
  isSaving: boolean;
  /**
   * Whether the last save attempt failed and can be retried.
   */
  isRetryable: boolean;
  /**
   * Whether today's answers were saved successfully.
   */
  isWin: boolean;
  /**
   * Whether today's run reached a lose state.
   */
  isLose: boolean;
  /**
   * Whether today's run reached any final lifecycle state.
   */
  isComplete: boolean;
  /**
   * Whether this Ta Na Cara entry was already submitted earlier today.
   */
  alreadyPlayed: boolean;
  /**
   * Whether the player can move to the next testimony.
   */
  canGoNext: boolean;
  /**
   * Whether the player can return to the previous testimony.
   */
  canGoPrevious: boolean;
  /**
   * Whether the current testimony and run state allow submission.
   */
  canSubmit: boolean;
  /**
   * Save button label appropriate for the current testimony position.
   */
  submitLabel: string;
  /**
   * Display-ready result rows used by the fullscreen splash.
   */
  resultQuestions: TaNaCaraResultQuestion[];
  /**
   * Toggles whether NSFW testimonies should be included before starting.
   */
  toggleNsfwMode: (checked: boolean) => void;
  /**
   * Sets or clears the answer for one suspect in the current testimony.
   */
  updateAnswer: (suspectId: string, answer: boolean) => void;
  /**
   * Advances to the next testimony when the current one is complete enough.
   */
  goToNextQuestion: () => void;
  /**
   * Returns to the previous testimony.
   */
  goToPreviousQuestion: () => void;
  /**
   * Saves the currently answered testimonies to the backend.
   */
  submitAnswers: () => void;
  /**
   * Retries the last failed save using the answers already stored in state.
   */
  retrySave: () => void;
  /**
   * Moves Ta Na Cara from the intro screen into the testimony flow.
   */
  startGame: () => void;
  /**
   * Changes the suspect portrait style without affecting stored answers.
   */
  changeVariant: (variant: DailyTaNaCaraVariant) => void;
  /**
   * Resolves a suspect id to the display name used in the current entry.
   */
  getSuspectName: (suspectId: string) => string;
};
