import type { ComponentType, LazyExoticComponent } from 'react';
import { lazy } from 'react';

/**
 * A lazily-loaded game rules component, resolved on demand by game id.
 */
type RulesComponent = LazyExoticComponent<ComponentType>;

/**
 * Maps each game id to its lazily-loaded `Rules` component, mirroring the
 * `gameComponents` registry in `GameScreen`.
 */
export const rulesComponents: Record<string, RulesComponent> = {
  alienado: lazy(() =>
    import('./games/Alienado/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  'arte-ruim': lazy(() =>
    import('./games/ArteRuim/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  conjuntos: lazy(() =>
    import('./games/Conjuntos/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  filmaco: lazy(() =>
    import('./games/Filmaco/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  investigacao: lazy(() =>
    import('./games/Investigacao/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  mapeamento: lazy(() =>
    import('./games/Mapeamento/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  organiku: lazy(() =>
    import('./games/Organiku/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  palavreado: lazy(() =>
    import('./games/Palavreado/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  panico: lazy(() =>
    import('./games/Panico/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  pirralhos: lazy(() =>
    import('./games/Pirralhos/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  portais: lazy(() =>
    import('./games/Portais/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  quartetos: lazy(() =>
    import('./games/Quartetos/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  vitral: lazy(() =>
    import('./games/Vitral/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  'aqui-o': lazy(() =>
    import('./special/AquiO/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  estoquista: lazy(() =>
    import('./special/Estoquista/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  'vitrais-infinitos': lazy(() =>
    import('./special/VitraisInfinitos/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  'ta-na-cara': lazy(() =>
    import('./contributions/TaNaCara/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
  picaco: lazy(() =>
    import('./contributions/Picaco/components/Rules').then(({ Rules }) => ({
      default: Rules,
    })),
  ),
};
