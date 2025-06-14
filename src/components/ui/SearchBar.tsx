'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { debounce } from '@/lib/utils';
import Input from './Input';

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  debounceMs?: number;
  className?: string;
  fullWidth?: boolean;
  showButton?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
  className,
  fullWidth = false,
  showButton = false,
}) => {
  const [query, setQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((...args: unknown[]) => {
      onSearch?.(args[0] as string);
    }, debounceMs),
    [onSearch, debounceMs]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const SearchIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 14L11.1 11.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'relative',
        fullWidth ? 'w-full' : 'max-w-md',
        className
      )}
    >
      <Input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        icon={<SearchIcon />}
        iconPosition="left"
        fullWidth
        className="pr-4"
      />
      {showButton && (
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-500 text-white rounded-md text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          Search
        </button>
      )}
    </form>
  );
};

export default SearchBar;