import { cn } from '@utils/cn';
import type { ComponentPropsWithRef } from 'react';

/**
 * Props accepted by the {@link TextInput} component.
 */
type TextInputProps = ComponentPropsWithRef<'input'>;

/**
 * Renders a styled text input with support for all native input properties.
 *
 * In React 19, refs can be passed directly as props, so this component does
 * not need to use `forwardRef`.
 *
 * @param props Native input properties, including an optional ref, class name,
 *   and input type.
 * @returns A styled input element.
 */
export function TextInput({
  className,
  type = 'text',
  ...props
}: TextInputProps) {
  return (
    <input
      type={type}
      className={cn(
        'w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground placeholder:text-subtle-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-soft',
        className,
      )}
      {...props}
    />
  );
}
