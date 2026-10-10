import { cn } from '@utils/cn';
import { motion } from 'motion/react';
import { type ReactNode, useId, useState } from 'react';
import { Flex } from './Flex';
import { Text } from './Typography';

/**
 * Sizes available for the {@link Segmented} component.
 */
type SegmentedSize = 'small' | 'default';

/**
 * Where the `label` is placed relative to the segmented control.
 */
type SegmentedLabelPlacement = 'top' | 'left' | 'right';

/**
 * A single choice rendered in a {@link Segmented}'s option list.
 */
type SegmentedOption = {
  /**
   * Value reported to `onChange` when this option is picked.
   */
  value: string;
  /**
   * Content displayed for this option.
   */
  label: ReactNode;
  /**
   * Disables just this option, preventing it from being picked.
   */
  disabled?: boolean;
};

/**
 * Props accepted by the {@link Segmented} component.
 */
type SegmentedProps = {
  /**
   * Choices rendered side by side, in order.
   */
  options: SegmentedOption[];
  /**
   * Currently selected option's value. Controls the selection externally.
   */
  value?: string;
  /**
   * Initial selected value when uncontrolled. Defaults to the first option.
   */
  defaultValue?: string;
  /**
   * Called with the newly picked option's value.
   */
  onChange?: (value: string) => void;
  /**
   * Descriptive label placed alongside the control.
   */
  label?: ReactNode;
  /**
   * Where `label` is placed relative to the control. Defaults to `top`.
   */
  labelPlacement?: SegmentedLabelPlacement;
  /**
   * Size of the control's padding and text. Defaults to `default`.
   */
  size?: SegmentedSize;
  /**
   * Disables every option, preventing interaction.
   */
  disabled?: boolean;
  /**
   * Stretches the control to fill its container's width.
   */
  block?: boolean;
  /**
   * Additional class names applied to the outermost wrapper.
   */
  className?: string;
};

const SIZE_CLASSES: Record<SegmentedSize, string> = {
  small: 'px-2.5 py-1 text-xs',
  default: 'px-3.5 py-1.5 text-sm',
};

/**
 * Renders a single-choice, tab-like toggle between a short list of options,
 * similar to Ant Design's `Segmented` component. The active option's
 * background slides between positions using a shared `layoutId` animation.
 *
 * @param props Options, selected value (controlled or uncontrolled), change
 *   handler, optional label/placement, size, and disabled/block flags.
 * @returns A styled segmented control, optionally paired with a label.
 */
export function Segmented({
  options,
  value,
  defaultValue,
  onChange,
  label,
  labelPlacement = 'top',
  size = 'default',
  disabled = false,
  block = false,
  className,
}: SegmentedProps) {
  const indicatorId = useId();
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? options[0]?.value,
  );
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  function handleSelect(optionValue: string) {
    if (!isControlled) {
      setInternalValue(optionValue);
    }
    onChange?.(optionValue);
  }

  const control = (
    <div
      role="tablist"
      aria-label={typeof label === 'string' ? label : undefined}
      className={cn(
        'inline-flex gap-0.5 rounded-xl bg-border/50 p-1',
        block && 'flex w-full',
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        const isOptionDisabled = disabled || option.disabled;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            disabled={isOptionDisabled}
            onClick={() => handleSelect(option.value)}
            className={cn(
              'relative rounded-lg font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50',
              block && 'flex-1',
              SIZE_CLASSES[size],
              isSelected
                ? 'text-white'
                : 'text-subtle-foreground hover:text-foreground',
            )}
          >
            {isSelected && (
              <motion.div
                layoutId={`segmented-${indicatorId}`}
                className="absolute inset-0 rounded-lg bg-primary shadow-lg"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );

  if (!label) {
    return control;
  }

  if (labelPlacement === 'top') {
    return (
      <Flex
        vertical
        gap="small"
      >
        <Text strong>{label}</Text>
        {control}
      </Flex>
    );
  }

  return (
    <Flex
      align="center"
      gap="small"
      className={labelPlacement === 'right' ? 'flex-row-reverse' : undefined}
    >
      <Text strong>{label}</Text>
      {control}
    </Flex>
  );
}
