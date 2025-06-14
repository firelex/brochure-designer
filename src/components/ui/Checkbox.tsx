import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, indeterminate, ...props }, ref) => {
    React.useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.indeterminate = indeterminate || false;
      }
    }, [ref, indeterminate]);

    const checkbox = (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'w-4 h-4 rounded border-gray-600 bg-gray-800/50',
          'text-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0',
          'transition-colors cursor-pointer',
          className
        )}
        {...props}
      />
    );

    if (label) {
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          {checkbox}
          <span className="text-sm text-gray-300">{label}</span>
        </label>
      );
    }

    return checkbox;
  }
);

Checkbox.displayName = 'Checkbox';