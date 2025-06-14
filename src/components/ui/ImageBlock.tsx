'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ImageBlockProps {
  src: string;
  alt: string;
  caption?: string;
  layout?: 'full' | 'left' | 'right';
  content?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({
  src,
  alt,
  caption,
  layout = 'full',
  content,
  title,
  description,
  className
}) => {
  if (layout === 'full') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="rounded-lg overflow-hidden">
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-64 object-cover"
          />
        </div>
        {caption && (
          <p className="text-sm text-gray-600 text-center italic">
            {caption}
          </p>
        )}
      </div>
    );
  }

  const isLeftLayout = layout === 'left';
  
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-8 items-center', className)}>
      <div className={cn('space-y-4', isLeftLayout ? 'md:order-1' : 'md:order-2')}>
        <div className="rounded-lg overflow-hidden">
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-64 object-cover"
          />
        </div>
        {caption && (
          <p className="text-sm text-gray-600 text-center italic">
            {caption}
          </p>
        )}
      </div>
      
      <div className={cn('space-y-4', isLeftLayout ? 'md:order-2' : 'md:order-1')}>
        {title && (
          <h3 className="text-2xl font-bold text-gray-900">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-gray-700 leading-relaxed">
            {description}
          </p>
        )}
        {content && (
          <div>
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageBlock;