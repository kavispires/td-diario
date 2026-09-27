# GitHub Copilot Instructions — TD Diário

## Project context

- This is a React 19 + TypeScript + Vite application using Yarn 4.
- Use functional components and hooks. Keep components focused and reusable.
- User-facing text is primarily in Brazilian Portuguese (`pt-BR`).
- Prefer named exports over default exports.
- Do not overwrite unrelated working-tree changes.
- Commit messages follow Conventional Commits: `feat(scope):`, `fix(scope):`, `refactor(scope):`, or `chore(scope):`, summary in imperative/present tense (scope is typically a directory or feature area, e.g. `layout`, `hub`, `components`).

## Project structure and imports

- Use the existing path aliases for imports from `src`:
  - `@components`
  - `@hooks`
  - `@layouts`
  - `@screens`
  - `@services`
  - `@store`
  - `@utils`
- Do not use invalid or invented aliases such as `@pages/Dev/utils/iconsCollection`.
- Prefer direct module imports; do not add barrel exports unless explicitly requested.
- Use `import type` for type-only imports.
- Keep imports organized by Biome.
- Avoid adding utility-library imports such as `lodash` when a focused local implementation is sufficient.
- Path aliases are a single TS wildcard mapping (`"@*": ["./src/*"]` in `tsconfig.app.json`), not individually declared. `@foo/bar` always resolves to `src/foo/bar` — an alias is only valid if that directory actually exists under `src`.

## Architecture

- **App shell composition** (`App.tsx` → `layouts/`): `AuthWrapper` gates on Firebase auth state (`useAuthStore`) and shows `LoginScreen` when signed out; `AuthenticatedApp` then gates on `useGetDailyChallenges()` and redirects to `/game/:id` if `useUserPreferencesStore`'s `ongoingGame` is set; only then does `AppLayout` render the routed screens with `ChromeHeader`/`ChromeNav`.
- **Game engines** (`src/engines/{games,special,contributions}/<Name>/`): each has `info.tsx` (exports `gameInfo: GameInfo` metadata plus a `Logo` SVG component) and `index.tsx` (exports a `Daily<Name>Game` component). Adding a game requires registering it in **both** `engines/index.ts`'s `gameInfos` map **and** `screens/GameScreen.tsx`'s lazy `gameComponents` map, using the same kebab-case id in both places.
- **Data fetching**: all game/puzzle data comes from a single Firebase Callable Function (`dailyEngine`), invoked via `DAILY_API.run({ action, ... })` in `services/adapters.ts`. Add new server actions to `DAILY_API_ACTIONS` rather than creating new callables.
- **Shared-element launch animation**: clicking a `GameCard` sets `useAppRuntimeStore`'s `launchingGame`, which `GameLaunchOverlay` expands into a fullscreen splash sharing a `layoutId` with the card; once the lazy game chunk mounts, `GameScreen`'s `GameReadyNotifier` clears `launchingGame` and sets `activeGameId`, handing the same `layoutId` off to the logo slot in `ChromeHeader`. Route-driven orchestration lives in `useGameLaunchOrchestrator` — don't trigger this splash by other means.
- **Mobile app shell / PWA**: the layout intentionally lets the *document* scroll (not an inner container) so mobile browsers can auto-hide their address bar; `ChromeHeader`/`ChromeNav` rely on `sticky` positioning within that normal flow. `vite-plugin-pwa` generates the manifest (`vite.config.ts`); `index.html` additionally carries iOS-specific `apple-mobile-web-app-*` meta tags since Safari ignores the web manifest's `display: standalone`.

## React conventions

- React 19 components may accept `ref` directly as a prop; avoid `forwardRef` unless compatibility requires it.
- Keep state close to the components that own it.
- Use semantic HTML and explicit button types (`button`, `submit`, or `reset`).
- Do not use `any`; define a specific type, union, generic, or `unknown` with appropriate narrowing.

## Styling and accessibility

- Use Tailwind CSS utilities and preserve the existing visual language.
- Keep layouts mobile-first. Use `max-w-md` for mobile app content where appropriate.
- Decorative images must use `alt=""` and `aria-hidden="true"`.
- Meaningful images need descriptive alt text.
- Ensure interactive elements have accessible names and visible focus states.

## State and data ownership

- Keep persistent user preferences in `useUserPreferencesStore` (persisted to `localStorage` under the key in `LOCAL_STORAGE_KEYS.PREFERENCES`).
- Keep temporary app or game state in `useAppRuntimeStore`.
- Keep Firebase authentication state in `useAuthStore`.
- Do not persist runtime or authentication state unless explicitly required.
- Keep external-service integration in the appropriate service or hook rather than in presentational components.
- Reuse the existing `components/ui` kit (`Button`, `IconButton`, `Flex`, `Pill`, `TextInput`, `Title`/`Paragraph`/`Text`) instead of re-implementing the same Tailwind markup inline.

## Animation

- Import Motion from `motion/react`, never from `framer-motion`.
- Use `layoutId` only for shared-layout elements rendered within the same Motion tree.
- Prefer spring transitions for layout movement when they improve the interaction.
- Respect `prefers-reduced-motion` for non-essential animations.
- When animating any transform prop (`x`, `y`, `scale`, `rotate`) via a `motion` element's `style`, set *all* transform-related values through that same `style` object — never mix in a Tailwind transform class (e.g. `scale-110`) on a motion element, since Motion's inline `transform` silently overrides it.

## Documentation and JSDoc

- Add JSDoc to reusable hooks, stores, utilities, and UI component APIs.
- Use multi-line JSDoc comments only:

  ```ts
  /**
   * Describes the purpose of the function or component.
   */
  ```

- Document every public type property with its purpose. Keep property comments next to the property they describe.
- Document function and component parameters, return values, side effects, and thrown errors where applicable.
- Describe behavior rather than repeating TypeScript types in JSDoc.
- Keep JSDoc focused: do not add examples, implementation walkthroughs, or inner comments.

## TypeScript and constants

- Prefer precise types and discriminated unions over broad types.
- Use `type` instead of `interface` for object shapes, including component props; do not introduce new `interface` declarations.
- Use `as const` for constant objects whose keys and values should remain literal types.
- Avoid unnecessary type assertions; narrow values through control flow when possible.
- JSDoc every type declaration and every one of its properties, describing its purpose (see "Documentation and JSDoc" above).

## Services and environment

- `services/firebase.ts`'s `buildKey()` deliberately reconstructs the Firebase API key by reversing and joining three separate env vars — this is intentional obfuscation against scraping, not dead code; don't simplify it to a single `VITE__FIREBASE_API_KEY`.
- Env vars use a double-underscore `VITE__` prefix (not the Vite-standard single `VITE_`) throughout the codebase — match this exactly when adding new ones.
- `USE_FIRESTORE_EMULATOR` / `USE_FUNCTIONS_EMULATOR` in `services/firebase.ts` gate local emulator connections; leave them `false` unless intentionally testing against emulators.

## Validation

- Run Biome on changed files before finishing:

  `yarn biome check <files>`

- Run TypeScript validation after TypeScript changes:

  `yarn tsc -b`

- Run the production build for changes affecting application behavior, routing, assets, or configuration:

  `yarn build` (runs `tsc -b && vite build`)

- Other scripts: `yarn dev` (local server), `yarn lint` (Biome lint only), `yarn format` / `yarn format:check`, `yarn check` (format + lint), `yarn preview` (serve the production build), `yarn deploy` (build + publish `dist` to GitHub Pages via `gh-pages`).
- There is no automated test suite in this repository.
- Do not disable lint rules or weaken TypeScript settings to hide errors without a clear reason.
