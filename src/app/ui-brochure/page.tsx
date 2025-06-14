'use client';

import React, { useState } from 'react';
import { BrochureRenderer } from '@/components/brochure/BrochureRenderer';
import LayoutValidator from '@/components/brochure/LayoutValidator';
import ExportButton from './ExportButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BrochureContent } from '@/types/brochure';

const UIBrochurePage: React.FC = () => {
  // State for brochure customization
  const [brochureDescription, setBrochureDescription] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [pageCount, setPageCount] = useState<1 | 2>(1);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [colorScheme, setColorScheme] = useState<'blue' | 'green' | 'purple' | 'orange'>('blue');
  const [layoutDensity, setLayoutDensity] = useState<'compact' | 'normal' | 'spacious'>('normal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [contentVersion, setContentVersion] = useState(0);
  
  // Brochure content state - start empty
  const [brochureContent, setBrochureContent] = useState<BrochureContent | null>(null);
  const [lastMeasurement, setLastMeasurement] = useState<any>(null);

  // Update settings when controls change (only if content exists)
  React.useEffect(() => {
    if (brochureContent) {
      setBrochureContent(prev => prev ? {
        ...prev,
        settings: {
          theme,
          pageCount,
          fontSize,
          colorScheme,
          layoutDensity
        }
      } : null);
      setContentVersion(prev => prev + 1);
    }
  }, [theme, pageCount, fontSize, colorScheme, layoutDensity]);

  // Measure content whenever it changes
  React.useEffect(() => {
    if (brochureContent) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        console.log('Effect: Measuring content after update...');
        measureAndUpdateValidation();
      }, 500);
    }
  }, [brochureContent, contentVersion]);
  
  const handleOptimizeContent = async (optimizedContent: BrochureContent) => {
    setBrochureContent(optimizedContent);
    // Update controls to match optimized settings
    setTheme(optimizedContent.settings.theme);
    setPageCount(optimizedContent.settings.pageCount);
    setFontSize(optimizedContent.settings.fontSize);
    setColorScheme(optimizedContent.settings.colorScheme);
    setLayoutDensity(optimizedContent.settings.layoutDensity);
  };

  // Handle real measurement-based optimization
  const handleRealOptimization = async (realMeasurement: any) => {
    // Not used anymore - we handle optimization on the server
  };

  // Simple function to directly measure the preview and update validation display
  const measureAndUpdateValidation = () => {
    console.log('Direct measurement: Starting...');
    
    const previewContainer = document.getElementById('ui-brochure-preview');
    if (!previewContainer) {
      console.log('Direct measurement: No preview container found');
      return null;
    }

    console.log('Direct measurement: Preview container found, checking for A4 page...');
    const a4Page = previewContainer.firstElementChild as HTMLElement;
    if (!a4Page) {
      console.log('Direct measurement: No A4 page found');
      return null;
    }

    console.log('Direct measurement: A4 page found, measuring heights...');
    
    // Check if we need to look inside the A4 page for the actual content
    const contentWrapper = a4Page.querySelector('.flex.flex-col.h-full') || a4Page;
    
    console.log('Direct measurement: Measuring element:', {
      element: contentWrapper === a4Page ? 'A4 page itself' : 'Content wrapper inside A4',
      scrollHeight: contentWrapper.scrollHeight,
      offsetHeight: contentWrapper.offsetHeight,
      clientHeight: contentWrapper.clientHeight,
      className: (contentWrapper as HTMLElement).className,
      childrenCount: contentWrapper.children.length
    });
    
    const actualHeight = contentWrapper.scrollHeight;
    const availableHeight = 807; // A4_CONSTRAINTS.AVAILABLE_HEIGHT
    const overflow = actualHeight - availableHeight;

    const measurement = {
      totalHeight: actualHeight,
      availableHeight,
      overflow,
      isValid: overflow <= 0
    };

    console.log('Direct measurement: Results', JSON.stringify(measurement, null, 2));

    // Update the validation display directly
    const validationCard = document.querySelector('[data-validation-display]');
    if (validationCard) {
      const contentHeightSpan = validationCard.querySelector('[data-content-height]');
      const overflowSpan = validationCard.querySelector('[data-overflow]');
      const statusSpan = validationCard.querySelector('[data-status]');
      
      if (contentHeightSpan) contentHeightSpan.textContent = `${actualHeight}px`;
      if (overflowSpan) overflowSpan.textContent = overflow > 0 ? `+${overflow}px` : `${overflow}px`;
      if (statusSpan) statusSpan.textContent = overflow <= 0 ? 'Layout OK' : 'Layout Issues';
    }

    // Store the measurement for UI updates
    setLastMeasurement(measurement);
    
    return measurement;
  };

  // Optimize with backend using real frontend measurements
  const optimizeWithBackend = async (realMeasurement: any) => {
    if (!brochureContent) return;

    console.log('Frontend: Starting backend optimization with real measurements:', realMeasurement);
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/optimize-brochure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: brochureContent,
          realMeasurement
        })
      });

      if (!response.ok) {
        throw new Error(`Optimization failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      console.log('Frontend: Backend optimization completed');
      setBrochureContent(result.content);
      setContentVersion(prev => prev + 1);
      
      // Re-measure after optimization
      setTimeout(() => {
        measureAndUpdateValidation();
      }, 1000);
      
    } catch (error) {
      console.error('Optimization error:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to optimize brochure');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBrochure = async () => {
    if (!brochureDescription.trim()) {
      setGenerationError('Please enter a description for your brochure');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/generate-brochure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: brochureDescription,
          settings: {
            pageCount,
            theme,
            fontSize,
            colorScheme,
            layoutDensity
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Update content with generated brochure
      setBrochureContent(result.content);
      setContentVersion(prev => prev + 1);
      
      // Measure the new content and potentially optimize
      setTimeout(() => {
        console.log('Frontend: Starting post-generation measurement...');
        const measurement = measureAndUpdateValidation();
        console.log('Frontend: Post-generation measurement result:', measurement);
        
        // If there's significant overflow, automatically optimize
        if (measurement && measurement.overflow > 50) {
          console.log('Frontend: Detected significant overflow, triggering backend optimization...');
          console.log('Frontend: Overflow amount:', measurement.overflow, 'px');
          optimizeWithBackend(measurement);
        } else if (measurement && measurement.overflow > 0) {
          console.log('Frontend: Minor overflow detected:', measurement.overflow, 'px - not optimizing');
        } else if (measurement) {
          console.log('Frontend: Content fits perfectly!');
        } else {
          console.log('Frontend: Failed to get measurement');
        }
      }, 1500);
      
    } catch (error) {
      console.error('Generation error:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate brochure');
    } finally {
      setIsGenerating(false);
    }
  };

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

        {/* Brochure Settings */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Brochure Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Description Input */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
                    Brochure Description
                  </label>
                  <textarea
                    id="description"
                    value={brochureDescription}
                    onChange={(e) => setBrochureDescription(e.target.value)}
                    placeholder="Describe what kind of brochure you want to create..."
                    className="w-full p-3 border border-border rounded-lg bg-background-overlay text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  
                  {/* Generate Button */}
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={handleGenerateBrochure}
                      disabled={isGenerating || !brochureDescription.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg font-medium hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isGenerating && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      )}
                      {isGenerating ? 'Generating...' : 'Generate with AI'}
                    </button>
                    
                    {generationError && (
                      <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                        {generationError}
                      </div>
                    )}
                  </div>
                </div>

                {/* Control Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Theme Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Theme
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                          theme === 'light'
                            ? 'bg-accent-primary text-white border-accent-primary'
                            : 'bg-background-overlay text-text-secondary border-border hover:border-accent-primary'
                        }`}
                      >
                        Light
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                          theme === 'dark'
                            ? 'bg-accent-primary text-white border-accent-primary'
                            : 'bg-background-overlay text-text-secondary border-border hover:border-accent-primary'
                        }`}
                      >
                        Dark
                      </button>
                    </div>
                  </div>

                  {/* Page Count */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Pages
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPageCount(1)}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                          pageCount === 1
                            ? 'bg-accent-primary text-white border-accent-primary'
                            : 'bg-background-overlay text-text-secondary border-border hover:border-accent-primary'
                        }`}
                      >
                        1 Page
                      </button>
                      <button
                        onClick={() => setPageCount(2)}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                          pageCount === 2
                            ? 'bg-accent-primary text-white border-accent-primary'
                            : 'bg-background-overlay text-text-secondary border-border hover:border-accent-primary'
                        }`}
                      >
                        2 Pages
                      </button>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Font Size
                    </label>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background-overlay text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  {/* Color Scheme */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Color Scheme
                    </label>
                    <select
                      value={colorScheme}
                      onChange={(e) => setColorScheme(e.target.value as 'blue' | 'green' | 'purple' | 'orange')}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background-overlay text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                    >
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="purple">Purple</option>
                      <option value="orange">Orange</option>
                    </select>
                  </div>

                  {/* Layout Density */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Layout Density
                    </label>
                    <select
                      value={layoutDensity}
                      onChange={(e) => setLayoutDensity(e.target.value as 'compact' | 'normal' | 'spacious')}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background-overlay text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                    >
                      <option value="compact">Compact</option>
                      <option value="normal">Normal</option>
                      <option value="spacious">Spacious</option>
                    </select>
                  </div>

                  {/* Export Button */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Export
                    </label>
                    <ExportButton brochureContent={brochureContent} />
                  </div>
                </div>

                {/* Settings Summary */}
                <div className="bg-background-secondary p-4 rounded-lg border border-border">
                  <h4 className="text-sm font-medium text-text-primary mb-2">Current Settings:</h4>
                  <div className="text-xs text-text-tertiary space-y-1">
                    <div>Theme: <span className="text-text-secondary capitalize">{theme}</span></div>
                    <div>Pages: <span className="text-text-secondary">{pageCount}</span></div>
                    <div>Font: <span className="text-text-secondary capitalize">{fontSize}</span></div>
                    <div>Colors: <span className="text-text-secondary capitalize">{colorScheme}</span></div>
                    <div>Density: <span className="text-text-secondary capitalize">{layoutDensity}</span></div>
                    {brochureDescription && (
                      <div>Description: <span className="text-text-secondary">"{brochureDescription.slice(0, 50)}{brochureDescription.length > 50 ? '...' : ''}"</span></div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simple Layout Validation - directly updated */}
        {brochureContent && (
          <div className="mb-8">
            <Card data-validation-display>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>Layout Validation</span>
                    <span className="text-lg">📏</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={measureAndUpdateValidation}
                      className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200"
                    >
                      Refresh
                    </button>
                    {lastMeasurement && lastMeasurement.overflow > 0 && (
                      <button
                        onClick={() => {
                          const currentMeasurement = measureAndUpdateValidation();
                          if (currentMeasurement && currentMeasurement.overflow > 0) {
                            console.log('Manual optimization triggered');
                            optimizeWithBackend(currentMeasurement);
                          }
                        }}
                        disabled={isGenerating}
                        className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-700 border border-orange-300 hover:bg-orange-200 disabled:opacity-50"
                      >
                        {isGenerating ? 'Optimizing...' : 'Optimize'}
                      </button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg border bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium" data-status>
                        Measuring...
                      </span>
                      <span className="text-sm">
                        {brochureContent.settings.pageCount} page{brochureContent.settings.pageCount > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div>Content Height: <span data-content-height>Measuring...</span></div>
                      <div>Available Height: 807px</div>
                      <div>Overflow: <span data-overflow>Calculating...</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
              <div className="flex justify-center bg-background-secondary p-8 rounded-lg min-h-[600px]">
                {brochureContent ? (
                  <div 
                    id="ui-brochure-preview"
                    className="transform scale-75 origin-top shadow-2xl"
                    style={{ transformOrigin: 'top center' }}
                  >
                    <BrochureRenderer content={brochureContent} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-20">
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-500 border-t-transparent mb-4"></div>
                        <h3 className="text-lg font-medium text-text-primary mb-2">Generating your brochure...</h3>
                        <p className="text-text-secondary">This may take up to 30 seconds</p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-background-overlay rounded-lg flex items-center justify-center mb-4">
                          <span className="text-2xl">📄</span>
                        </div>
                        <h3 className="text-lg font-medium text-text-primary mb-2">No brochure yet</h3>
                        <p className="text-text-secondary">Enter a description and click "Generate with AI" to create your brochure</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UIBrochurePage;