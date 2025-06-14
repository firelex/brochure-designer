'use client';

import React from 'react';
import Avatar from './Avatar';
import { cn } from '@/lib/utils';

interface TestimonialProps {
  quote: string;
  author: {
    name: string;
    title?: string;
    company?: string;
    avatar?: string;
  };
  rating?: number;
  layout?: 'card' | 'inline' | 'centered';
  className?: string;
}

export const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  author,
  rating,
  layout = 'card',
  className
}) => {
  const StarIcon = () => (
    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  if (layout === 'centered') {
    return (
      <div className={cn('text-center max-w-4xl mx-auto py-12', className)}>
        {rating && (
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
        )}
        
        <blockquote className="text-2xl font-medium text-gray-900 mb-8">
          "{quote}"
        </blockquote>
        
        <div className="flex items-center justify-center space-x-4">
          <Avatar name={author.name} src={author.avatar} />
          <div className="text-left">
            <div className="font-semibold text-gray-900">{author.name}</div>
            {author.title && (
              <div className="text-gray-600">
                {author.title}
                {author.company && `, ${author.company}`}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'inline') {
    return (
      <div className={cn('flex items-start space-x-4', className)}>
        <Avatar name={author.name} src={author.avatar} />
        <div className="flex-1">
          {rating && (
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
          )}
          
          <blockquote className="text-gray-900 mb-3">
            "{quote}"
          </blockquote>
          
          <div>
            <div className="font-semibold text-gray-900">{author.name}</div>
            {author.title && (
              <div className="text-sm text-gray-600">
                {author.title}
                {author.company && `, ${author.company}`}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white p-6 rounded-lg border border-gray-200 shadow-sm', className)}>
      {rating && (
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} />
          ))}
        </div>
      )}
      
      <blockquote className="text-gray-900 mb-6">
        "{quote}"
      </blockquote>
      
      <div className="flex items-center space-x-3">
        <Avatar name={author.name} src={author.avatar} />
        <div>
          <div className="font-semibold text-gray-900">{author.name}</div>
          {author.title && (
            <div className="text-sm text-gray-600">
              {author.title}
              {author.company && `, ${author.company}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;