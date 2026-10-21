import type { DailyEpocasEntry } from 'types/games';

/**
 * Builds a locally-generated Épocas challenge, used while the backend
 * doesn't yet serve this game's daily payload (demo release stage). The
 * sample is fixed and date-independent, since it's only ever shown as a
 * placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `DailyEpocasEntry`.
 */
export function getEpocasDemo(): DailyEpocasEntry {
  return {
    id: '0000-00-00',
    number: 0,
    type: 'epocas',
    setId: 'demo',
    events: [
      { year: 1822, event: 'Independência do Brasil é proclamada' },
      { year: -753, event: 'Fundação da cidade de Roma (tradição lendária)' },
      { year: 1500, event: 'Chegada dos portugueses ao Brasil' },
      { year: 1969, event: 'Primeira chegada do homem à Lua' },
      { year: 1888, event: 'Abolição da escravatura no Brasil' },
    ],
  };
}
