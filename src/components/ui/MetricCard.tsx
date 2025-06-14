import React from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  trend?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  trend,
  className
}) => {
  return (
    <div className={cn(
      'bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm',
      'border border-gray-700/50 rounded-xl p-6',
      'transition-all duration-200 hover:transform hover:scale-[1.02]',
      'hover:shadow-2xl hover:border-gray-600/50',
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-100">{value}</p>
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-500/20 
                          flex items-center justify-center text-blue-400">
            {icon}
          </div>
        )}
      </div>
      
      {(change || trend) && (
        <div className="flex items-center justify-between">
          {change && (
            <div className="flex items-center gap-1">
              {change.type === 'increase' ? (
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className={cn(
                'text-sm font-medium',
                change.type === 'increase' ? 'text-green-500' : 'text-red-500'
              )}>
                {change.value}%
              </span>
            </div>
          )}
          {trend && <div className="text-xs text-gray-500">{trend}</div>}
        </div>
      )}
    </div>
  );
};