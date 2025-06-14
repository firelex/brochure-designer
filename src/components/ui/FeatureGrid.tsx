'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  iconColor?: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  title?: string;
  description?: string;
  className?: string;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  columns = 3,
  title,
  description,
  className
}) => {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={cn('space-y-8', className)}>
      {(title || description) && (
        <div className="text-center">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className={cn('grid gap-6', gridClasses[columns])}>
        {features.map((feature) => (
          <div 
            key={feature.id}
            className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            {feature.icon && (
              <div className={cn(
                'inline-flex items-center justify-center w-16 h-16 rounded-full mb-4',
                feature.iconColor || 'bg-blue-100 text-blue-600'
              )}>
                {feature.icon}
              </div>
            )}
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;