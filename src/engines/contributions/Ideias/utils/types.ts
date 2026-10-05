import type { DefaultGameState } from 'types/puzzles';

/**
 * Ids for every game that can receive an idea submission, plus a catch-all
 * general category not tied to any specific game.
 */
export type IdeaCategory =
  | 'arte-ruim'
  | 'filmaco'
  | 'investigacao'
  | 'mapeamento'
  | 'quartetos'
  | 'karaoke'
  | 'epocas'
  | 'general';

/**
 * Draft fields collected for an Arte Ruim idea submission.
 */
export type ArteRuimIdeaDraft = {
  /**
   * Suggested expression for players to draw.
   */
  expression: string;
};

/**
 * Draft fields collected for a Filmaço idea submission.
 */
export type FilmacoIdeaDraft = {
  /**
   * Suggested movie title.
   */
  movie: string;
};

/**
 * Draft fields collected for an Investigação idea submission.
 */
export type InvestigacaoIdeaDraft = {
  /**
   * Suggested testimony question, which should avoid directly describing
   * physical appearance.
   */
  question: string;
};

/**
 * Draft fields collected for a Mapeamento idea submission.
 */
export type MapeamentoIdeaDraft = {
  /**
   * Suggested location to be mapped.
   */
  location: string;
};

/**
 * Draft fields collected for a Quartetos idea submission.
 */
export type QuartetosIdeaDraft = {
  /**
   * Shared theme connecting the suggested group of items.
   */
  theme: string;
  /**
   * Suggested items belonging to the group (at least four).
   */
  items: string[];
};

/**
 * Draft fields collected for a Karaokê idea submission.
 */
export type KaraokeIdeaDraft = {
  /**
   * Suggested song title.
   */
  title: string;
  /**
   * Suggested song artist.
   */
  artist: string;
  /**
   * Suggested excerpt of the song's lyrics.
   */
  lyric: string;
};

/**
 * Draft fields collected for an Épocas idea submission.
 */
export type EpocasIdeaDraft = {
  /**
   * Year the suggested historical event took place.
   */
  year: string;
  /**
   * Description of the suggested historical event.
   */
  event: string;
};

/**
 * Draft fields collected for a general idea or feedback submission.
 */
export type GeneralIdeaDraft = {
  /**
   * Freeform idea or feedback text.
   */
  feedback: string;
};

/**
 * Union of every category's draft shape, discriminated by `IdeaCategory`.
 */
export type IdeaDraft =
  | ArteRuimIdeaDraft
  | FilmacoIdeaDraft
  | InvestigacaoIdeaDraft
  | MapeamentoIdeaDraft
  | QuartetosIdeaDraft
  | KaraokeIdeaDraft
  | EpocasIdeaDraft
  | GeneralIdeaDraft;

/**
 * Payload sent to the `SAVE_IDEA` daily action for one submitted idea.
 */
export type IdeaToSave = {
  /**
   * Category the submitted idea belongs to.
   */
  category: IdeaCategory;
  /**
   * Category-specific fields collected from the submission form.
   */
  draft: IdeaDraft;
  /**
   * Firebase uid of the player who submitted the idea.
   */
  playerId: string;
};

/**
 * Persisted per-day progress for Ideias, kept in local storage so a reload
 * does not lose whether the player already contributed an idea today.
 */
export type GameState = DefaultGameState<{
  /**
   * Category of the last idea successfully submitted today, or `null`
   * before the first submission.
   */
  lastCategory: IdeaCategory | null;
  /**
   * Number of ideas successfully submitted today.
   */
  submissionCount: number;
}>;

/**
 * Public state and actions returned by {@link useIdeiasEngine}.
 */
export type IdeiasEngineState = {
  /**
   * Whether the player has not submitted any idea yet today.
   */
  isIdle: boolean;
  /**
   * Whether at least one idea was already submitted today.
   */
  isWin: boolean;
  /**
   * Whether the current submission is being saved to the backend.
   */
  isSaving: boolean;
  /**
   * Number of ideas successfully submitted today.
   */
  submissionCount: number;
  /**
   * Whether the player opted to submit another idea after already
   * submitting one today.
   */
  isSubmittingAnother: boolean;
  /**
   * Switches the form back to the category picker to submit another idea.
   */
  startAnother: () => void;
  /**
   * Submits one idea to the backend for today's contribution.
   *
   * @param category - Category the idea belongs to.
   * @param draft - Category-specific fields collected from the form.
   */
  submitIdea: (category: IdeaCategory, draft: IdeaDraft) => void;
};
