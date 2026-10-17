/// <reference types="vite/client" />

/**
 * App version string injected at build time from `package.json`'s
 * `version` field (see `vite.config.ts`'s `define` option), kept in sync
 * by the pre-commit version-bump script and refreshed on every build.
 */
declare const __APP_VERSION__: string;
