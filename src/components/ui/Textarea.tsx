// src/components/ui/Textarea.tsx
import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCharCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, showCharCount, id, maxLength, value, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-cgs-forest">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          maxLength={maxLength}
          className={cn(
            'min-h-[100px] w-full resize-y rounded-lg border border-cgs-mist bg-white px-3 py-2.5 text-sm text-cgs-charcoal placeholder:text-gray-400',
            'transition-colors focus:border-cgs-sage focus:outline-none focus:ring-2 focus:ring-cgs-sage/20',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
            className
          )}
          {...props}
        />
        <div className="flex items-center justify-between">
          {error && <p className="text-xs text-red-500">{error}</p>}
          {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
          {showCharCount && maxLength && (
            <p className={cn('ml-auto text-xs', charCount > maxLength * 0.9 ? 'text-amber-500' : 'text-gray-400')}>
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
