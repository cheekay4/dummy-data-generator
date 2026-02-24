import { ReactNode } from 'react';

type Variant = 'default' | 'success' | 'warning' | 'error' | 'indigo' | 'amber';

const variants: Record<Variant, string> = {
  default: 'bg-stone-100 text-stone-600',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  error:   'bg-red-100 text-red-700',
  indigo:  'bg-indigo-100 text-indigo-700',
  amber:   'bg-amber-400 text-stone-900',
};

interface Props {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: Props) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className ?? ''}`}>
      {children}
    </span>
  );
}
