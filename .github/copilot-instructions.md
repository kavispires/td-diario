# GitHub Copilot Instructions — TD Diário

## Project context

- This is a React 19 + TypeScript + Vite application using Yarn 4.
- Use functional components and hooks. Keep components focused and reusable.
- User-facing text is primarily in Brazilian Portuguese (`pt-BR`).
- Prefer named exports over default exports.
- Do not overwrite unrelated working-tree changes.

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

- Keep persistent user preferences in `useUserSettingsStore`.
- Keep temporary app or game state in `useAppRuntimeStore`.
- Keep Firebase authentication state in `useAuthStore`.
- Do not persist runtime or authentication state unless explicitly required.
- Keep external-service integration in the appropriate service or hook rather than in presentational components.

## Animation

- Import Motion from `motion/react`, never from `framer-motion`.
- Use `layoutId` only for shared-layout elements rendered within the same Motion tree.
- Prefer spring transitions for layout movement when they improve the interaction.
- Respect `prefers-reduced-motion` for non-essential animations.

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
- Use `as const` for constant objects whose keys and values should remain literal types.
- Avoid unnecessary type assertions; narrow values through control flow when possible.

## Validation

- Run Biome on changed files before finishing:

  `yarn biome check <files>`

- Run TypeScript validation after TypeScript changes:

  `yarn tsc -b`

- Run the production build for changes affecting application behavior, routing, assets, or configuration:

  `yarn build`

- Do not disable lint rules or weaken TypeScript settings to hide errors without a clear reason.
