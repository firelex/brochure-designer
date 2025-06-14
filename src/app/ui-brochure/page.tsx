'use client';

import React from 'react';
import UIBasedA4 from '@/components/brochure/UIBasedA4';
import ExportButton from './ExportButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const UIBrochurePage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gradient-main py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            UI Components A4 Report
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            A professional A4 report layout using your existing UI component library with 
            proper styling for both screen display and PDF export.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center">
                <ExportButton />
                <div className="text-sm text-text-tertiary">
                  Click to generate a high-quality PDF version of the report below
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-background-overlay p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-text-primary mb-2">✅ MetricCard Components</h3>
                  <p className="text-sm text-text-tertiary">
                    Professional metric displays with icons and trend indicators
                  </p>
                </div>
                <div className="bg-background-overlay p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-text-primary mb-2">📋 Card Layout</h3>
                  <p className="text-sm text-text-tertiary">
                    Structured content cards with headers, content, and proper spacing
                  </p>
                </div>
                <div className="bg-background-overlay p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-text-primary mb-2">⏱️ Timeline Component</h3>
                  <p className="text-sm text-text-tertiary">
                    Project progress visualization with status indicators
                  </p>
                </div>
                <div className="bg-background-overlay p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-text-primary mb-2">👥 Team Overview</h3>
                  <p className="text-sm text-text-tertiary">
                    Avatar components with badges for team member status
                  </p>
                </div>
                <div className="bg-background-overlay p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-text-primary mb-2">🎨 Print Optimization</h3>
                  <p className="text-sm text-text-tertiary">
                    Automatic color conversion for PDF/print output
                  </p>
                </div>
                <div className="bg-background-overlay p-4 rounded-lg border border-border">  
                  <h3 className="font-semibold text-text-primary mb-2">📄 A4 Format</h3>  
                  <p className="text-sm text-text-tertiary">
                    Perfect A4 dimensions with proper margins and page numbering
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Preview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
            </CardHeader>
            <CardContent noPadding>
              <div className="flex justify-center bg-background-secondary p-8 rounded-lg">
                <div 
                  id="ui-brochure-preview"
                  className="transform scale-75 origin-top shadow-2xl"
                  style={{ transformOrigin: 'top center' }}
                >
                  <UIBasedA4 />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UIBrochurePage;