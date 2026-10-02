/**
 * This file holds the "real", per-game daily-payload types that replace
 * `PlaceholderGameData` (see `puzzles.ts`) as each game gets ported with
 * its final data model. Add one exported type per ported game here, and
 * reference it from `GamesEntries`/`ContributionsEntries` in `puzzles.ts`.
 */

/**
 * One draggable thing that Conjuntos asks the player to place in the
 * correct area of the diagram.
 */
export type DailyConjuntosThing = {
  /**
   * Sprite id used to render the thing.
   */
  id: string;
  /**
   * Word shown under the sprite.
   */
  name: string;
  /**
   * Correct area of the diagram for this thing: `1` for the left circle,
   * `2` for the right circle, and `0` for the intersection.
   */
  rule?: 0 | 1 | 2;
};

/**
 * One secret circle rule revealed after finishing Conjuntos.
 */
export type DailyConjuntosRule = {
  /**
   * Stable identifier of the grammar rule.
   */
  id: string;
  /**
   * Human-readable rule text shown in the results splash.
   */
  text: string;
  /**
   * Difficulty level of the rule, from `1` to `5`.
   */
  level: number;
  /**
   * Starter thing already placed inside that circle when the game begins.
   */
  thing: DailyConjuntosThing;
};

/**
 * Today's Conjuntos challenge payload.
 */
export type DailyConjuntosEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Discriminator for Conjuntos payloads.
   */
  type: 'conjuntos';
  /**
   * Dataset identifier forwarded by the backend for today's rule set.
   */
  setId: string;
  /**
   * Title hinting at the grammar category used by today's hidden rules.
   */
  title: string;
  /**
   * Difficulty rating shown with stars in the game header.
   */
  level: number;
  /**
   * Secret rule for the left/yellow circle.
   */
  rule1: DailyConjuntosRule;
  /**
   * Secret rule for the right/red circle.
   */
  rule2: DailyConjuntosRule;
  /**
   * Starter thing already placed in the intersection.
   */
  intersectingThing: DailyConjuntosThing;
  /**
   * Remaining things the player must place over the course of the puzzle.
   */
  things: DailyConjuntosThing[];
};

/**
 * Today's Organiku challenge payload.
 */
export type DailyOrganikuEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  type: 'organiku';
  /**
   * Id of the item set used to build today's grid.
   */
  setId: string;
  /**
   * Title describing the theme of today's grid.
   */
  title: string;
  /**
   * Ids of the distinct items placed in the grid.
   */
  itemsIds: string[];
  /**
   * Flattened `gridSize x gridSize` grid of item ids.
   */
  grid: string[];
  /**
   * Grid indexes revealed from the start (already solved for the player).
   */
  defaultRevealedIndexes: number[];
};

/**
 * One statement card shown for a kid in today's Pirralhos mystery.
 */
export type DailyPirralhosKidEntry = {
  /**
   * Id of the kid whose portrait, name, and profile should be shown.
   */
  kidId: string;
  /**
   * Statement spoken by that kid during today's mystery.
   */
  statement: DualLanguageValue<string>;
};

/**
 * Today's Pirralhos challenge payload.
 */
export type DailyPirralhosEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Discriminator for Pirralhos payloads.
   */
  type: 'pirralhos';
  /**
   * Ordered list of kids around the accusation circle and their statements.
   */
  kids: DailyPirralhosKidEntry[];
  /**
   * Id of the kid who actually took the toy.
   */
  culpritId: string;
  /**
   * Ids of the kids whose statements are lies in today's mystery.
   */
  liarsIds: string[];
  /**
   * Public liar-count hint shown to the player, which may be exact or a
   * one-off range endpoint depending on the puzzle.
   */
  possibleLiars: number;
};

/**
 * One corridor within today's Portais run.
 */
export type DailyPortaisCorridor = {
  /**
   * Target word the player must discover for this corridor.
   */
  passcode: string;
  /**
   * Ids of the image cards previewed by this corridor's portals.
   */
  imagesIds: string[];
  /**
   * Rotating three-letter words that each contribute one letter to the
   * passcode.
   */
  words: string[];
  /**
   * Optional move target returned by the payload for this corridor.
   */
  goal?: number;
};

/**
 * Today's Portais challenge payload.
 */
export type DailyPortaisEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Discriminator for Portais payloads.
   */
  type: 'portais';
  /**
   * Optional opaque set identifier returned alongside the corridor bundle.
   */
  setId?: string;
  /**
   * Suggested move target for the whole run.
   */
  goal: number;
  /**
   * Corridors the player must clear, in order.
   */
  corridors: DailyPortaisCorridor[];
};

/**
 * Today's Vitral challenge payload.
 */
export type DailyVitralEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Discriminator for Vitral payloads.
   */
  type: 'vitral';
  /**
   * Title of the artwork being reassembled.
   */
  title: string;
  /**
   * Image card id used to build the source artwork URL.
   */
  cardId: string;
  /**
   * Piece ids shuffled into the starting board order.
   */
  pieces: number[];
};

/**
 * One alien-language attribute shown in Alienado's dictionary.
 */
export type DailyAlienadoAttribute = {
  /**
   * Stable identifier for the attribute entry.
   */
  id: string;
  /**
   * Human-readable name revealed after the round.
   */
  name: string;
  /**
   * Short explanation of the concept shared by the example items.
   */
  description: string;
  /**
   * Alien symbol id representing this attribute.
   */
  spriteId: string;
  /**
   * Example item ids that demonstrate the attribute.
   */
  itemsIds: string[];
};

/**
 * One requested delivery the player must decode in Alienado.
 */
export type DailyAlienadoRequest = {
  /**
   * Ordered alien symbol ids describing the requested item.
   */
  spritesIds: string[];
  /**
   * Correct item id that matches the requested symbol combination.
   */
  itemId: string;
};

/**
 * Today's Alienado challenge payload.
 */
export type DailyAlienadoEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Discriminator for Alienado payloads.
   */
  type: 'alienado';
  /**
   * Stable identifier for the attribute set used to generate the puzzle.
   */
  setId: string;
  /**
   * Alien-language dictionary entries shown before and after the round.
   */
  attributes: DailyAlienadoAttribute[];
  /**
   * Ordered list of requested symbol combinations the player must satisfy.
   */
  requests: DailyAlienadoRequest[];
  /**
   * Correct answer encoded as `item-item-item-item`.
   */
  solution: string;
  /**
   * Available item ids that can be placed into the request slots.
   */
  itemsIds: string[];
};

/**
 * Today's Estoquista challenge payload.
 */
export type DailyEstoquistaEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Discriminator for Estoquista payloads.
   */
  type: 'estoquista';
  /**
   * Title displayed above the warehouse for today's theme.
   */
  title: string;
  /**
   * Ordered list of goods the player must stock onto the shelves.
   */
  goods: string[];
  /**
   * Five customer orders to resolve, with exactly one item missing from stock.
   */
  orders: string[];
};

/**
 * Today's Arte Ruim challenge payload.
 */
export type DailyArteRuimEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Discriminator for Arte Ruim payloads.
   */
  type: 'arte-ruim';
  /**
   * Original language tag carried by the daily payload.
   */
  language: 'pt' | 'en';
  /**
   * Identifier of the source phrase card used for today's drawings.
   */
  cardId: string;
  /**
   * Secret expression the player must uncover letter by letter.
   */
  text: string;
  /**
   * Serialized drawing strokes shown as the visual clues for the phrase.
   */
  drawings: string[];
  /**
   * Identifiers of the original submitted drawings used in today's set.
   */
  dataIds: string[];
};

/**
 * Today's Mapeamento challenge payload.
 */
export type DailyMapeamentoEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Discriminator for Mapeamento payloads.
   */
  type: 'mapeamento';
  /**
   * Dataset identifier forwarded by the backend for the chosen location pool.
   */
  setId: string;
  /**
   * Correct location answer the player is trying to identify.
   */
  location: string;
  /**
   * Ordered clue list; the first clue is available immediately and each
   * mistake reveals one more clue.
   */
  clues: string[];
  /**
   * Original language tag carried by the daily payload.
   */
  language: 'pt' | 'en';
};

/**
 * One solved quartet hidden inside today's Quartetos board.
 */
export type DailyQuartetosSet = {
  /**
   * Unique identifier for the hidden quartet.
   */
  id: string;
  /**
   * Theme/title revealed once the quartet is found.
   */
  title: string;
  /**
   * Ids of the four items that belong to this quartet.
   */
  itemsIds: string[];
  /**
   * Difficulty bucket for this quartet, from easiest (`0`) to hardest (`3`).
   */
  level: number;
};

/**
 * Today's Quartetos challenge payload.
 */
export type DailyQuartetosEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Discriminator for Quartetos payloads.
   */
  type: 'quartetos';
  /**
   * Dataset identifier forwarded by the backend for today's quartet pool.
   */
  setId: string;
  /**
   * Flattened 4x4 board of item ids the player must regroup into quartets.
   */
  grid: string[];
  /**
   * Difficulty rating forwarded by the daily payload.
   */
  difficulty: number;
  /**
   * The four hidden quartets that partition the board.
   */
  sets: DailyQuartetosSet[];
};

/**
 * Today's Filmaco challenge payload.
 */
export type DailyFilmacoEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Discriminator for Filmaco payloads.
   */
  type: 'filmaco';
  /**
   * Secret movie title the player must guess letter by letter.
   */
  title: string;
  /**
   * Ids of the item clues shown for today's movie.
   */
  itemsIds: string[];
  /**
   * Release year shown alongside the visual clues.
   */
  year: number | string;
  /**
   * Whether today's puzzle references a double feature instead of a single
   * movie release.
   */
  isDoubleFeature?: boolean;
};

/**
 * One prompt card that Picaco can ask the player to draw.
 */
export type DailyPicacoCard = {
  /**
   * Unique identifier for the prompt card.
   */
  id: string;
  /**
   * Prompt text shown to the player during the timed round.
   */
  text: string;
  /**
   * Difficulty level forwarded when the finished drawing is saved.
   */
  level: number;
};

/**
 * Today's Picaco challenge payload.
 */
export type DailyPicacoEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Discriminator for Picaco payloads.
   */
  type: 'picaco';
  /**
   * Pool of prompt cards from which today's timed drawings are selected.
   */
  cards: DailyPicacoCard[];
};

/**
 * Today's Palavreado challenge payload.
 */
export type DailyPalavreadoEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Discriminator for Palavreado payloads.
   */
  type: 'palavreado';
  /**
   * Diagonal keyword that anchors the square board's fixed letters.
   */
  keyword: string;
  /**
   * Flattened `size x size` board letters, including the fixed diagonal.
   */
  letters: string[];
  /**
   * Correct horizontal words the player must reconstruct, one per row.
   */
  words: string[];
  /**
   * Bonus-valid words that award extra points when formed in any row.
   */
  scoringWords: string[];
};

/**
 * Supported portrait styles that Ta Na Cara can render for each suspect.
 */
export type DailyTaNaCaraVariant = 'gb' | 'rl' | 'px' | 'fx';

/**
 * One testimony prompt that Ta Na Cara asks the player to judge.
 */
export type DailyTaNaCaraTestimony = {
  /**
   * Unique identifier of the testimony being answered.
   */
  testimonyId: string;
  /**
   * Prompt text shown to the player for this testimony.
   */
  question: string;
  /**
   * Whether this testimony should only appear when NSFW mode is enabled.
   */
  nsfw?: boolean;
  /**
   * Preferred suspect ids that can be sampled for this testimony before the
   * game falls back to the day's wider suspect pool.
   */
  suspectsIds?: string[];
};

/**
 * Today's Ta Na Cara challenge payload.
 */
export type DailyTaNaCaraEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Discriminator for Ta Na Cara payloads.
   */
  type: 'ta-na-cara';
  /**
   * All testimonies that can appear in today's run.
   */
  testimonies: DailyTaNaCaraTestimony[];
  /**
   * Fallback suspect pool used to complete each testimony's roster.
   */
  suspectsIds: string[];
  /**
   * Optional display names keyed by suspect id.
   */
  names?: Record<string, string>;
  /**
   * Optional default portrait style for today's suspect images.
   */
  variant?: DailyTaNaCaraVariant;
};

/**
 * Today's Vitrais Infinitos challenge payload.
 */
export type DailyVitraisInfinitosEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Discriminator for Vitrais Infinitos payloads.
   */
  type: 'vitrais-infinitos';
  /**
   * Title describing the stained-glass image of the day.
   */
  title: string;
  /**
   * Card id used to build the source image URL for every puzzle piece.
   */
  cardId: string;
  /**
   * Current permutation of piece ids that seeds today's board.
   */
  pieces: number[];
};
