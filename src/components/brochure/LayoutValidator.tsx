'use client';

import React, { useState, useEffect } from 'react';
import { BrochureContent } from '@/types/brochure';
import { validateActualRendering } from '@/lib/real-measurement';
import { MeasurementRenderer } from './MeasurementRenderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface LayoutValidatorProps {
  content: BrochureContent;
  onOptimize?: (optimizedContent: BrochureContent) => void;
  onRealOptimize?: (realMeasurement: any) => void;
  className?: string;
}

export const LayoutValidator: React.FC<LayoutValidatorProps> = ({
  content,
  onOptimize,
  onRealOptimize,
  className
}) => {
  const [validation, setValidation] = useState({
    isValid: false,
    totalHeight: 0,
    availableHeight: 807,
    overflow: 0,
    suggestions: ['Measuring...']
  });
  const [isLoading, setIsLoading] = useState(true); // Start loading immediately
  const [measurementMode, setMeasurementMode] = useState<'dom' | 'component'>('dom');
  const [showMeasurementRenderer, setShowMeasurementRenderer] = useState(false);

  // Re-validate when content changes using real measurements
  useEffect(() => {
    console.log('LayoutValidator: Content changed, re-measuring...', { 
      contentTitle: content?.title, 
      contentSections: content?.sections?.length,
      measurementMode 
    });
    
    setIsLoading(true);
    
    // Reset validation to loading state
    setValidation({
      isValid: false,
      totalHeight: 0,
      availableHeight: 807,
      overflow: 0,
      suggestions: ['Measuring...']
    });
    
    // Add multiple attempts with increasing delays to ensure DOM has updated
    const measurementTimer = setTimeout(() => {
      if (measurementMode === 'dom') {
        console.log('LayoutValidator: Starting DOM measurement...');
        
        // Force a re-flow before measuring
        const previewContainer = document.getElementById('ui-brochure-preview');
        if (previewContainer) {
          console.log('LayoutValidator: Preview container found, content:', previewContainer.innerHTML.length, 'chars');
          // Force reflow
          previewContainer.offsetHeight;
          
          // Wait a bit more for any async rendering
          setTimeout(() => {
            validateActualRendering()
              .then(result => {
                console.log('LayoutValidator: DOM measurement complete:', result);
                setValidation(result);
                setIsLoading(false);
              })
              .catch((error) => {
                console.log('LayoutValidator: DOM measurement failed:', error);
                // Fallback to basic structure if DOM measurement fails
                setValidation({
                  isValid: false,
                  totalHeight: 0,
                  availableHeight: 807,
                  overflow: 0,
                  suggestions: ['Unable to measure - check preview is visible']
                });
                setIsLoading(false);
              });
          }, 200);
        } else {
          console.log('LayoutValidator: Preview container not found!');
          setValidation({
            isValid: false,
            totalHeight: 0,
            availableHeight: 807,
            overflow: 0,
            suggestions: ['Preview container not found']
          });
          setIsLoading(false);
        }
      } else if (measurementMode === 'component') {
        console.log('LayoutValidator: Starting component measurement...');
        setShowMeasurementRenderer(true);
      }
    }, 1000); // Even longer delay

    return () => clearTimeout(measurementTimer);
  }, [content, measurementMode]);

  // Handle measurement from hidden component
  const handleComponentMeasurement = (measurement: any) => {
    setValidation({
      isValid: measurement.isValid,
      totalHeight: measurement.totalHeight,
      availableHeight: measurement.availableHeight,
      overflow: measurement.overflow,
      suggestions: measurement.overflow > 0 ? [`Content overflows by ${measurement.overflow}px`] : []
    });
    setIsLoading(false);
    setShowMeasurementRenderer(false);
  };
  
  const getStatusColor = () => {
    if (validation.isValid) return 'text-green-600 bg-green-50 border-green-200';
    if (validation.overflow < 100) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };
  
  const getStatusIcon = () => {
    if (validation.isValid) return '✅';
    if (validation.overflow < 100) return '⚠️';
    return '❌';
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Layout Validation</span>
            <span className="text-lg">{getStatusIcon()}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setMeasurementMode('dom')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                measurementMode === 'dom'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              DOM
            </button>
            <button
              onClick={() => setMeasurementMode('component')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                measurementMode === 'component'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              Real
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status Summary */}
          <div className={`p-3 rounded-lg border ${getStatusColor()}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">
                {isLoading ? 'Measuring...' : validation.isValid ? 'Layout OK' : 'Layout Issues'}
              </span>
              <span className="text-sm">
                {content.settings.pageCount} page{content.settings.pageCount > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="text-sm space-y-1">
              <div>Content Height: {validation.totalHeight}px</div>
              <div>Available Height: {validation.availableHeight}px</div>
              {validation.overflow > 0 && (
                <div className="font-medium">
                  Overflow: +{validation.overflow}px
                </div>
              )}
            </div>
          </div>
          
          {/* Height Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Space Usage</span>
              <span>{Math.round((validation.totalHeight / validation.availableHeight) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  validation.isValid ? 'bg-green-500' : 
                  validation.overflow < 100 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.min(100, (validation.totalHeight / validation.availableHeight) * 100)}%` 
                }}
              />
            </div>
          </div>
          
          {/* Suggestions */}
          {validation.suggestions.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Suggestions:</h4>
              <ul className="space-y-1">
                {validation.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Info about auto-optimization */}
          {!validation.isValid && content.settings.pageCount === 1 && validation.overflow > 50 && (
            <div className="pt-2 border-t">
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="font-medium text-blue-800 mb-1">💡 Auto-Optimization Active</div>
                <p className="text-blue-700">
                  Content with significant overflow is automatically optimized using AI during generation (up to 3 attempts).
                </p>
              </div>
            </div>
          )}
          
          {/* Page Break Info for 2-page layouts */}
          {content.settings.pageCount === 2 && validation.pageBreaks && (
            <div className="text-sm">
              <span className="font-medium">Page breaks after sections: </span>
              {validation.pageBreaks.join(', ') || 'None needed'}
            </div>
          )}
        </div>
        
        {/* Hidden measurement renderer for component mode */}
        {showMeasurementRenderer && (
          <MeasurementRenderer 
            content={content} 
            onMeasurement={handleComponentMeasurement} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LayoutValidator;