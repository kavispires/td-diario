import dailySfxButtonFile from '@assets/sounds/daily-sfx-button.mp3';
import { useUserPreferencesStore } from '@store/useUserPreferencesStore';
import { Howl } from 'howler';
import type { PanicoDurationScale } from './types';

/**
 * Dedicated Howler instance for Panico's per-button countdown alert. Holds
 * one sprite per {@link PanicoDurationScale} tier, each roughly as long as
 * that tier's timer, so the alert plays through for the button's duration.
 */
export const buttonCountdownSound = new Howl({
  src: [dailySfxButtonFile],
  volume: 0.2,
  mute: !useUserPreferencesStore.getState().soundEnabled,
  sprite: {
    normal: [0, 7000],
    quick: [7500, 11000],
    long: [12000, 22000],
  },
});

// Keep the Howl instance's mute state in sync with the user's persisted
// sound preference, wherever it's toggled from (e.g. the header icon).
useUserPreferencesStore.subscribe((state, prevState) => {
  if (state.soundEnabled !== prevState.soundEnabled) {
    buttonCountdownSound.mute(!state.soundEnabled);
  }
});

/**
 * Starts Panico's countdown alert for the given button duration tier,
 * stopping any alert already in progress first.
 *
 * @param durationScale Duration tier of the active button, selecting the matching sprite.
 */
export function playCountdownSound(durationScale: PanicoDurationScale) {
  buttonCountdownSound.stop();
  buttonCountdownSound.play(durationScale);
}

/**
 * Stops Panico's countdown alert, if one is currently playing.
 */
export function stopCountdownSound() {
  buttonCountdownSound.stop();
}
