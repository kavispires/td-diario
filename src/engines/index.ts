import { gameInfo as picaco } from './contributions/Picaco/info';
import { gameInfo as taNaCara } from './contributions/TaNaCara/info';
import { gameInfo as alienado } from './games/Alienado/info';
import { gameInfo as arteRuim } from './games/ArteRuim/info';
import { gameInfo as conjuntos } from './games/Conjuntos/info';
import { gameInfo as filmaco } from './games/Filmaco/info';
import { gameInfo as investigacao } from './games/Investigacao/info';
import { gameInfo as mapeamento } from './games/Mapeamento/info';
import { gameInfo as organiku } from './games/Organiku/info';
import { gameInfo as palavreado } from './games/Palavreado/info';
import { gameInfo as panico } from './games/Panico/info';
import { gameInfo as pirralhos } from './games/Pirralhos/info';
import { gameInfo as portais } from './games/Portais/info';
import { gameInfo as quartetos } from './games/Quartetos/info';
import { gameInfo as vitral } from './games/Vitral/info';
import { gameInfo as aquiO } from './special/AquiO/info';
import { gameInfo as estoquista } from './special/Estoquista/info';
import { gameInfo as vitraisInfinitos } from './special/VitraisInfinitos/info';

export const gameInfos = {
  alienado,
  'arte-ruim': arteRuim,
  conjuntos,
  filmaco,
  investigacao,
  mapeamento,
  organiku,
  palavreado,
  panico,
  pirralhos,
  portais,
  quartetos,
  vitral,
  'aqui-o': aquiO,
  estoquista,
  'vitrais-infinitos': vitraisInfinitos,
  'ta-na-cara': taNaCara,
  picaco,
} as const;
