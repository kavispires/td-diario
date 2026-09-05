# React + TypeScript + Vite

This project uses React, TypeScript, and Vite.

## Development

Install dependencies and start the development server:

```bash
yarn install
yarn dev
```

## Code quality

Biome handles formatting, import organization, and linting:

```bash
yarn format       # Format the project
yarn format:check # Check formatting without changes
yarn lint         # Run lint rules
yarn check        # Format, organize imports, and lint
yarn build        # Type-check and build for production
```

Formatting and checks run automatically for staged supported files before every commit through Husky and lint-staged.
