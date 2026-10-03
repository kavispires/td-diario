import { CircleHelp, ShieldAlert, ShieldCheck, Speech } from 'lucide-react';
import type { EllipsePosition } from './helpers';
import type { KidAssessment } from './types';

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
 * Default note marker assigned to every kid before the player adds any
 * personal annotations.
 */
export const DEFAULT_ASSESSMENT: KidAssessment = 'unknown';

/**
 * Order used when cycling a kid's note marker through every available
 * assessment state.
 */
export const ASSESSMENT_ORDER = [
  'liar',
  'innocent',
  'culprit',
  'unknown',
] as const;

/**
 * Precomputed portrait and connector positions for each supported number
 * of kids arranged around Pirralhos' ellipse.
 */
export const HARDCODED_POSITIONS: Record<number, EllipsePosition[]> = {
  3: [
    { x: 50, y: 10, angle: 45 },
    { x: 85, y: 60, angle: 0 },
    { x: 15, y: 60, angle: -45 },
  ],
  4: [
    { x: 50, y: 10, angle: 45 },
    { x: 85, y: 40, angle: -45 },
    { x: 50, y: 75, angle: 45 },
    { x: 15, y: 40, angle: -45 },
  ],
  5: [
    { x: 50, y: 5, angle: 45 },
    { x: 85, y: 35, angle: -45 },
    { x: 75, y: 75, angle: 0 },
    { x: 25, y: 75, angle: 45 },
    { x: 15, y: 35, angle: -45 },
  ],
  6: [
    { x: 50, y: 5, angle: 45 },
    { x: 85, y: 25, angle: 90 },
    { x: 85, y: 60, angle: -45 },
    { x: 50, y: 85, angle: 45 },
    { x: 15, y: 60, angle: 90 },
    { x: 15, y: 25, angle: -45 },
  ],
  7: [
    { x: 50, y: 5, angle: 45 },
    { x: 85, y: 25, angle: 90 },
    { x: 85, y: 55, angle: 115 },
    { x: 75, y: 85, angle: 0 },
    { x: 25, y: 85, angle: 65 },
    { x: 15, y: 55, angle: 90 },
    { x: 15, y: 25, angle: -45 },
  ],
  8: [
    { x: 50, y: 5, angle: 45 },
    { x: 85, y: 20, angle: 90 },
    { x: 85, y: 45, angle: 90 },
    { x: 85, y: 70, angle: -45 },
    { x: 50, y: 85, angle: 45 },
    { x: 15, y: 70, angle: 90 },
    { x: 15, y: 45, angle: 90 },
    { x: 15, y: 20, angle: -45 },
  ],
  9: [
    { x: 50, y: 5, angle: 45 },
    { x: 85, y: 15, angle: 90 },
    { x: 85, y: 40, angle: 90 },
    { x: 85, y: 65, angle: -75 },
    { x: 75, y: 88, angle: 45 },
    { x: 25, y: 88, angle: 75 },
    { x: 15, y: 65, angle: 90 },
    { x: 15, y: 40, angle: 90 },
    { x: 15, y: 15, angle: -45 },
  ],
  10: [
    { x: 50, y: 5, angle: 45 },
    { x: 85, y: 15, angle: 90 },
    { x: 85, y: 37, angle: 90 },
    { x: 85, y: 60, angle: 90 },
    { x: 85, y: 83, angle: -45 },
    { x: 50, y: 90, angle: 45 },
    { x: 15, y: 83, angle: 90 },
    { x: 15, y: 60, angle: 90 },
    { x: 15, y: 37, angle: 90 },
    { x: 15, y: 15, angle: -45 },
  ],
} satisfies Record<number, Array<{ x: number; y: number; angle: number }>>;

/**
 * Height adjustments paired with each possible kid count to keep the
 * ellipse comfortably spaced on small screens.
 */
export const HEIGHT_EXTRA_BY_COUNT = [
  0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 0.4, 0.7, 0.7, 0.5,
];

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

/**
 * Visual labels, colors, and icons associated with each assessment marker
 * shown on Pirralhos kid cards.
 */
export const ASSESSMENT_META = {
  unknown: {
    label: 'Sem marca',
    ariaLabel: 'sem marcação',
    classes: 'bg-card text-subtle-foreground',
    icon: CircleHelp,
  },
  culprit: {
    label: 'Culpado',
    ariaLabel: 'marcado como culpado',
    classes: 'bg-gold-soft text-foreground',
    icon: ShieldAlert,
  },
  liar: {
    label: 'Mentiroso',
    ariaLabel: 'marcado como mentiroso',
    classes: 'bg-secondary/15 text-secondary',
    icon: Speech,
  },
  innocent: {
    label: 'Inocente',
    ariaLabel: 'marcado como inocente',
    classes: 'bg-success/15 text-success',
    icon: ShieldCheck,
  },
} satisfies Record<
  KidAssessment,
  {
    label: string;
    ariaLabel: string;
    classes: string;
    icon: typeof CircleHelp;
  }
>;
