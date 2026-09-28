import { useAppRuntimeStore } from '@store/useAppRuntimeStore';
import { useCallback } from 'react';

/**
 * Returns a `translate` function that picks the value matching the app's
 * current language (falling back to Portuguese) from a {@link
 * DualLanguageValue}-shaped object.
 *
 * @returns A `translate` function accepting a dual-language value and
 *   returning the value for the active language.
 */
export function useDualTranslate() {
  const language = useAppRuntimeStore((state) => state.language);

  const translate = useCallback(
    <T>(value: DualLanguageValue<T> | { en: T; pt: T }) =>
      value[language] ?? value.pt,
    [language],
  );

  return translate;
}
