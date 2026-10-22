import type { DailyMapeamentoEntry } from 'types/games';

/**
 * Builds a locally-generated Mapeamento challenge, used while the
 * backend doesn't yet serve this game's daily payload (demo release
 * stage). The sample is fixed and date-independent, since it's only ever
 * shown as a placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `DailyMapeamentoEntry`.
 */
export function getMapeamentoDemo(): DailyMapeamentoEntry {
  return {
    id: '2026-09-26',
    type: 'mapeamento',
    number: 133,
    setId: 'monte-olimpo',
    location: 'Monte Olimpo',
    clues: [
      'Montanha mais alta do país',
      'Morada dos deuses antigos',
      'Ligada aos mitos de Zeus',
      'Reserva da biosfera da UNESCO',
      'Localizado no norte da Grécia',
    ],
    language: 'pt',
  };
}
