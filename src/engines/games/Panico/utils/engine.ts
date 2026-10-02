import type { ButtonDictionaryEntry, PoolGroupEntry } from './data';
import { BUTTONS_LIBRARY, POOLS } from './data';
import type { ButtonEntry, PanicoExpectedAction } from './types';

const BUTTON_SEPARATOR = '::';

/**
 * Safely narrows an unknown pool value to a string.
 *
 * @param value Candidate runtime value.
 * @returns The string when present, otherwise `undefined`.
 */
function getOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

/**
 * Resolves the pool entry selected by an encoded Panico button.
 *
 * @param poolName Pool dictionary name referenced by the button definition.
 * @param poolIndex Stable, server-provided sorted index into that pool.
 * @returns The resolved pool entry, if any.
 */
function getPoolEntry(
  poolName: string,
  poolIndex: number,
): PoolGroupEntry | undefined {
  const poolEntries = Object.values(POOLS[poolName] ?? {}).sort((left, right) =>
    left.id.localeCompare(right.id),
  );
  return poolEntries[poolIndex];
}

/**
 * Updates a button's action after its press target has been resolved.
 *
 * @param buttonEntry Partially-resolved button entry.
 * @returns The effective expected action for that press target.
 */
function updateExpectedAction(buttonEntry: ButtonEntry): PanicoExpectedAction {
  const { targetCount, expectedAction } = buttonEntry;

  if (expectedAction === 'PRESS_MORE' || expectedAction === 'PRESS_LESS') {
    return expectedAction;
  }

  if (targetCount === 0) {
    return 'DO_NOT_PRESS';
  }
  if (targetCount === -1) {
    return 'ANY';
  }
  if (targetCount === 1) {
    return 'PRESS';
  }
  if (targetCount > 1) {
    return 'MULTI_PRESS';
  }

  return 'TBD';
}

/**
 * Applies one of Panico's runtime resolvers to a button entry.
 *
 * @param buttonEntry The button currently being resolved.
 * @param buttonData Static button-library definition.
 * @param buttonEntries Previously-resolved buttons in today's sequence.
 * @param keywords Runtime keywords already introduced by rule buttons.
 * @param poolKeywords Runtime keywords collected from selected pool entries.
 */
function resolveButton(
  buttonEntry: ButtonEntry,
  buttonData: ButtonDictionaryEntry,
  buttonEntries: ButtonEntry[],
  keywords: string[],
  poolKeywords: string[],
) {
  if (!buttonData.resolver) {
    return;
  }

  switch (buttonData.resolver) {
    case 'PREVIOUS_BUTTON_PRESS_COUNT': {
      const previousButton = buttonEntries.at(-1);
      buttonEntry.targetCount = previousButton?.targetCount ?? 0;
      buttonEntry.expectedAction =
        previousButton?.expectedAction ?? 'DO_NOT_PRESS';
      buttonEntry.verification = 'IMMEDIATE';
      return;
    }
    case 'POOL_KEYWORD_MATCH':
      buttonEntry.targetCount = poolKeywords.includes(
        getOptionalString(buttonEntry.pool?.keyword) ?? '',
      )
        ? 1
        : 0;
      buttonEntry.expectedAction = updateExpectedAction(buttonEntry);
      return;
    case 'POOL_KEYWORD_MATCH_REVERSE':
      buttonEntry.targetCount = poolKeywords.includes(
        getOptionalString(buttonEntry.pool?.keyword) ?? '',
      )
        ? 0
        : 1;
      buttonEntry.expectedAction = updateExpectedAction(buttonEntry);
      return;
    default:
      buttonEntry.targetCount = keywords.includes(buttonData.resolver)
        ? buttonEntry.targetCount === 0
          ? 1
          : 0
        : buttonEntry.targetCount;
      buttonEntry.expectedAction = updateExpectedAction(buttonEntry);
  }
}

/**
 * Expands the encoded server payload into the fully-resolved button entries
 * rendered and validated by the Panico client.
 *
 * @param buttons Encoded button strings from today's payload.
 * @returns The resolved Panico buttons in sequence order.
 * @throws If a button key is unknown or still unresolved after processing.
 */
export function buildButtons(buttons: string[]): ButtonEntry[] {
  const keywords: string[] = [];
  const poolKeywords: string[] = [];
  const buttonEntries: ButtonEntry[] = [];

  for (const buttonKey of buttons) {
    const [id, buttonType, poolIndexValue] = buttonKey.split(BUTTON_SEPARATOR);
    const buttonData = BUTTONS_LIBRARY[buttonType];

    if (!buttonData) {
      throw new Error(`Tipo de botão desconhecido em Pânico: ${buttonType}`);
    }

    const buttonEntry: ButtonEntry = {
      id,
      key: buttonData.key,
      category: buttonData.category,
      targetCount: buttonData.targetCount,
      expectedAction: buttonData.expectedAction,
      durationScale: buttonData.durationScale,
      verification: buttonData.verification,
      keyword: buttonData.keyword,
      dependsOn: buttonData.dependsOn,
      eitherOr: buttonData.eitherOr,
      buttonVariant: buttonData.buttonVariant as
        | ButtonEntry['buttonVariant']
        | undefined,
    };

    if (buttonData.keyword) {
      keywords.push(buttonData.keyword);
    }

    if (buttonData.pool) {
      const poolIndex = Number(poolIndexValue);
      const selectedPool = getPoolEntry(
        buttonData.pool,
        Number.isNaN(poolIndex) ? 0 : poolIndex,
      );

      if (selectedPool) {
        buttonEntry.pool = selectedPool;

        const poolKeyword = getOptionalString(selectedPool.keyword);

        if (!buttonData.dependsOn && poolKeyword) {
          poolKeywords.push(poolKeyword);
        }

        if (selectedPool.targetCount !== -2) {
          buttonEntry.targetCount = selectedPool.targetCount;
          buttonEntry.expectedAction = updateExpectedAction(buttonEntry);
        }
      }
    }

    resolveButton(
      buttonEntry,
      buttonData,
      buttonEntries,
      keywords,
      poolKeywords,
    );

    if (buttonEntry.expectedAction === 'TBD') {
      throw new Error(
        `Botão de Pânico sem resolução final: ${buttonEntry.key} (${buttonEntry.id})`,
      );
    }

    buttonEntries.push(buttonEntry);
  }

  return buttonEntries;
}

/**
 * Validates the player's presses for the active Panico button.
 *
 * @param actualPressCount Number of times the player pressed the button.
 * @param expectedAction Rule used to validate the interaction.
 * @param configPressCount Resolved target count for the button.
 * @returns `true` when the interaction satisfies the button rule.
 */
export function validateButtonPress(
  actualPressCount: number,
  expectedAction: PanicoExpectedAction,
  configPressCount: number,
): boolean {
  switch (expectedAction) {
    case 'PRESS':
    case 'MULTI_PRESS':
      return actualPressCount === configPressCount;
    case 'DO_NOT_PRESS':
      return actualPressCount === 0;
    case 'PRESS_LESS':
      return actualPressCount < configPressCount;
    case 'PRESS_MORE':
      return actualPressCount > configPressCount;
    case 'ANY':
      return true;
    default:
      return false;
  }
}
