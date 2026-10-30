import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default: 'bg-blue-50 text-blue-700 border border-blue-200',
        secondary: 'bg-slate-100 text-slate-700 border border-slate-200',
        destructive: 'bg-rose-50 text-rose-700 border border-rose-200 font-bold',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border border-amber-200',
        purple: 'bg-purple-50 text-purple-700 border border-purple-200',
        outline: 'text-slate-600 border border-slate-200 bg-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
