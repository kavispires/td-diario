/**
 * Supported genders for kids in the local Pirralhos profile library.
 */
export type KidGender = 'boy' | 'girl';

/**
 * Static profile data for one reusable Pirralhos kid portrait.
 */
export type KidProfile = {
  /**
   * Id matching the image-card asset path for this kid.
   */
  id: string;
  /**
   * Localized display name shown beside the portrait.
   */
  name: DualLanguageValue<string>;
  /**
   * Gender used to render the small profile glyph.
   */
  gender: KidGender;
  /**
   * Height clue shown on the card, in centimeters.
   */
  height: number;
  /**
   * Accent color used in the portrait frame and badges.
   */
  color: string;
};

/**
 * Total accusation attempts available in Pirralhos before the player loses.
 */
export const PIRRALHOS_TOTAL_HEARTS = 3;

/**
 * Local catalogue of the reusable kid profiles referenced by the daily
 * payload's `kidId` values.
 */
export const KIDS_LIBRARY: Dictionary<KidProfile> = {
  'us-gb-231': {
    id: 'us-gb-231',
    name: { en: 'Miles', pt: 'Marcus Vinícius' },
    gender: 'boy',
    height: 124,
    color: '#2b72ff',
  },
  'us-gb-232': {
    id: 'us-gb-232',
    name: { en: 'Penny', pt: 'Penélope' },
    gender: 'girl',
    height: 120,
    color: '#ff69c0',
  },
  'us-gb-233': {
    id: 'us-gb-233',
    name: { en: 'Dylan', pt: 'Daniel' },
    gender: 'boy',
    height: 109,
    color: '#41a00b',
  },
  'us-gb-234': {
    id: 'us-gb-234',
    name: { en: 'Sandy', pt: 'Sabrina' },
    gender: 'girl',
    height: 100,
    color: '#962196',
  },
  'us-gb-235': {
    id: 'us-gb-235',
    name: { en: 'Brent', pt: 'Breno' },
    gender: 'boy',
    height: 122,
    color: '#e54122',
  },
  'us-gb-236': {
    id: 'us-gb-236',
    name: { en: 'Alice', pt: 'Alice' },
    gender: 'girl',
    height: 117,
    color: '#ffd800',
  },
  'us-gb-237': {
    id: 'us-gb-237',
    name: { en: 'Isaac', pt: 'Igor' },
    gender: 'boy',
    height: 127,
    color: '#ffffff',
  },
  'us-gb-238': {
    id: 'us-gb-238',
    name: { en: 'Anna', pt: 'Aninha' },
    gender: 'girl',
    height: 104,
    color: '#ff8c00',
  },
  'us-gb-239': {
    id: 'us-gb-239',
    name: { en: 'Linus', pt: 'Lino' },
    gender: 'boy',
    height: 112,
    color: '#008080',
  },
  'us-gb-240': {
    id: 'us-gb-240',
    name: { en: 'Matilda', pt: 'Matilda' },
    gender: 'girl',
    height: 115,
    color: '#8b4513',
  },
};
