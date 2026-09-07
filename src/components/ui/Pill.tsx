import type { ReactNode } from 'react';

type PillProps = {
  children: ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

export function Pill({ children, className, ...props }: PillProps) {
  return (
    <span
      className={`bg-slate-900 text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm ${className ?? ''}`}
      {...props}
    >
      {children}
    </span>
  );
}
