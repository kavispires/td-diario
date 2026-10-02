# Porting games: tardedivertida → td-diario

General notes on what changes when porting a Daily game from
`tardedivertida/src/pages/Daily/games/<Name>` to
`td-diario/src/engines/games/<Name>`. Use this as a checklist for future
ports; the "Worked example: Organiku" section at the end shows these
changes applied to a real game.

## UI framework and styling

- Replace Ant Design components (`Layout`, `Modal`, `Typography`, `Flex`,
  `Badge`, etc.) with td-diario's own `components/ui` kit (`Button`,
  `Text`/`Title`, `Badge`, `Popconfirm`, ...) built on Tailwind CSS.
- Drop the game's dedicated `utils/styles.scss` stylesheet and its
  BEM-style class names in favor of Tailwind utility classes applied
  directly in JSX, composed with `cn()` when conditional.
- Rework animations built on the original's `getAnimation(...)` helper into
  `motion/react` primitives used directly (`motion.div`/`motion.button` with
  `initial`/`animate`/`transition`, or `layoutId` for shared-element
  transitions). Import from `motion/react`, never `framer-motion`.
- Prefer real semantic/interactive elements (`<button type="button">`) over
  non-interactive elements with an `onClick` (e.g. `motion.div`).

## Game scaffolding

- Remove the original `DailyGame`/`DailyContent`/`GameHeader`/`Menu`/
  `Region`/`ShowResultsButton` layout scaffold; the ported game renders its
  own layout directly and plugs into td-diario's shared `GameScreen`/
  `ChromeHeader` shell instead.
- Replace the original's single `SETTINGS: GameSettings` object (key, route,
  type, release date, version, color, emoji, hub icon, name, tagline, plus
  any game-specific constants) with:
  - `gameInfo: GameInfo` in the game's `info.tsx` (metadata only), plus a
    separate `Logo` SVG component.
  - Register the game in **both** `engines/index.ts`'s `gameInfos` map and
    `screens/GameScreen.tsx`'s lazy `gameComponents` map, using the same
    kebab-case id in both places.
- Localization: drop the `Translate` component (`pt`/`en` props with
  `values` interpolation) in favor of hardcoded pt-BR copy, matching
  td-diario's primarily-Portuguese convention.

## State management

- Replace `useDailyGameState`/`useDailySessionState`/`useDailyLocalToday`
  (tied to the original Daily framework) with td-diario's own
  `useDailyLocalToday`/`loadLocalToday` hook pair (`@hooks/useDailyLocalToday`).
- Derive the local-storage key from `gameInfo.id` via
  `gameIdToLocalTodayKey`, instead of a hardcoded `SETTINGS.KEY` string.
- Replace `status: string` with `STATUSES.*` string constants with the
  shared `LifecycleStatus` union (`'in-progress' | 'win' | 'lose'`, plus
  `'idle'` via `GAME_LIFECYCLE_STATUS` in `@utils/constants`) baked into the
  shared `DefaultGameState<T>` generic (`types/puzzles.ts`) that every
  ported game's `GameState` should extend. Use `getGameStatuses(status)`
  (`@utils/helpers`) to derive `isWin`/`isLose`/`isComplete`.
- Prefer deriving starting values (hearts, lives, attempts) from the day's
  data (e.g. `data.itemsIds.length`) over hardcoded constants, when the
  original's constant was really just "one per distinct item" or similar.
- `GameState` should include `score` and `progress` fields (from
  `DefaultGameState<T>`), updated only at the moments state meaningfully
  changes (e.g. on a correct match), not on every interaction:
  - `score`: incremented using whatever scoring rule fits the game.
  - `progress`: a 0–1 share of completion (0 = only default/free state,
    1 = fully solved).

## Results presentation

- Original games show results in an Ant Design `Modal` with a
  `ResultsModalContent` component (win/lose banner, item recap, shareable
  result text, next-game suggestion).
- The port shows a fullscreen splash overlay component instead (e.g.
  `ResultsSplash`), triggered by a "Ver resultado" button once the game
  completes. No modal, no share/clipboard, no next-game suggestion (see
  "Removed / not yet ported" below).

## Removed / not yet ported features

These original features don't have a td-diario equivalent yet; skip them
when porting unless/until the underlying support is added:

- `useMarkAsPlayed` daily-play tracking.
- Shareable results: `writeResult`/`generateShareableResult`/
  `CopyToClipboardResult` (the emoji-grid copy-to-clipboard summary) and
  `NextGameSuggestion`.
- The `currentUser: Me` prop threaded into the original game component
  (auth isn't wired into individual game components in td-diario).

## Analytics

- Port `logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'win'|'lose'))`
  calls to `logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.id, 'win'|'lose'))`,
  using the shared helper in `services/firebase.ts`. It composes the same
  `daily_<gameId>_<action>` event name, but from the kebab-case
  `gameInfo.id` instead of the original's uppercase `SETTINGS.KEY`.
- Only fire these once per outcome (at the same state-transition point the
  original did), not on every render/interaction.

## Types and documentation

- Move each game's daily payload type (e.g. `DailyOrganikuEntry`) out of the
  game-local `utils/types.ts` into the shared `types/games.ts`, referenced
  from `GamesEntries`/`ContributionsEntries` in `types/puzzles.ts`. Keep
  `GameState`/`SessionState`/tracker types local to the game's own
  `utils/types.ts`.
- Add JSDoc to every type, property, component prop, and function, per
  td-diario's documentation convention (the originals are largely
  undocumented).
- Use `type` instead of `interface`; avoid `any`.

## Misc

- Sound/vibration calls (`playSFX`, `vibrate`) generally keep the same call
  sites; just point them at td-diario's own `@utils/soundEffects`/
  `@utils/vibrate` modules.
- Use the path aliases (`@components`, `@hooks`, `@store`, `@utils`,
  `@services`, `@layouts`, `@screens`) instead of the original's aliases
  (`@pages`, `@icons`, etc.), and prefer named exports.

---

## Worked example: Organiku

Concrete changes applied when porting Organiku
(`tardedivertida/src/pages/Daily/games/Organiku` →
`td-diario/src/engines/games/Organiku`), illustrating the checklist above:

- **UI/styling**: Ant Design (`Layout`, `Modal`, `Typography`, `Flex`,
  `Badge`) → td-diario's `components/ui` kit + Tailwind; dropped
  `utils/styles.scss`; tile flip animation moved from `getAnimation('flipInY')`
  to inline `motion.button` props; tiles became real `<button>` elements.
- **Scaffolding**: removed `DailyGame`/`DailyContent`/`GameHeader`/`Menu`/
  `Region`/`ShowResultsButton`; `SETTINGS` object split into `gameInfo` +
  `Logo`, registered in `engines/index.ts` and `GameScreen`.
- **State**: `useDailyGameState`/`useDailySessionState`/`useDailyLocalToday`
  → td-diario's `useDailyLocalToday`; storage key derived from `gameInfo.id`
  via `gameIdToLocalTodayKey`; `STATUSES.*` strings → `LifecycleStatus`
  union via `DefaultGameState<T>`; `hearts` derived from
  `data.itemsIds.length` instead of a fixed `SETTINGS.HEARTS = 5`; added
  `score` (hearts-based, doubled on the winning match) and `progress`
  (share of non-default tiles matched), both updated only on matches.
- **Results**: Ant Design `Modal` + `ResultsModalContent` → fullscreen
  `ResultsSplash` overlay (no share/clipboard, no next-game suggestion).
- **Removed**: `useMarkAsPlayed`; `writeResult`/`generateShareableResult`/
  `CopyToClipboardResult`/`NextGameSuggestion`; the `currentUser: Me` prop.
- **Analytics**: `getAnalyticsEventName(SETTINGS.KEY, 'win'|'lose')` →
  `getGameAnalyticsEventName(gameInfo.id, 'win'|'lose')`, fired at the same
  win/lose transition points in `useOrganikuEngine.ts`.
- **Types/docs**: `DailyOrganikuEntry` moved to `types/games.ts`;
  `GameState`/`SessionState`/`OrganikuTracker` stayed in the game's
  `utils/types.ts`; JSDoc added throughout.
- **Misc**: `playSFX`/`vibrate` call sites unchanged, just repointed at
  td-diario's `@utils/soundEffects`/`@utils/vibrate`.
