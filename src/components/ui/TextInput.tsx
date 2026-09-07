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
  className = '',
  type = 'text',
  ...props
}: TextInputProps) {
  return (
    <input
      type={type}
      className={`w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all ${className}`}
      {...props}
    />
  );
}
