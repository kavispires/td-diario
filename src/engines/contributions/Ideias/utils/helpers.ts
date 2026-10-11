import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { DailyIdeiasEntry } from 'types/games';
import { gameInfo } from '../info';
import { IDEA_CATEGORIES } from './constants';
import type {
  DailySaveIdeaPayload,
  GameState,
  IdeaCategory,
  IdeaDraft,
} from './types';

/**
 * Builds the default `GameState` for a fresh Ideias day.
 *
 * @param data - Today's Ideias payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyIdeiasEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    progress: 0,
    score: 0,
    lastCategory: null,
    submissionCount: 0,
  };
}

/**
 * Retrieves today's Ideias state, restoring it from local storage when it
 * still matches today's entry, or rebuilding a fresh state otherwise.
 *
 * @param data - Today's Ideias payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyIdeiasEntry): GameState {
  const defaultState = getDefaultState(data);
  return loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: defaultState,
  });
}

/**
 * Builds the {@link DailySaveIdeaPayload} sent to the `SAVE_IDEA` daily
 * action: the submitted category's 3-letter game key (or `'general'`), and
 * the draft serialized to JSON. Drafts made of a single string field are
 * normalized to `{ idea: <value> }` before serializing, so every
 * category's primary suggestion text is keyed the same way regardless of
 * its original field name (e.g. `expression`, `movie`, `location`).
 *
 * @param category - Category the idea belongs to.
 * @param draft - Category-specific fields collected from the submission form.
 * @returns The payload ready to send to the backend.
 */
export function buildIdeaPayload(
  category: IdeaCategory,
  draft: IdeaDraft,
): DailySaveIdeaPayload {
  const key =
    IDEA_CATEGORIES.find((option) => option.id === category)?.key ?? category;
  const fields = Object.entries(draft);
  const value =
    fields.length === 1
      ? JSON.stringify({ prompt: fields[0][1] })
      : JSON.stringify(draft);

  return { idea: { key, value } };
}
