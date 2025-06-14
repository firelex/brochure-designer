'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      fullWidth = true,
      resize = 'vertical',
      ...props
    },
    ref
  ) => {
    const textareaId = props.id || props.name;

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 bg-background-overlay border border-border rounded-lg',
            'text-text-primary text-sm outline-none transition-colors duration-base',
            'focus:border-primary-500 focus:bg-background-overlay/80',
            'placeholder:text-text-muted',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          style={{ resize }}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;