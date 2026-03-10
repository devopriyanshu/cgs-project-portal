// src/components/ui/Badge.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default:    'bg-gray-100 text-gray-700',
        primary:    'bg-cgs-sage/10 text-cgs-moss',
        secondary:  'bg-cgs-mist/50 text-cgs-forest',
        success:    'bg-emerald-100 text-emerald-700',
        warning:    'bg-amber-100 text-amber-700',
        error:      'bg-red-100 text-red-600',
        info:       'bg-blue-100 text-blue-700',
        purple:     'bg-purple-100 text-purple-700',
        draft:      'bg-gray-100 text-gray-600',
        submitted:  'bg-blue-100 text-blue-700',
        screening:  'bg-amber-100 text-amber-700',
        eligible:   'bg-emerald-100 text-emerald-700',
        ineligible: 'bg-red-100 text-red-600',
        mrv:        'bg-purple-100 text-purple-700',
        active:     'bg-green-100 text-green-700',
        completed:  'bg-cgs-forest/10 text-cgs-forest',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
