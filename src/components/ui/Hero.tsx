'use client';

import React from 'react';
import Button from './Button';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: 'light' | 'dark';
  ctaButton?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundColor = 'bg-gradient-to-br from-blue-600 to-blue-800',
  textColor = 'light',
  ctaButton,
  className
}) => {
  const textClasses = textColor === 'light' 
    ? 'text-white' 
    : 'text-gray-900';

  const subtitleClasses = textColor === 'light'
    ? 'text-blue-100'
    : 'text-gray-600';

  const descriptionClasses = textColor === 'light'
    ? 'text-blue-50'
    : 'text-gray-700';

  return (
    <div 
      className={cn(
        'relative py-16 px-8 rounded-lg overflow-hidden',
        backgroundColor,
        className
      )}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/40" />
      )}
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {subtitle && (
          <p className={cn('text-sm font-medium mb-4', subtitleClasses)}>
            {subtitle}
          </p>
        )}
        
        <h1 className={cn('text-4xl md:text-5xl font-bold mb-6', textClasses)}>
          {title}
        </h1>
        
        {description && (
          <p className={cn('text-lg mb-8 max-w-2xl mx-auto', descriptionClasses)}>
            {description}
          </p>
        )}
        
        {ctaButton && (
          <Button variant={ctaButton.variant || 'primary'} size="lg">
            {ctaButton.text}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Hero;