import { useMemo } from 'react';
// Internal
import { useTDBaseUrl } from './useTDBaseUrl';

/**
 * Returns the full image URL for a given card ID and source type.
 *
 * This hook constructs the image URL by replacing hyphens in the `cardId` with slashes,
 * appending the `.jpg` extension, and prefixing it with the base URL determined by the `source`.
 *
 * @param cardId - The unique identifier of the card, with hyphens to be replaced by slashes.
 * @param source - The source type for the image, either `'images'` or `'classic'`. Defaults to `'images'`.
 * @returns The complete URL string for the card image.
 */
export function useTDImageCardUrl(
  cardId: string,
  source: 'images' | 'classic' = 'images',
): string {
  const { baseUrl } = useTDBaseUrl(source);

  const imageURL = useMemo(() => {
    return cardId.replace(/-/g, '/');
  }, [cardId]);

  return `${baseUrl}/${imageURL}.jpg`;
}
