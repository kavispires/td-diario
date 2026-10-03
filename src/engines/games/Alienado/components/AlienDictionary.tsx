import { DailyItem } from '@components/games/DailyItem';
import { Text } from '@components/ui/Typography';
import { ArrowRight } from 'lucide-react';
import type { DailyAlienadoAttribute } from 'types/games';
import { ALIENADO_DICTIONARY_ITEM_FRAME } from '../utils/constants';
import { AlienSign } from './AlienSign';

/**
 * Props accepted by the {@link AlienDictionary} component.
 */
type AlienDictionaryProps = {
  /**
   * Attribute examples shown to help decode the alien symbols.
   */
  attributes: DailyAlienadoAttribute[];
  /**
   * Base width used for the signs and example items.
   */
  itemWidth: number;
};

/**
 * Shows Alienado's "dictionary": each alien symbol alongside example items
 * that share the same hidden attribute.
 *
 * @param props Attribute data and responsive sizing.
 * @returns The rendered alien dictionary.
 */
export function AlienDictionary({
  attributes,
  itemWidth,
}: AlienDictionaryProps) {
  return (
    <section className="space-y-3 rounded-[2rem] bg-surface/85 p-4 shadow-sm">
      <Text strong>O alienígena entende que isso é aquilo:</Text>

      <div className="space-y-3">
        {attributes.map((attribute) => (
          <div
            key={attribute.id}
            className="rounded-2xl bg-surface-raised p-3"
          >
            <div className="flex items-center gap-3">
              <AlienSign
                signId={attribute.spriteId}
                width={itemWidth}
              />

              <ArrowRight
                className="h-4 w-4 shrink-0 text-subtle-foreground"
                aria-hidden="true"
              />

              <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                {attribute.itemsIds.map((itemId) => (
                  <div
                    key={itemId}
                    className="rounded-2xl bg-surface p-1"
                  >
                    <DailyItem
                      itemId={itemId}
                      width={
                        itemWidth - ALIENADO_DICTIONARY_ITEM_FRAME.widthOffset
                      }
                      padding={ALIENADO_DICTIONARY_ITEM_FRAME.padding}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
