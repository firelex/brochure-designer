'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface PanelProps {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({
  title,
  actions,
  footer,
  noPadding = false,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col h-full',
        'bg-background-secondary',
        className
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-8 py-5 border-b border-border-secondary bg-background-tertiary">
          {title && (
            <h2 className="text-xl font-semibold text-text-primary flex items-center gap-3">
              {title}
            </h2>
          )}
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          'flex-1 overflow-y-auto',
          !noPadding && 'p-6'
        )}
      >
        {children}
      </div>

      {footer && (
        <div className="border-t border-border-secondary bg-background-tertiary">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Panel;