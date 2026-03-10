// src/components/ui/Progress.tsx
import * as React from 'react';
import * as RadixProgress from '@radix-ui/react-progress';
import { cn } from '@/lib/utils/cn';

interface ProgressProps {
  value: number; // 0–100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'sage' | 'gold' | 'error';
  className?: string;
}

const COLOR_MAP = {
  sage: 'bg-cgs-sage',
  gold: 'bg-cgs-gold',
  error: 'bg-red-500',
};

const SIZE_MAP = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function Progress({
  value,
  max = 100,
  label,
  showValue,
  size = 'md',
  color = 'sage',
  className,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs text-gray-600">
          {label && <span>{label}</span>}
          {showValue && (
            <span className="font-medium text-cgs-forest">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <RadixProgress.Root
        value={pct}
        className={cn('overflow-hidden rounded-full bg-gray-100', SIZE_MAP[size])}
      >
        <RadixProgress.Indicator
          className={cn('h-full rounded-full transition-all duration-500 ease-out', COLOR_MAP[color])}
          style={{ width: `${pct}%` }}
        />
      </RadixProgress.Root>
    </div>
  );
}
