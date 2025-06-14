import React from 'react';
import { cn } from '@/lib/utils';

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

interface FilterPanelProps {
  filters: Filter[];
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, className }) => {
  return (
    <div className={cn(
      'bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm',
      'border border-gray-700/50 rounded-lg p-4',
      'flex flex-wrap items-center gap-4',
      className
    )}>
      {filters.map((filter) => (
        <div key={filter.id} className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
            {filter.label}
          </label>
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className={cn(
              "min-w-[150px] px-3 py-2 text-sm",
              "bg-gray-800/50 text-gray-100",
              "border border-gray-700/50 rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent",
              "transition-all duration-200"
            )}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

interface FilterGroupProps {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  className?: string;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  label,
  value,
  options,
  onChange,
  className
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "min-w-[150px] px-3 py-2 text-sm",
          "bg-gray-800/50 text-gray-100",
          "border border-gray-700/50 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent",
          "transition-all duration-200"
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};