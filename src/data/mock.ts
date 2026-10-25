import { getPicacoDemo } from '@engines/contributions/Picaco/utils/demo';
import { getTaNaCaraDemo } from '@engines/contributions/TaNaCara/utils/demo';
import { getAlienadoDemo } from '@engines/games/Alienado/utils/demo';
import { getAquiODemo } from '@engines/games/AquiO/utils/demo';
import { getArteRuimDemo } from '@engines/games/ArteRuim/utils/demo';
import { getColoridoDemo } from '@engines/games/Colorido/utils/demo';
import { getConjuntosDemo } from '@engines/games/Conjuntos/utils/demo';
import { getEpocasDemo } from '@engines/games/Epocas/utils/demo';
import { getFilmacoDemo } from '@engines/games/Filmaco/utils/demo';
import { getInvestigacaoDemo } from '@engines/games/Investigacao/utils/demo';
import { getKaraokeDemo } from '@engines/games/Karaoke/utils/demo';
import { getMapeamentoDemo } from '@engines/games/Mapeamento/utils/demo';
import { getOrganikuDemo } from '@engines/games/Organiku/utils/demo';
import { getPalavreadoDemo } from '@engines/games/Palavreado/utils/demo';
import { getPanicoDemo } from '@engines/games/Panico/utils/demo';
import { getPirralhosDemo } from '@engines/games/Pirralhos/utils/demo';
import { getPortaisDemo } from '@engines/games/Portais/utils/demo';
import { getQuartetosDemo } from '@engines/games/Quartetos/utils/demo';
import { getVitralDemo } from '@engines/games/Vitral/utils/demo';
import type { DailyResponse } from 'types/puzzles';

export const MOCK_DAILY_RESPONSE: DailyResponse = {
  id: '2026-09-26',
  minAppVersion: '3.1.0',
  challenges: {
    'arte-ruim': getArteRuimDemo(),
    'aqui-o': getAquiODemo(),
    alienado: getAlienadoDemo(),
    investigacao: getInvestigacaoDemo(),
    filmaco: getFilmacoDemo(),
    organiku: getOrganikuDemo(),
    palavreado: getPalavreadoDemo(),
    portais: getPortaisDemo(),
    quartetos: getQuartetosDemo(),
    conjuntos: getConjuntosDemo(),
    vitral: getVitralDemo(),
    mapeamento: getMapeamentoDemo(),
    pirralhos: getPirralhosDemo(),
    panico: getPanicoDemo(),
    colorido: getColoridoDemo(),
    epocas: getEpocasDemo(),
    karaoke: getKaraokeDemo(),
  },
  contributions: {
    picaco: getPicacoDemo(),
    'ta-na-cara': getTaNaCaraDemo(),
    ideias: {
      id: '2026-09-26',
      type: 'ideias',
      number: 1,
    },
  },
  metadata: {
    dictionary: {
      '0': 'td',
      '7': 'caixa de ferramentas',
      '55': 'óculos',
      '118': 'anel',
      '124': 'pergaminho',
      '134': 'refrigerante',
      '138': 'globo',
      '153': 'aranha',
      '165': 'quebra-cabeça',
      '210': 'camarão',
      '219': 'avião',
      '230': 'pomba',
      '287': 'calendário',
      '379': 'origami',
      '389': 'foguete',
      '408': 'mochila',
      '458': 'avestruz',
      '474': 'asas',
      '517': 'balde',
      '523': 'caixa de papelão',
      '530': 'mão',
      '577': 'caixote',
      '621': 'laranja',
      '685': 'cesta',
      '729': 'misto quente',
      '753': 'prancha de surf',
      '762': 'caravela',
      '783': 'flauta de bambu',
      '793': 'coruja',
      '815': 'baú',
      '839': 'bolsa de academia',
      '855': 'chaveiro',
      '871': 'prótese',
      '899': 'chapéu de bambu',
      '932': 'vuvuzela',
      '1021': 'rede de pescar',
      '1046': 'mofo',
      '1049': 'gás venenoso',
      '1085': 'camaleão',
      '1117': 'vazamento de gas',
      '1212': 'chapéu',
      '1217': 'blocos de brincar',
      '1233': 'triturador de madeira',
      '1255': 'harpa',
      '1270': 'delegacia',
      '1358': 'cheesecake',
      '1393': 'esquadro',
      '1432': 'garrafa térmica',
      '1593': 'trigo',
      '1702': 'ônibus de dois andares',
      '1748': 'colã',
      '1751': 'wafer',
      '1825': 'panda-vermelho',
      '1827': 'hamster',
      '1917': 'pinça',
      '1932': 'bonde',
      '1937': 'melão',
      '1972': 'selva',
      '2037': 'menta',
      '2059': 'preto',
      '2082': 'ansiedade',
      '2100': 'mulher loira',
      '2151': 'chapéu mandarim',
      '2254': 'chapéu de mago',
      '2290': 'asa delta',
      '2488': 'bolsinha',
      '2507': 'infográfico',
      '2547': 'sede',
      '2564': 'alcachofra',
      '2767': 'escritura',
      '2774': 'carro autônomo',
      '2836': 'Índia',
      '2981': 'teste do sofá',
      '3003': 'artesanato',
      '3030': 'autista',
      '3063': 'gases de escape',
      '3118': 'peido',
      '3141': 'baú de motoboy',
      '3218': 'brinquedos',
      '3278': 'toranja',
    },
  },
};
