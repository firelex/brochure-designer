'use client';

import React from 'react';
import Button from './Button';
import Badge from './Badge';
import { cn } from '@/lib/utils';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: PricingFeature[];
  highlighted?: boolean;
  badge?: string;
  ctaButton?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
}

interface PricingTableProps {
  tiers: PricingTier[];
  title?: string;
  description?: string;
  className?: string;
}

export const PricingTable: React.FC<PricingTableProps> = ({
  tiers,
  title,
  description,
  className
}) => {
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
      
      <div className={cn(
        'grid gap-6',
        tiers.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
        tiers.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      )}>
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={cn(
              'relative bg-white rounded-lg border p-6 shadow-sm',
              tier.highlighted 
                ? 'border-blue-500 shadow-lg ring-2 ring-blue-500 ring-opacity-20' 
                : 'border-gray-200'
            )}
          >
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="success">
                  {tier.badge}
                </Badge>
              </div>
            )}
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {tier.name}
              </h3>
              
              {tier.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {tier.description}
                </p>
              )}
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-gray-600 ml-1">
                    /{tier.period}
                  </span>
                )}
              </div>
              
              {tier.ctaButton && (
                <Button 
                  variant={tier.ctaButton.variant || (tier.highlighted ? 'primary' : 'secondary')}
                  className="w-full mb-6"
                >
                  {tier.ctaButton.text}
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              {tier.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={cn(
                    'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center',
                    feature.included 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  )}>
                    {feature.included ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={cn(
                    'text-sm',
                    feature.included ? 'text-gray-700' : 'text-gray-500'
                  )}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingTable;