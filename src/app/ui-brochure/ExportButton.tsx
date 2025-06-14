'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

interface ExportButtonProps {
  method?: 'html' | 'url';
}

const ExportButton: React.FC<ExportButtonProps> = ({ method = 'url' }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleExportViaURL = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Get current URL
      const baseUrl = window.location.origin;
      const printUrl = `${baseUrl}/print/ui-brochure`;
      
      // Call the URL-based API
      const response = await fetch('/api/export-pdf-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: printUrl,
          options: {
            format: 'A4',
            orientation: 'portrait',
            printBackground: true,
            filename: 'ui-based-report.pdf',
            margins: {
              top: '0mm',
              right: '0mm',
              bottom: '0mm',
              left: '0mm'
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.status}`);
      }

      // Download the PDF
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ui-based-report.pdf';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handleExportViaURL}
      loading={isGeneratingPDF}
      disabled={isGeneratingPDF}
    >
      {isGeneratingPDF ? 'Generating PDF...' : 'Export as PDF'}
    </Button>
  );
};

export default ExportButton;