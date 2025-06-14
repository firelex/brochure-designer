'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SidebarItem {
  id: string;
  icon: string | React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface SidebarProps {
  items: SidebarItem[];
  activeItemId?: string;
  onItemClick?: (item: SidebarItem) => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeItemId,
  onItemClick,
  className,
}) => {
  const handleItemClick = (item: SidebarItem) => {
    if (item.onClick) {
      item.onClick();
    }
    onItemClick?.(item);
  };

  const renderIcon = (icon: string | React.ReactNode) => {
    if (typeof icon === 'string') {
      return <span className="text-lg">{icon}</span>;
    }
    return icon;
  };

  return (
    <div
      className={cn(
        'w-20 bg-background-secondary border-r border-border-secondary',
        'flex flex-col items-center py-5',
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleItemClick(item)}
          className={cn(
            'sidebar-icon',
            activeItemId === item.id && 'active'
          )}
          aria-label={item.label}
          title={item.label}
        >
          {renderIcon(item.icon)}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;