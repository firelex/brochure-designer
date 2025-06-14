'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface A4PageProps {
  children: React.ReactNode;
  className?: string;
  pageNumber?: number;
  showPageNumber?: boolean;
  orientation?: 'portrait' | 'landscape';
  margins?: 'none' | 'narrow' | 'normal' | 'wide';
  background?: 'white' | 'gradient' | 'custom';
  customBackground?: string;
}

const A4Page = React.forwardRef<HTMLDivElement, A4PageProps>(
  ({
    children,
    className,
    pageNumber,
    showPageNumber = false,
    orientation = 'portrait',
    margins = 'normal',
    background = 'white',
    customBackground,
    ...props
  }, ref) => {
    
    // A4 dimensions in pixels at 96 DPI for screen display
    // Portrait: 210mm x 297mm = 794px x 1123px
    // Landscape: 297mm x 210mm = 1123px x 794px
    const orientationClasses = {
      portrait: 'w-[794px] h-[1123px]',
      landscape: 'w-[1123px] h-[794px]'
    };

    const marginClasses = {
      none: 'p-0',
      narrow: 'p-6',
      normal: 'p-12',
      wide: 'p-16'
    };

    const backgroundClasses = {
      white: 'bg-white',
      gradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
      custom: customBackground || 'bg-white'
    };

    return (
      <div
        ref={ref}
        className={cn(
          // Base A4 page styles
          'relative mx-auto shadow-lg print:shadow-none',
          orientationClasses[orientation],
          marginClasses[margins],
          background === 'custom' ? customBackground : backgroundClasses[background],
          // Print styles
          'print:w-full print:h-full print:m-0',
          className
        )}
        style={{
          // Ensure consistent sizing for PDF generation
          minHeight: orientation === 'portrait' ? '1123px' : '794px',
          boxSizing: 'border-box'
        }}
        {...props}
      >
        {/* Page content */}
        <div className="relative z-10 h-full">
          {children}
        </div>

        {/* Optional page number */}
        {showPageNumber && pageNumber && (
          <div className="absolute bottom-12 right-4 text-sm text-gray-500 print:text-black">
            Page {pageNumber}
          </div>
        )}
      </div>
    );
  }
);

A4Page.displayName = 'A4Page';

export default A4Page;