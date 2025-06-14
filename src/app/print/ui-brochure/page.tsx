'use client';

import React from 'react';
import UIBasedA4 from '@/components/brochure/UIBasedA4';

const PrintUIBrochurePage: React.FC = () => {
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
      <UIBasedA4 />
    </>
  );
};

export default PrintUIBrochurePage;