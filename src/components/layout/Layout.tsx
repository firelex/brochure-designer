'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Sidebar, { SidebarItem } from './Sidebar';
import Header, { HeaderProps } from './Header';

export interface LayoutProps {
  children: React.ReactNode;
  sidebarItems?: SidebarItem[];
  activeSidebarItem?: string;
  onSidebarItemClick?: (item: SidebarItem) => void;
  headerProps?: HeaderProps;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  sidebarItems = [],
  activeSidebarItem,
  onSidebarItemClick,
  headerProps,
  className,
}) => {
  return (
    <div className={cn('flex min-h-screen', className)}>
      {sidebarItems.length > 0 && (
        <Sidebar
          items={sidebarItems}
          activeItemId={activeSidebarItem}
          onItemClick={onSidebarItemClick}
        />
      )}
      
      <div className="flex-1 flex flex-col">
        {headerProps && <Header {...headerProps} />}
        
        <main className="flex-1 flex flex-col min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;