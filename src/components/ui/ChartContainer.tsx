import React from 'react';
import { cn } from '@/lib/utils';

interface ChartContainerProps {
  children: React.ReactNode;
  height?: number | string;
  loading?: boolean;
  error?: string;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  height = 300,
  loading,
  error,
  className
}) => {
  const containerHeight = typeof height === 'number' ? `${height}px` : height;

  if (loading) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-900/50 rounded-lg',
          className
        )}
        style={{ height: containerHeight }}
      >
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading chart...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-900/50 rounded-lg',
          className
        )}
        style={{ height: containerHeight }}
      >
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn('relative', className)}
      style={{ height: containerHeight }}
    >
      {children}
    </div>
  );
};