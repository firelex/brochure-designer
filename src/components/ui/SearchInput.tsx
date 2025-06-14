import React from 'react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
  variant?: 'default' | 'rounded';
  showIcon?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, variant = 'default', showIcon = true, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onSearch?.(e.target.value);
    };

    return (
      <div className="relative">
        {showIcon && (
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
        <input
          ref={ref}
          type="search"
          className={cn(
            'w-full bg-gray-800/50 text-gray-100',
            'border border-gray-700/50',
            'placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent',
            'transition-all duration-200',
            showIcon && 'pl-10',
            variant === 'default' && 'px-4 py-2 rounded-lg',
            variant === 'rounded' && 'px-5 py-2 rounded-full',
            className
          )}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';