import { dailySoundEffects } from '@utils/soundEffects';

/**
 * Starts Panico's looping countdown alert using the shared Howler sprite.
 *
 * @returns The Howler playback id so the caller can stop just this sound.
 */
export function playCountdownSound(): number {
  return dailySoundEffects.play('timer');
}

/**
 * Stops a previously-started Panico countdown alert.
 *
 * @param playbackId Howler playback id returned by {@link playCountdownSound}.
 */
export function stopCountdownSound(playbackId: number | null) {
  if (playbackId !== null) {
    dailySoundEffects.stop(playbackId);
  }
}
