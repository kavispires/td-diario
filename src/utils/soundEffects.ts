/**
 * Names of sound effects games can request via {@link playSFX}. Kept as a
 * union so callers get autocomplete/typo-checking even before real audio
 * exists.
 */
export type SoundEffectName =
  | 'bubbleIn'
  | 'bubbleOut'
  | 'wee'
  | 'wrong'
  | 'win'
  | 'lose';

/**
 * Placeholder for playing a short sound effect. Currently a no-op: the app
 * doesn't have audio assets or an audio engine wired up yet. Games should
 * call this wherever they'd want feedback so wiring real audio later is a
 * one-line change here, not a per-game change.
 *
 * @param _name - Which effect to play.
 */
export function playSFX(_name: SoundEffectName): void {
  // Intentionally a no-op until real audio assets/engine are added.
}
