'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { SearchBar, Avatar } from '@/components/ui';

export interface HeaderProps {
  logo?: React.ReactNode;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  user?: {
    name: string;
    avatar?: string;
  };
  onUserClick?: () => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  logo = 'J.P.Morgan',
  onSearch,
  searchPlaceholder = 'Search CUSIP...',
  user,
  onUserClick,
  className,
}) => {
  return (
    <header
      className={cn(
        'flex items-center justify-between',
        'px-8 py-5',
        'border-b border-border-secondary',
        'bg-background-secondary/50 backdrop-blur-sm',
        className
      )}
    >
      <div className="text-lg font-semibold text-text-primary">
        {logo}
      </div>

      <div className="flex-1 max-w-2xl mx-8">
        <SearchBar
          placeholder={searchPlaceholder}
          onSearch={onSearch}
          fullWidth
          className="search-container"
        />
      </div>

      <button
        onClick={onUserClick}
        className="transition-transform hover:scale-105"
        aria-label="User menu"
      >
        <Avatar
          name={user?.name}
          src={user?.avatar}
          size="md"
        />
      </button>
    </header>
  );
};

export default Header;