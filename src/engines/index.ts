import { gameInfo as conexoes } from './contributions/Conexoes/info';
import { gameInfo as ideias } from './contributions/Ideias/info';
import { gameInfo as picaco } from './contributions/Picaco/info';
import { gameInfo as taNaCara } from './contributions/TaNaCara/info';
import { gameInfo as alienado } from './games/Alienado/info';
import { gameInfo as aquiO } from './games/AquiO/info';
import { gameInfo as arteRuim } from './games/ArteRuim/info';
import { gameInfo as colorido } from './games/Colorido/info';
import { gameInfo as conjuntos } from './games/Conjuntos/info';
import { gameInfo as epocas } from './games/Epocas/info';
import { gameInfo as estoquista } from './games/Estoquista/info';
import { gameInfo as filmaco } from './games/Filmaco/info';
import { gameInfo as investigacao } from './games/Investigacao/info';
import { gameInfo as karaoke } from './games/Karaoke/info';
import { gameInfo as mapeamento } from './games/Mapeamento/info';
import { gameInfo as organiku } from './games/Organiku/info';
import { gameInfo as palavreado } from './games/Palavreado/info';
import { gameInfo as panico } from './games/Panico/info';
import { gameInfo as pirralhos } from './games/Pirralhos/info';
import { gameInfo as portais } from './games/Portais/info';
import { gameInfo as quartetos } from './games/Quartetos/info';
import { gameInfo as vitral } from './games/Vitral/info';

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
  colorido,
  epocas,
  karaoke,
  conexoes,
  'ta-na-cara': taNaCara,
  picaco,
  ideias,
} as const;
