import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines conditional class names (via `clsx`) and resolves conflicting
 * Tailwind utility classes (via `tailwind-merge`), so later classes safely
 * override earlier ones (e.g. `cn('p-2', condition && 'p-4')` -> `'p-4'`).
 *
 * @param inputs Any mix of strings, arrays, or objects accepted by `clsx`.
 * @returns The merged, deduplicated class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
