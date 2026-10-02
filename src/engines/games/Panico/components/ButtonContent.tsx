import { DailyItem } from '@components/games/DailyItem';
import { DEFAULT_SPRITE_SIZE, Sprite } from '@components/sprites/Sprite';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import type { ButtonEntry } from '../utils/types';

/**
 * Props accepted by {@link ButtonContent}.
 */
type ButtonContentProps = {
  /**
   * Resolved Panico button definition.
   */
  button: ButtonEntry;
  /**
   * Number of presses already made for the active button.
   */
  pressCount: number;
};

/**
 * Resolves a dual-language value to the project's primary pt-BR copy.
 *
 * @param value Plain or dual-language text.
 * @returns The pt-BR variant or an empty string.
 */
function getPtValue(value: unknown): string {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'pt' in value &&
    typeof value.pt === 'string'
  ) {
    return value.pt;
  }

  return '';
}

/**
 * Resolves warehouse-good sprite coordinates from an encoded good id.
 *
 * @param goodId Encoded warehouse-good id such as `good-32`.
 * @returns The sprite sheet source and symbol id.
 */
function getWarehouseGoodSource(goodId: string): [string, string] {
  const match = goodId.match(/\d+/);
  const numId = match ? Number.parseInt(match[0] ?? '0', 10) : 0;
  const spriteId = `good-${numId}`;
  const source = `warehouse-goods-${Math.ceil(numId / 64) * 64}`;
  return [source, spriteId];
}

/**
 * Renders a warehouse-good sprite used by one of Panico's later rule
 * combinations.
 *
 * @param props Encoded warehouse-good id and rendered width.
 * @returns The rendered warehouse-good sprite.
 */
function WarehouseGoodSprite({
  goodId,
  width = DEFAULT_SPRITE_SIZE,
  className,
}: {
  goodId: string;
  width?: number;
  className?: string;
}) {
  const [source, spriteId] = getWarehouseGoodSource(goodId);
  return (
    <Sprite
      source={source}
      spriteId={spriteId}
      width={width}
      padding={0}
      className={className}
    />
  );
}

function Label({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center">
      <Text
        strong
        className={cn('text-lg leading-tight text-white', className)}
      >
        {children}
      </Text>
    </div>
  );
}

function Sentence({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center">
      <Text className="max-w-52 text-sm leading-snug text-white">
        {children}
      </Text>
    </div>
  );
}

function Value({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Text
      strong
      className={cn('text-2xl leading-none text-gold', className)}
    >
      {children}
    </Text>
  );
}

function Sequence({ children }: { children: ReactNode }) {
  return (
    <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
      {children}
    </div>
  );
}

/**
 * Renders the instruction/content for the currently active Panico button.
 *
 * @param props Resolved button config and live press count.
 * @returns The rendered instruction content.
 */
export function ButtonContent({ button, pressCount }: ButtonContentProps) {
  const shouldReduceMotion = useReducedMotion();

  switch (button.key) {
    case 'BASIC_PRESS':
    case 'RED_BUTTON':
    case 'YELLOW_BUTTON':
      return <Label>Aperte</Label>;
    case 'PRESS_IF_WANTED':
      return <Label>Aperte se você quiser</Label>;
    case 'FINAL_PRESS':
      return <Label>Aperte várias vezes para ganhar!</Label>;
    case 'TRICK_URGENT_PRESS':
      return <Label>Rápido! Aperte imediatamente!</Label>;
    case 'BASIC_DO_NOT_PRESS':
    case 'BLUE_BUTTON':
      return <Label>Não aperte</Label>;
    case 'TRICK_POLITE_DO_NOT_PRESS':
      return <Label>Por favor, não aperte</Label>;
    case 'QUICK_DO_NOT_PRESS':
      return <Label>Rápido! Não aperte</Label>;
    case 'LOGIC_HUMAN_TRUE':
      return <Label>Aperte se você for humano</Label>;
    case 'LOGIC_HUMAN_FALSE':
      return <Label>Aperte se você não for humano</Label>;
    case 'LOGIC_ROBOT_TRUE':
      return <Label>Aperte se você for um robô</Label>;
    case 'LOGIC_ROBOT_FALSE':
      return <Label>Aperte se você não for um robô</Label>;
    case 'COUNT_SENTENCE':
    case 'RANDOM_QUESTION':
      return <Sentence>{getPtValue(button.pool?.text)}</Sentence>;
    case 'PRESS_LESS':
      return <Sentence>Aperte menos de {button.targetCount} vezes</Sentence>;
    case 'PRESS_MORE':
      return <Sentence>Aperte mais de {button.targetCount} vezes</Sentence>;
    case 'PRESS_TARGET_NUMBER':
      return <Label>{getPtValue(button.pool?.text)}</Label>;
    case 'PRESS_TARGET_COUNTDOWN':
      return (
        <Label>
          Faltam {Math.max(0, button.targetCount - pressCount)} apertadas
        </Label>
      );
    case 'PRESS_SHAPE_SIDE':
      return (
        <Sentence>
          Aperte para cada lado da forma
          <Sequence>
            <DailyItem
              itemId={(button.pool?.itemId as string | undefined) ?? '0'}
              width={72}
            />
          </Sequence>
        </Sentence>
      );
    case 'PRESS_SHAPE_CORNER':
      return (
        <Sentence>
          Aperte para cada canto da forma
          <Sequence>
            <DailyItem
              itemId={(button.pool?.itemId as string | undefined) ?? '0'}
              width={72}
            />
          </Sequence>
        </Sentence>
      );
    case 'COUNT_VOWELS':
      return (
        <Sentence>
          Aperte para cada vogal nesta palavra:
          <Value>{button.pool?.value as string | undefined}</Value>
        </Sentence>
      );
    case 'COUNT_CONSONANTS':
      return (
        <Sentence>
          Aperte para cada consoante nesta palavra:
          <Value>{button.pool?.value as string | undefined}</Value>
        </Sentence>
      );
    case 'EQUATION_RESULT':
      return (
        <Sentence>
          <Value>Aperte {button.pool?.value as string | undefined} vezes</Value>
        </Sentence>
      );
    case 'ALL_ODD_NUMBERS':
      return (
        <Sentence>
          Aperte se todos os números forem ímpares:
          <Value className="text-xl">
            {button.pool?.value as string | undefined}
          </Value>
        </Sentence>
      );
    case 'ALL_EVEN_NUMBERS':
      return (
        <Sentence>
          Aperte se todos os números forem pares:
          <Value className="text-xl">
            {button.pool?.value as string | undefined}
          </Value>
        </Sentence>
      );
    case 'MISSING_NUMBER':
      return (
        <Sentence>
          Aperte tantas vezes quanto o número que falta na sequência
          <Value className="text-xl">
            {button.pool?.value as string | undefined}
          </Value>
        </Sentence>
      );
    case 'COUNT_SPECIFIC_LETTER':
      return (
        <Sentence>
          Aperte tantas vezes quanto a letra "
          {button.pool?.letter as string | undefined}" aparece
          <Value className="text-xl">
            {button.pool?.value as string | undefined}
          </Value>
        </Sentence>
      );
    case 'ALPHABET_POSITION':
      return (
        <Sentence>
          Aperte tantas vezes quanto a posição da letra "
          {button.pool?.value as string | undefined}" no alfabeto
        </Sentence>
      );
    case 'ROMAN_NUMERALS':
      return (
        <Label>Aperte {button.pool?.value as string | undefined} vezes</Label>
      );
    case 'SAME_AS_PREVIOUS':
      return <Label>A mesma coisa que o anterior</Label>;
    case 'DO_NOT_PRESS_RED_RULE':
      return <Label>Nunca aperte quando o botão estiver vermelho</Label>;
    case 'REMEMBER_NUMBER':
      return (
        <Label>
          Lembre-se deste número:
          <Value>{button.pool?.value as string | undefined}</Value>
        </Label>
      );
    case 'REMEMBERED_NUMBER':
      return (
        <Sentence>
          Aperte se o número que você deveria lembrar é:
          <Value>{button.pool?.value as string | undefined}</Value>
        </Sentence>
      );
    case 'WHEN_YOU_SEE_RULE':
      return (
        <Sentence>
          Sempre aperte quando você vir:
          <Sequence>
            <DailyItem
              itemId={(button.pool?.itemId as string | undefined) ?? '0'}
              width={84}
            />
          </Sequence>
        </Sentence>
      );
    case 'SEE_SOMETHING_PRESS':
      return (
        <Label>
          <Sequence>
            <DailyItem
              itemId={(button.pool?.itemId as string | undefined) ?? '0'}
              width={92}
            />
          </Sequence>
        </Label>
      );
    case 'SEE_SOMETHING_PRESS_TRICK':
      return (
        <Label>
          Não aperte
          <Sequence>
            <DailyItem
              itemId={(button.pool?.itemId as string | undefined) ?? '0'}
              width={28}
            />
          </Sequence>
        </Label>
      );
    case 'SEE_SOMETHING_PRESS_ASIDE':
      return (
        <Label className="flex items-center gap-2">
          Não aperte
          <DailyItem
            itemId={(button.pool?.itemId as string | undefined) ?? '0'}
            width={28}
          />
        </Label>
      );
    case 'WHEN_YOU_SEE_RULE_AVOID':
      return (
        <Sentence>
          Nunca aperte quando você vir:
          <Sequence>
            <DailyItem
              itemId={(button.pool?.itemId as string | undefined) ?? '0'}
              width={84}
            />
          </Sequence>
        </Sentence>
      );
    case 'SEE_SOMETHING_PRESS_AVOID':
      return (
        <Label>
          Aperte
          <Sequence>
            <DailyItem
              itemId={(button.pool?.itemId as string | undefined) ?? '0'}
              width={40}
            />
          </Sequence>
        </Label>
      );
    case 'SEE_AND_COUNT':
      return (
        <Sentence>
          Aperte tantas vezes quantas vezes isto aparece
          <Sequence>
            {Array.from({ length: button.targetCount }).map((_, index) => (
              <DailyItem
                key={index}
                itemId={(button.pool?.itemId as string | undefined) ?? '0'}
                width={34}
              />
            ))}
          </Sequence>
        </Sentence>
      );
    case 'REMEMBER_SEQUENCE':
      return (
        <Sentence>
          Lembre-se desta sequência, ela é sua
          <Sequence>
            {(button.pool?.itemsIds as string[] | undefined)?.map((itemId) => (
              <DailyItem
                key={itemId}
                itemId={itemId}
                width={34}
              />
            ))}
          </Sequence>
        </Sentence>
      );
    case 'REMEMBERED_SEQUENCE':
      return (
        <Sentence>
          Aperte se esta é a sua sequência
          <Sequence>
            {(button.pool?.itemsIds as string[] | undefined)?.map((itemId) => (
              <DailyItem
                key={itemId}
                itemId={itemId}
                width={34}
              />
            ))}
          </Sequence>
        </Sentence>
      );
    case 'ICON_COMPARISON':
      return (
        <Sentence>
          Aperte se {getPtValue(button.pool?.more)} aparecem mais vezes que{' '}
          {getPtValue(button.pool?.less)}
          <Sequence>
            {(button.pool?.itemsIds as string[] | undefined)?.map(
              (itemId, index) => (
                <DailyItem
                  key={`${itemId}-${index}`}
                  itemId={itemId}
                  width={36}
                />
              ),
            )}
          </Sequence>
        </Sentence>
      );
    case 'COUNT_ANIMAL_LEGS':
      return (
        <Sentence>
          Aperte tantas vezes quanto o número total de pernas que esses animais
          têm
          <Sequence>
            {(button.pool?.itemsIds as string[] | undefined)?.map(
              (itemId, index) => (
                <DailyItem
                  key={`${itemId}-${index}`}
                  itemId={itemId}
                  width={54}
                />
              ),
            )}
          </Sequence>
        </Sentence>
      );
    case 'NUMBER_RIDDLE':
      return (
        <Sentence>
          Aperte tantas vezes quanto {getPtValue(button.pool?.text)}
        </Sentence>
      );
    case 'COLOR_WORD_RULE':
      return (
        <Sentence>
          Sempre aperte se o nome estiver na mesma cor que a palavra
        </Sentence>
      );
    case 'COLOR_WORD':
      return (
        <Label>
          <span
            style={{
              color: (button.pool?.color as string | undefined) ?? 'white',
            }}
          >
            {getPtValue(button.pool?.text)}
          </span>
        </Label>
      );
    case 'LONG_INSTRUCTION':
      return <Sentence>{getPtValue(button.pool?.text)}</Sentence>;
    case 'SPINNING_ICONS':
      return (
        <motion.span
          className="flex flex-wrap items-center justify-center gap-2"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }
          }
        >
          {(button.pool?.decoyItemsIds as string[] | undefined)?.map(
            (itemId, index) => (
              <motion.span
                key={`${itemId}-${index}`}
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { rotate: index % 3 === 0 ? 360 : -360 }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: 2 + (index % 4),
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'linear',
                      }
                }
              >
                <DailyItem
                  itemId={itemId}
                  width={60}
                  className="drop-shadow-sm"
                />
              </motion.span>
            ),
          )}
        </motion.span>
      );
    case 'COLOR_GRID':
      return (
        <Sentence>
          Aperte se a cor for a mesma
          <div className="grid grid-cols-3 gap-2">
            {(button.pool?.itemsIds as string[] | undefined)?.map(
              (itemId, index) => (
                <DailyItem
                  key={`${itemId}-${index}`}
                  itemId={itemId}
                  width={48}
                />
              ),
            )}
          </div>
        </Sentence>
      );
    case 'ALL_SAME_RULE':
      return (
        <Sentence>
          Sempre aperte quando todos os animais verdes forem do mesmo tipo
        </Sentence>
      );
    case 'SEE_SAME_THINGS_PRESS':
      return (
        <div className="grid max-w-60 grid-cols-6 gap-1">
          {(button.pool?.goodsIds as string[] | undefined)?.map(
            (goodId, index) => (
              <WarehouseGoodSprite
                key={`${goodId}-${index}`}
                goodId={goodId}
                width={28}
                className={cn({
                  'scale-x-[-1]': index % 7 === 0,
                })}
              />
            ),
          )}
        </div>
      );
    default:
      return <Label>{button.key}</Label>;
  }
}
