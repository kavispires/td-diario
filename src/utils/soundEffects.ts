import dailySfxFile from '@assets/sounds/daily-sfx.mp3';
import { useUserPreferencesStore } from '@store/useUserPreferencesStore';
import { Howl } from 'howler';
import { sample } from 'lodash';

export const dailySoundEffects = new Howl({
  src: [dailySfxFile],
  volume: 0.7,
  mute: !useUserPreferencesStore.getState().soundEnabled,
  sprite: {
    bubble1: [0, 75], // Clap sound 1
    bubble2: [100, 75], // Clap sound 2
    bubble3: [200, 75], // Clap sound 3
    addCorrect: [300, 300],
    addWrong: [550, 500],
    alienYay: [1000, 700],
    alienBoo: [1800, 800],
    wrong: [2600, 800],
    correct1: [3400, 300],
    correct2: [3700, 300],
    select: [4050, 150],
    swap1: [4250, 150],
    swap2: [4400, 170],
    shuffle: [4600, 900],
    lose1: [5500, 2200],
    lose2: [7800, 2000],
    win1: [10000, 1200],
    win2: [11300, 1500],
    yes1: [12800, 500],
    yes2: [13500, 500],
    no1: [14100, 300],
    no2: [14400, 500],
    no3: [14900, 300],
    uh: [15300, 500],
    yah: [15800, 500],
    sparks1: [16300, 800],
    sparks2: [17100, 500],
    sparks3: [17600, 675],
    wee1: [18400, 700],
    wee2: [19100, 650],
    wee3: [19800, 600],
    drama: [20400, 2500],
    timer: [23000, 12000],
  },
  // onend: () => alert('Sound finished playing'),
});

// Keep the Howl instance's mute state in sync with the user's persisted
// sound preference, wherever it's toggled from (e.g. the header icon).
useUserPreferencesStore.subscribe((state, prevState) => {
  if (state.soundEnabled !== prevState.soundEnabled) {
    dailySoundEffects.mute(!state.soundEnabled);
  }
});

export const SFXAllNames = [
  'bubble1',
  'bubble2',
  'bubble3',
  'addCorrect',
  'addWrong',
  'alienYay',
  'alienBoo',
  'wrong',
  'correct1',
  'correct2',
  'select',
  'swap1',
  'swap2',
  'shuffle',
  'lose1',
  'lose2',
  'win1',
  'win2',
  'yes1',
  'yes2',
  'no1',
  'no2',
  'no3',
  'uh',
  'yah',
  'sparks1',
  'sparks2',
  'sparks3',
  'wee1',
  'wee2',
  'wee3',
  'drama',
  'timer',
] as const;

type SFXTypes =
  | 'bubble'
  | 'bubbleIn'
  | 'bubbleOut'
  | 'addCorrect'
  | 'addWrong'
  | 'alienYay'
  | 'alienBoo'
  | 'wrong'
  | 'correct'
  | 'select'
  | 'swap'
  | 'shuffle'
  | 'win'
  | 'lose'
  | 'yes'
  | 'no'
  | 'nah'
  | 'uh'
  | 'yah'
  | 'sparks'
  | 'wee'
  | 'drama'
  | 'timer';

export const playSFX = (name: SFXTypes) => {
  switch (name) {
    case 'bubble':
      dailySoundEffects.play(sample(['bubble1', 'bubble2', 'bubble3']));
      break;
    case 'bubbleIn':
      dailySoundEffects.play('bubble1');
      break;
    case 'bubbleOut':
      dailySoundEffects.play('bubble2');
      break;
    case 'addCorrect':
      dailySoundEffects.play('addCorrect');
      break;
    case 'addWrong':
      dailySoundEffects.play('addWrong');
      break;
    case 'alienYay':
      dailySoundEffects.play('alienYay');
      break;
    case 'alienBoo':
      dailySoundEffects.play('alienBoo');
      break;
    case 'wrong':
      dailySoundEffects.play('wrong');
      break;
    case 'correct':
      dailySoundEffects.play(sample(['correct1', 'correct2']));
      break;
    case 'select':
      dailySoundEffects.play('select');
      break;
    case 'swap':
      dailySoundEffects.play(sample(['swap1', 'swap2']));
      break;
    case 'shuffle':
      dailySoundEffects.play('shuffle');
      break;
    case 'win':
      dailySoundEffects.play(sample(['win1', 'win2']));
      break;
    case 'lose':
      dailySoundEffects.play(sample(['lose1', 'lose2']));
      break;
    case 'yes':
      dailySoundEffects.play(sample(['yes1', 'yes2']));
      break;
    case 'no':
      dailySoundEffects.play(sample(['no1', 'no2']));
      break;
    case 'nah':
      dailySoundEffects.play('no3');
      break;
    case 'uh':
      dailySoundEffects.play('uh');
      break;
    case 'yah':
      dailySoundEffects.play('yah');
      break;
    case 'sparks':
      dailySoundEffects.play(sample(['sparks1', 'sparks2', 'sparks3']));
      break;
    case 'wee':
      dailySoundEffects.play(sample(['wee1', 'wee2', 'wee3']));
      break;
    case 'drama':
      dailySoundEffects.play('drama');
      break;
    case 'timer':
      dailySoundEffects.play('timer');
      break;
  }
};
