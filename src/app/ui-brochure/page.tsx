'use client';

import React, { useState } from 'react';
import UIBasedA4 from '@/components/brochure/UIBasedA4';
import TestBrochure from '@/components/brochure/TestBrochure';
import { BrochureRenderer } from '@/components/brochure/BrochureRenderer';
import LayoutValidator from '@/components/brochure/LayoutValidator';
import ExportButton from './ExportButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BrochureContent } from '@/types/brochure';
import sampleBrochureData from '@/data/sample-brochure-single-page.json';
import sampleOverflowData from '@/data/sample-brochure-overflow.json';

const UIBrochurePage: React.FC = () => {
  // State for brochure customization
  const [brochureDescription, setBrochureDescription] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [pageCount, setPageCount] = useState<1 | 2>(1);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [colorScheme, setColorScheme] = useState<'blue' | 'green' | 'purple' | 'orange'>('blue');
  const [layoutDensity, setLayoutDensity] = useState<'compact' | 'normal' | 'spacious'>('normal');
  const [sampleType, setSampleType] = useState<'compact' | 'overflow'>('compact');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [contentVersion, setContentVersion] = useState(0);
  
  // Brochure content state
  const [brochureContent, setBrochureContent] = useState<BrochureContent>(() => {
    const content = sampleBrochureData as BrochureContent;
    return {
      ...content,
      settings: {
        theme,
        pageCount,
        fontSize,
        colorScheme,
        layoutDensity
      }
    };
  });

  // Update content when sample type changes
  React.useEffect(() => {
    const sourceData = sampleType === 'overflow' ? sampleOverflowData : sampleBrochureData;
    const content = sourceData as BrochureContent;
    setBrochureContent({
      ...content,
      settings: {
        theme,
        pageCount,
        fontSize,
        colorScheme,
        layoutDensity
      }
    });
  }, [sampleType, theme, pageCount, fontSize, colorScheme, layoutDensity]);
  
  // Update brochure settings when controls change
  React.useEffect(() => {
    setBrochureContent(prev => ({
      ...prev,
      settings: {
        theme,
        pageCount,
        fontSize,
        colorScheme,
        layoutDensity
      }
    }));
  }, [theme, pageCount, fontSize, colorScheme, layoutDensity]);
  
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
    if (realMeasurement.overflow <= 50) return; // Only optimize if significant overflow

    console.log('Triggering real measurement optimization:', realMeasurement);
    
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

      if (response.ok) {
        const result = await response.json();
        if (result.content) {
          console.log(`Optimization improved overflow from ${result.originalOverflow}px`);
          setBrochureContent(result.content);
          setContentVersion(prev => prev + 1); // Force LayoutValidator re-render
        }
      } else {
        const errorData = await response.json();
        setGenerationError(`Optimization failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Real optimization failed:', error);
      setGenerationError('Optimization failed - please try again');
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
      setContentVersion(prev => prev + 1); // Force LayoutValidator re-render
      
      // Switch to showing the generated content instead of sample
      setSampleType('compact'); // Reset sample type
      
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
                      className="px-4 py-2 bg-accent-500 text-white rounded-lg font-medium hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
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

                  {/* Sample Content */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Sample Content
                    </label>
                    <select
                      value={sampleType}
                      onChange={(e) => setSampleType(e.target.value as 'compact' | 'overflow')}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background-overlay text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                    >
                      <option value="compact">Compact (Fits 1 Page)</option>
                      <option value="overflow">Full Content (Overflows)</option>
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

        {/* Layout Validation */}
        <div className="mb-8">
          <LayoutValidator 
            key={`layout-validator-${contentVersion}`}
            content={brochureContent}
            onOptimize={handleOptimizeContent}
            onRealOptimize={handleRealOptimization}
          />
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
                  <BrochureRenderer content={brochureContent} />
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