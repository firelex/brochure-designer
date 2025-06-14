import React from 'react';
import { cn } from '@/lib/utils';

export interface TimelineStep {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
  duration?: string;
  description?: string;
}

interface TimelineProps {
  steps: TimelineStep[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  steps,
  orientation = 'vertical',
  className
}) => {
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'current':
        return (
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
        );
      default:
        return (
          <div className="w-2 h-2 bg-gray-600 rounded-full" />
        );
    }
  };

  if (orientation === 'horizontal') {
    return (
      <div className={cn('relative', className)}>
        {/* Progress line */}
        <div className="absolute left-12 right-12 top-6 h-0.5 bg-gray-700" />
        
        {/* Steps */}
        <div className="flex justify-between relative">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              {/* Step indicator */}
              <div className={cn(
                'relative z-10 w-12 h-12 rounded-full flex items-center justify-center',
                'transition-all duration-300',
                step.status === 'completed' && 'bg-green-600/20 text-green-400',
                step.status === 'current' && 'bg-blue-600/20 text-blue-400',
                step.status === 'pending' && 'bg-gray-800/50 text-gray-500'
              )}>
                {getStepIcon(step.status)}
              </div>
              
              {/* Step content */}
              <div className="mt-3 text-center">
                <h4 className={cn(
                  'text-sm font-medium',
                  step.status === 'completed' && 'text-gray-300',
                  step.status === 'current' && 'text-gray-100',
                  step.status === 'pending' && 'text-gray-500'
                )}>
                  {step.label}
                </h4>
                {step.timestamp && (
                  <p className="text-xs text-gray-500 mt-1">{step.timestamp}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Progress line */}
      <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-700" />
      
      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start gap-4">
            {/* Step indicator */}
            <div className={cn(
              'relative z-10 w-12 h-12 rounded-full flex items-center justify-center',
              'transition-all duration-300',
              step.status === 'completed' && 'bg-green-600/20 text-green-400',
              step.status === 'current' && 'bg-blue-600/20 text-blue-400',
              step.status === 'pending' && 'bg-gray-800/50 text-gray-500'
            )}>
              {getStepIcon(step.status)}
            </div>
            
            {/* Step content */}
            <div className="flex-1 pt-2">
              <div className="flex items-baseline justify-between">
                <h4 className={cn(
                  'font-medium',
                  step.status === 'completed' && 'text-gray-300',
                  step.status === 'current' && 'text-gray-100',
                  step.status === 'pending' && 'text-gray-500'
                )}>
                  {step.label}
                </h4>
                {step.timestamp && (
                  <span className="text-xs text-gray-500">{step.timestamp}</span>
                )}
              </div>
              {step.description && (
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              )}
              {step.duration && (
                <p className="text-xs text-gray-600 mt-1">Duration: {step.duration}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};