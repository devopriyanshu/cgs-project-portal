// src/components/ui/Tabs.tsx
import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils/cn';

interface Tab {
  value: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ tabs, defaultValue, value, onValueChange, children, className }: TabsProps) {
  return (
    <RadixTabs.Root
      defaultValue={defaultValue ?? tabs[0]?.value}
      value={value}
      onValueChange={onValueChange}
      className={className}
    >
      <RadixTabs.List className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'flex items-center gap-1.5 border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors',
              'hover:border-cgs-mist hover:text-cgs-forest',
              'data-[state=active]:border-cgs-sage data-[state=active]:text-cgs-sage'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
                {tab.count}
              </span>
            )}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {children}
    </RadixTabs.Root>
  );
}

export const TabsContent = RadixTabs.Content;
