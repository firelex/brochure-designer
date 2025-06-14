'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui';

export interface ToolbarAction extends Omit<ButtonProps, 'children'> {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface ToolbarProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  actions?: ToolbarAction[];
  className?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({
  title,
  icon,
  actions = [],
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'px-8 py-5',
        'border-b border-border-secondary',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <span className="text-2xl text-accent-500">
            {icon}
          </span>
        )}
        <h1 className="text-2xl font-semibold text-text-primary">
          {title}
        </h1>
      </div>

      {actions.length > 0 && (
        <div className="flex items-center gap-3">
          {actions.map(({ id, label, icon: actionIcon, ...buttonProps }) => (
            <Button
              key={id}
              icon={actionIcon}
              {...buttonProps}
            >
              {label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Toolbar;