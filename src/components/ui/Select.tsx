// src/components/ui/Select.tsx
import * as React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  label,
  error,
  disabled,
  className,
}: SelectProps) {
  const id = label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-cgs-forest">
          {label}
        </label>
      )}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg border border-cgs-mist bg-white px-3 text-sm text-cgs-charcoal',
            'transition-colors focus:border-cgs-sage focus:outline-none focus:ring-2 focus:ring-cgs-sage/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-400',
            !value && 'text-gray-400',
            className
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown size={14} className="text-gray-400" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 max-h-60 min-w-[8rem] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl animate-in fade-in-0 zoom-in-95"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={cn(
                    'relative flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm text-cgs-charcoal outline-none',
                    'hover:bg-cgs-cream focus:bg-cgs-cream',
                    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                  )}
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="absolute right-2">
                    <Check size={12} className="text-cgs-sage" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
