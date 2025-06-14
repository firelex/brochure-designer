'use client';

import React from 'react';
import { BrochureRenderer } from './BrochureRenderer';
import { BrochureContent } from '@/types/brochure';
import sampleBrochureData from '@/data/sample-brochure-single-page.json';

const TestBrochure: React.FC = () => {
  // Cast the JSON data to our TypeScript type
  const brochureData = sampleBrochureData as BrochureContent;

  return (
    <div className="w-full">
      <BrochureRenderer content={brochureData} />
    </div>
  );
};

export default TestBrochure;