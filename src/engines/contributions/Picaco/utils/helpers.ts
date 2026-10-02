import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { DailyPicacoCard, DailyPicacoEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  CANVAS_VIEWBOX_SIZE,
  DRAWINGS_COUNT,
  MIN_SAVED_DRAWING_LENGTH,
  SAVE_KEY_SEPARATOR,
} from './constants';
import type {
  CanvasLine,
  DrawingToSave,
  GameState,
  PicacoDrawing,
} from './types';

/**
 * Builds a shuffled subset of prompt-card ids for today's run.
 *
 * @param cards - All prompt cards returned for today's Picaco entry.
 * @returns Up to `DRAWINGS_COUNT` unique card ids in play order.
 */
function pickCardIds(cards: DailyPicacoCard[]): string[] {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled.slice(0, DRAWINGS_COUNT).map((card) => card.id);
}

/**
 * Builds the default `GameState` for a fresh Picaco day.
 *
 * @param data - Today's Picaco payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyPicacoEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    progress: 0,
    score: 0,
    selectedCardIds: pickCardIds(data.cards),
    currentCardIndex: 0,
    drawings: [],
  };
}

/**
 * Validates that a restored local Picaco state still matches today's data
 * and keeps a coherent prompt/drawing progression.
 *
 * @param state - Restored local state to validate.
 * @param data - Today's Picaco payload.
 * @returns Whether the restored state is safe to reuse.
 */
function isValidState(state: GameState, data: DailyPicacoEntry): boolean {
  const availableCardIds = new Set(data.cards.map((card) => card.id));
  const selectedIds = state.selectedCardIds;
  const selectedCount = selectedIds.length;
  const selectedIdsAreUnique = new Set(selectedIds).size === selectedCount;
  const allSelectedCardsExist = selectedIds.every((cardId) =>
    availableCardIds.has(cardId),
  );
  const drawingsMatchSelection = state.drawings.every((drawing, index) => {
    const expectedCardId = selectedIds[index];
    return expectedCardId === drawing.cardId;
  });

  return (
    selectedCount > 0 &&
    selectedCount <= Math.min(DRAWINGS_COUNT, data.cards.length) &&
    selectedIdsAreUnique &&
    allSelectedCardsExist &&
    state.currentCardIndex >= 0 &&
    state.currentCardIndex <= selectedCount &&
    state.drawings.length <= state.currentCardIndex &&
    drawingsMatchSelection
  );
}

/**
 * Retrieves today's Picaco state, restoring it from local storage when it
 * still matches today's entry, or rebuilding a fresh state otherwise.
 *
 * @param data - Today's Picaco payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyPicacoEntry): GameState {
  const defaultState = getDefaultState(data);
  const restoredState = loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: defaultState,
  });

  return isValidState(restoredState, data) ? restoredState : defaultState;
}

/**
 * Serializes freehand canvas lines in the same JSON format used by the
 * original Picaco implementation.
 *
 * @param lines - Canvas strokes captured for one prompt.
 * @returns The JSON-serialized drawing.
 */
export function serializeDrawing(lines: CanvasLine[]): string {
  return JSON.stringify(lines);
}

/**
 * Best-effort parser for previously serialized Picaco drawings so they can
 * be previewed in the results splash.
 *
 * @param drawing - JSON-serialized drawing data.
 * @returns Parsed lines when the drawing is valid, otherwise an empty array.
 */
export function deserializeDrawing(drawing: string): CanvasLine[] {
  try {
    const parsed: unknown = JSON.parse(drawing);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (line): line is CanvasLine =>
        Array.isArray(line) && line.every((point) => typeof point === 'number'),
    );
  } catch {
    return [];
  }
}

/**
 * Determines whether a finished drawing has enough stroke data to be worth
 * contributing to the shared database, mirroring the original Picaco rule.
 *
 * @param drawing - JSON-serialized drawing data.
 * @returns Whether the drawing should be sent to the backend.
 */
export function isDrawingWorthSaving(drawing: string): boolean {
  return drawing.length > MIN_SAVED_DRAWING_LENGTH;
}

/**
 * Converts a stored Picaco drawing into the backend payload expected by the
 * `SAVE_DRAWING` daily action.
 *
 * @param state - Finished Picaco state containing today's drawings.
 * @param cardsById - Prompt cards keyed by id for fast lookup.
 * @param playerId - Authenticated Firebase uid of the submitting player.
 * @returns Save-ready drawings keyed by a unique storage id.
 */
export function buildSavePayload(
  state: GameState,
  cardsById: Record<string, DailyPicacoCard>,
  playerId: string,
): Record<string, DrawingToSave> {
  return state.drawings.reduce<Record<string, DrawingToSave>>(
    (accumulator, { cardId, drawing }, index) => {
      if (!isDrawingWorthSaving(drawing)) {
        return accumulator;
      }

      const card = cardsById[cardId];
      if (!card) {
        return accumulator;
      }

      const key = [card.id, playerId, `${Date.now()}-${index}`].join(
        SAVE_KEY_SEPARATOR,
      );

      accumulator[key] = {
        drawing,
        cardId: card.id,
        level: card.level,
        playerId,
        successRate: 0,
        text: card.text,
      };

      return accumulator;
    },
    {},
  );
}

/**
 * Builds SVG path strings from Picaco lines so saved drawings can be
 * previewed without a `<canvas>` element.
 *
 * @param lines - Parsed canvas lines.
 * @returns One SVG path string per line.
 */
export function getDrawingPaths(lines: CanvasLine[]): string[] {
  return lines.map((line) => {
    let path = '';

    for (let index = 0; index + 3 < line.length; index += 2) {
      path += `M${line[index]},${line[index + 1]} L${line[index + 2]},${line[index + 3]}`;
    }

    return path;
  });
}

/**
 * Clamps a pointer coordinate to Picaco's normalized SVG drawing area.
 *
 * @param value - Raw coordinate in viewBox space.
 * @returns The clamped coordinate.
 */
export function clampCanvasPoint(value: number): number {
  return Math.max(0, Math.min(CANVAS_VIEWBOX_SIZE, Math.round(value)));
}

/**
 * Counts how many finished drawings in a list are worth saving.
 *
 * @param drawings - Finished Picaco drawings.
 * @returns The number of drawings that pass the save threshold.
 */
export function countAcceptedDrawings(drawings: PicacoDrawing[]): number {
  return drawings.filter(({ drawing }) => isDrawingWorthSaving(drawing)).length;
}
