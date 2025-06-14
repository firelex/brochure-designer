'use client';

import React, { useEffect, useState } from 'react';
import TestBrochure from '@/components/brochure/TestBrochure';
import { BrochureRenderer } from '@/components/brochure/BrochureRenderer';
import { BrochureContent } from '@/types/brochure';

const PrintUIBrochurePage: React.FC = () => {
  const [brochureContent, setBrochureContent] = useState<BrochureContent | null>(null);

  useEffect(() => {
    // Try to get content from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const contentParam = urlParams.get('content');
    
    if (contentParam) {
      try {
        const content = JSON.parse(decodeURIComponent(contentParam));
        setBrochureContent(content);
        console.log('Print route received content:', content);
      } catch (error) {
        console.error('Failed to parse brochure content from URL:', error);
      }
    }
  }, []);

  return (
    <>
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
        
        body {
          margin: 0;
          padding: 0;
          background: white;
        }
        
        /* Ensure backgrounds are printed */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Hide React development indicators */
        [data-reactroot] ~ div,
        [data-nextjs-toast],
        #__next-build-watcher,
        .__next-dev-overlay,
        [id*="react-refresh"],
        [class*="fast-refresh"],
        [style*="position: fixed"] {
          display: none !important;
        }
      `}</style>
      {brochureContent ? (
        <BrochureRenderer content={brochureContent} />
      ) : (
        <TestBrochure />
      )}
    </>
  );
};

export default PrintUIBrochurePage;