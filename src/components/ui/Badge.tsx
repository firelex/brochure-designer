'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Status } from '@/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Status | 'default';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  icon,
  className,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-background-overlay text-text-primary border-border',
    waiting: 'status-waiting',
    pending: 'status-pending',
    approved: 'status-success',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/30',
    success: 'status-success',
    intake: 'status-pending',
    'legal-review': 'status-waiting',
    'tax-review': 'status-waiting',
    'business-review': 'status-waiting',
    scheduled: 'status-waiting',
    submitted: 'status-success',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm',
  };

  return (
    <span
      className={cn(
        'status-badge',
        variants[variant as keyof typeof variants] || variants.default,
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="status-dot" />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;