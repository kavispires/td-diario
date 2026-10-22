import type { DailyPanicoEntry } from 'types/games';

/**
 * Builds a locally-generated Panico challenge, used while the
 * backend doesn't yet serve this game's daily payload (demo release
 * stage). The sample is fixed and date-independent, since it's only ever
 * shown as a placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `DailyPanicoEntry`.
 */
export function getPanicoDemo(): DailyPanicoEntry {
  return {
    id: '2026-10-20-1792542209926',
    number: 0,
    type: 'panico',
    buttons: [
      '1::BASIC_PRESS::',
      '2::PRESS_LESS::1',
      '3::COUNT_SPECIFIC_LETTER::1',
      '4::QUICK_DO_NOT_PRESS::',
      '5::ALL_SAME_RULE::',
      '6::COUNT_ANIMAL_LEGS::2',
      '7::SAME_AS_PREVIOUS::',
      '8::LOGIC_HUMAN_FALSE::',
      '9::COLOR_GRID::2',
      '10::SEE_SAME_THINGS_PRESS::3',
      '11::PRESS_SHAPE_CORNER::0',
      '12::RANDOM_QUESTION::2',
      '13::YELLOW_BUTTON::',
      '14::COLOR_WORD_RULE::',
      '15::COUNT_VOWELS::0',
      '16::TRICK_POLITE_DO_NOT_PRESS::',
      '17::LOGIC_ROBOT_TRUE::',
      '18::ALL_EVEN_NUMBERS::0',
      '19::COLOR_WORD::0',
      '20::REMEMBER_SEQUENCE::1',
      '21::WHEN_YOU_SEE_RULE::1',
      '22::BASIC_DO_NOT_PRESS::',
      '23::PRESS_IF_WANTED::',
      '24::EQUATION_RESULT::6',
      '25::FINAL_PRESS::',
    ],
  };
}
