'use client';

import React, { useRef, useEffect, useState } from 'react';
import { BrochureRenderer } from './BrochureRenderer';
import { BrochureContent } from '@/types/brochure';
import { A4_CONSTRAINTS } from '@/lib/brochure-layout';

interface MeasurementRendererProps {
  content: BrochureContent;
  onMeasurement: (measurement: {
    totalHeight: number;
    availableHeight: number;
    overflow: number;
    isValid: boolean;
    sectionHeights: number[];
  }) => void;
}

export const MeasurementRenderer: React.FC<MeasurementRendererProps> = ({
  content,
  onMeasurement
}) => {
  const measurementRef = useRef<HTMLDivElement>(null);
  const [measurementId] = useState(() => `measurement-${Date.now()}`);

  useEffect(() => {
    const measureHeight = () => {
      if (!measurementRef.current) return;

      const container = measurementRef.current;
      
      // Wait for all rendering to complete
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const totalHeight = container.scrollHeight;
          const availableHeight = A4_CONSTRAINTS.AVAILABLE_HEIGHT; // 807px
          const overflow = totalHeight - availableHeight;
          
          // Measure individual sections for debugging
          const sections = Array.from(container.querySelectorAll('[class*="mb-6"]')) as HTMLElement[];
          const sectionHeights = sections.map(section => section.offsetHeight);
          
          onMeasurement({
            totalHeight: Math.round(totalHeight),
            availableHeight: availableHeight,
            overflow: Math.round(overflow),
            isValid: overflow <= 0,
            sectionHeights
          });
        });
      });
    };

    // Measure after component mounts and content changes
    const timer = setTimeout(measureHeight, 100);
    
    return () => clearTimeout(timer);
  }, [content, onMeasurement]);

  return (
    <div
      ref={measurementRef}
      id={measurementId}
      style={{
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
        visibility: 'hidden',
        pointerEvents: 'none',
        width: '794px', // A4 width
        overflow: 'visible'
      }}
    >
      {/* Render the actual BrochureRenderer component for measurement */}
      <BrochureRenderer content={content} />
    </div>
  );
};