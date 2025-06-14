import { BrochureContent, BrochureSection } from '@/types/brochure';
import { A4_CONSTRAINTS } from './brochure-layout';

// Create a measurement container that mimics the actual A4Page component
function createMeasurementContainer(): HTMLDivElement {
  const container = document.createElement('div');
  
  // Apply the exact same classes as A4Page with p-12 margins
  container.className = 'bg-white p-12 h-full flex flex-col';
  container.style.cssText = `
    position: absolute;
    top: -9999px;
    left: -9999px;
    visibility: hidden;
    width: ${A4_CONSTRAINTS.PAGE_WIDTH}px;
    height: ${A4_CONSTRAINTS.PAGE_HEIGHT}px;
    overflow: visible;
    font-family: inherit;
    line-height: inherit;
    box-sizing: border-box;
  `;
  
  return container;
}

// Get font size classes that match the BrochureRenderer
function getFontSizeClass(fontSize: string, type: 'title' | 'heading' | 'subheading' | 'body'): string {
  const sizeMap = {
    small: {
      title: 'text-2xl font-bold',
      heading: 'text-xl font-semibold', 
      subheading: 'text-lg font-medium',
      body: 'text-sm'
    },
    medium: {
      title: 'text-3xl font-bold',
      heading: 'text-2xl font-semibold',
      subheading: 'text-xl font-medium', 
      body: 'text-base'
    },
    large: {
      title: 'text-4xl font-bold',
      heading: 'text-3xl font-semibold',
      subheading: 'text-2xl font-medium',
      body: 'text-lg'
    }
  };
  
  return sizeMap[fontSize as keyof typeof sizeMap]?.[type] || sizeMap.medium[type];
}

// Get spacing class based on layout density (matches BrochureRenderer)
function getSpacingClass(density: string): string {
  switch (density) {
    case 'compact': return 'space-y-4';
    case 'normal': return 'space-y-6';
    case 'spacious': return 'space-y-8';
    default: return 'space-y-6';
  }
}

// Render section HTML that matches the actual React components
function renderSectionForMeasurement(section: BrochureSection, settings: any): string {
  switch (section.type) {
    case 'hero':
      return `
        <div class="text-center mb-6">
          ${section.subtitle ? `<p class="${getFontSizeClass(settings.fontSize, 'body')} text-blue-600 mb-4">${section.subtitle}</p>` : ''}
          <h1 class="${getFontSizeClass(settings.fontSize, 'title')} mb-6">${section.title}</h1>
          ${section.description ? `<p class="${getFontSizeClass(settings.fontSize, 'body')} text-gray-600 max-w-2xl mx-auto mb-8">${section.description}</p>` : ''}
          ${section.ctaButton ? `<button class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">${section.ctaButton.text}</button>` : ''}
        </div>
      `;
      
    case 'metrics':
      const metrics = section.metrics || [];
      return `
        <div class="mb-6">
          ${section.title ? `<h2 class="${getFontSizeClass(settings.fontSize, 'heading')} text-center mb-6">${section.title}</h2>` : ''}
          <div class="grid grid-cols-3 gap-4">
            ${metrics.map(metric => `
              <div class="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center">
                <div class="text-2xl font-bold text-gray-100 mb-2">${metric.value}</div>
                <div class="${getFontSizeClass(settings.fontSize, 'body')} text-gray-400">${metric.title}</div>
                ${metric.change ? `<div class="text-sm text-green-400 mt-1">+${metric.change.value}%</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
    case 'features':
      const features = section.features || [];
      const cols = section.columns || 3;
      const gridClass = cols === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                       cols === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                       'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      return `
        <div class="mb-6">
          ${section.title ? `<h2 class="${getFontSizeClass(settings.fontSize, 'heading')} text-center mb-4">${section.title}</h2>` : ''}
          ${section.description ? `<p class="${getFontSizeClass(settings.fontSize, 'body')} text-gray-600 text-center max-w-3xl mx-auto mb-8">${section.description}</p>` : ''}
          <div class="grid ${gridClass} gap-6">
            ${features.slice(0, 6).map(feature => `
              <div class="text-center p-6 rounded-lg border border-gray-200">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <div class="w-6 h-6">★</div>
                </div>
                <h3 class="${getFontSizeClass(settings.fontSize, 'subheading')} mb-2">${feature.title}</h3>
                <p class="${getFontSizeClass(settings.fontSize, 'body')} text-gray-600">${feature.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
    case 'testimonial':
      const layout = section.layout || 'card';
      if (layout === 'centered') {
        return `
          <div class="text-center max-w-4xl mx-auto py-12 mb-6">
            ${section.rating ? `<div class="flex justify-center mb-6">${'★'.repeat(section.rating)}</div>` : ''}
            <blockquote class="${getFontSizeClass(settings.fontSize, 'heading')} mb-8">"${section.quote}"</blockquote>
            <div class="flex items-center justify-center space-x-4">
              <div class="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div class="text-left">
                <div class="font-semibold">${section.author.name}</div>
                <div class="text-gray-600">${section.author.title}${section.author.company ? `, ${section.author.company}` : ''}</div>
              </div>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="flex items-start space-x-4 mb-6">
            <div class="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
            <div class="flex-1">
              ${section.rating ? `<div class="flex mb-2">${'★'.repeat(section.rating)}</div>` : ''}
              <blockquote class="${getFontSizeClass(settings.fontSize, 'body')} mb-3">"${section.quote}"</blockquote>
              <div class="font-semibold">${section.author.name}</div>
              <div class="text-sm text-gray-600">${section.author.title}${section.author.company ? `, ${section.author.company}` : ''}</div>
            </div>
          </div>
        `;
      }
      
    case 'contact':
      return `
        <div class="p-8 rounded-lg bg-gray-50 mb-6">
          <div class="text-center mb-8">
            <h2 class="${getFontSizeClass(settings.fontSize, 'heading')} mb-4">${section.title || 'Contact Us'}</h2>
            ${section.description ? `<p class="${getFontSizeClass(settings.fontSize, 'body')} text-gray-600">${section.description}</p>` : ''}
          </div>
          ${section.contactInfo ? `
            <div class="space-y-4 mb-8">
              ${section.contactInfo.email ? `<div class="flex items-center space-x-3"><span>📧</span><span>${section.contactInfo.email}</span></div>` : ''}
              ${section.contactInfo.phone ? `<div class="flex items-center space-x-3"><span>📞</span><span>${section.contactInfo.phone}</span></div>` : ''}
              ${section.contactInfo.website ? `<div class="flex items-center space-x-3"><span>🌐</span><span>${section.contactInfo.website}</span></div>` : ''}
            </div>
          ` : ''}
          ${section.ctaButton ? `<div class="text-center"><button class="px-6 py-3 bg-blue-600 text-white rounded-lg">${section.ctaButton.text}</button></div>` : ''}
        </div>
      `;

    case 'pricing':
      const tiers = section.tiers || [];
      return `
        <div class="mb-6">
          ${section.title ? `<h2 class="${getFontSizeClass(settings.fontSize, 'heading')} text-center mb-4">${section.title}</h2>` : ''}
          ${section.description ? `<p class="${getFontSizeClass(settings.fontSize, 'body')} text-center text-gray-600 mb-8">${section.description}</p>` : ''}
          <div class="grid grid-cols-1 md:grid-cols-${Math.min(tiers.length, 3)} gap-6">
            ${tiers.slice(0, 3).map(tier => `
              <div class="bg-white rounded-lg border p-6 ${tier.highlighted ? 'border-blue-500 shadow-lg' : 'border-gray-200'}">
                ${tier.badge ? `<div class="absolute -top-3 left-1/2 transform -translate-x-1/2"><span class="bg-blue-600 text-white px-3 py-1 rounded text-sm">${tier.badge}</span></div>` : ''}
                <div class="text-center">
                  <h3 class="${getFontSizeClass(settings.fontSize, 'subheading')} mb-2">${tier.name}</h3>
                  <div class="text-4xl font-bold mb-4">${tier.price}</div>
                  ${tier.ctaButton ? `<button class="w-full px-4 py-2 bg-blue-600 text-white rounded mb-6">${tier.ctaButton.text}</button>` : ''}
                </div>
                <div class="space-y-3">
                  ${tier.features.slice(0, 5).map(feature => `
                    <div class="flex items-center space-x-3">
                      <span class="text-${feature.included ? 'green' : 'gray'}-500">${feature.included ? '✓' : '✗'}</span>
                      <span class="${getFontSizeClass(settings.fontSize, 'body')}">${feature.text}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
    case 'timeline':
      const steps = section.steps || [];
      return `
        <div class="mb-6">
          <div class="bg-white rounded-lg border p-6">
            <h3 class="${getFontSizeClass(settings.fontSize, 'subheading')} mb-4">${section.title || 'Timeline'}</h3>
            <div class="space-y-4">
              ${steps.map(step => `
                <div class="flex items-start space-x-4">
                  <div class="w-6 h-6 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h4 class="font-medium">${step.label}</h4>
                    <p class="${getFontSizeClass(settings.fontSize, 'body')} text-gray-600">${step.description || ''}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      
    default:
      return `<div class="mb-6 p-4 border rounded">Unknown section: ${section.type}</div>`;
  }
}

// Main measurement function
export async function measureTotalContentHeight(content: BrochureContent): Promise<{
  totalHeight: number;
  availableHeight: number;
  sectionHeights: number[];
}> {
  return new Promise((resolve) => {
    const container = createMeasurementContainer();
    
    // Create the exact same structure as BrochureRenderer
    const fullHTML = `
      <!-- Header (matches BrochureRenderer) -->
      <div class="mb-6">
        <h1 class="${getFontSizeClass(content.settings.fontSize, 'title')} mb-2">${content.title}</h1>
        <p class="${getFontSizeClass(content.settings.fontSize, 'body')} text-gray-600">${content.description}</p>
      </div>

      <!-- Main content area with same constraints -->
      <div class="flex flex-col ${getSpacingClass(content.settings.layoutDensity)}" style="max-height: ${A4_CONSTRAINTS.AVAILABLE_HEIGHT}px; overflow: hidden;">
        ${content.sections.map(section => renderSectionForMeasurement(section, content.settings)).join('')}
      </div>

      <!-- Footer (matches BrochureRenderer) -->
      <div class="mt-auto pt-4 border-t border-gray-200 text-center">
        <p class="${getFontSizeClass(content.settings.fontSize, 'body')} text-gray-500">
          Generated on ${new Date().toLocaleDateString()} | ${content.title}
        </p>
      </div>
    `;
    
    container.innerHTML = fullHTML;
    document.body.appendChild(container);
    
    // Ensure Tailwind classes are processed
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const totalHeight = container.scrollHeight;
        const mainContentArea = container.querySelector('[style*="max-height"]') as HTMLElement;
        const actualContentHeight = mainContentArea ? mainContentArea.scrollHeight : 0;
        
        // Measure individual sections if needed
        const sectionElements = mainContentArea?.children || [];
        const sectionHeights = Array.from(sectionElements).map(el => (el as HTMLElement).offsetHeight);
        
        document.body.removeChild(container);
        
        resolve({
          totalHeight: Math.round(totalHeight),
          availableHeight: A4_CONSTRAINTS.AVAILABLE_HEIGHT,
          sectionHeights
        });
      });
    });
  });
}

// Updated validation function using real DOM measurements
export async function validateBrochureLayoutWithMeasurement(content: BrochureContent): Promise<{
  isValid: boolean;
  totalHeight: number;
  availableHeight: number;
  overflow: number;
  suggestions: string[];
}> {
  const measurement = await measureTotalContentHeight(content);
  const overflow = measurement.totalHeight - A4_CONSTRAINTS.PAGE_HEIGHT;
  const isValid = overflow <= 0 || content.settings.pageCount === 2;
  
  const suggestions: string[] = [];
  
  if (overflow > 0 && content.settings.pageCount === 1) {
    suggestions.push(`Content overflows by ${Math.round(overflow)}px`);
    
    if (overflow > 200) {
      suggestions.push('Consider switching to 2-page layout');
    }
    
    if (content.settings.layoutDensity === 'spacious') {
      suggestions.push('Try "compact" layout density');
    }
    
    if (content.settings.fontSize === 'large') {
      suggestions.push('Try "medium" or "small" font size');
    }
    
    // Specific suggestions based on content
    content.sections.forEach(section => {
      if (section.type === 'features' && section.features && section.features.length > 3) {
        suggestions.push('Reduce number of features to fit better');
      }
      if (section.type === 'pricing' && section.tiers && section.tiers.length > 2) {
        suggestions.push('Show fewer pricing tiers');
      }
    });
  }
  
  return {
    isValid,
    totalHeight: Math.round(measurement.totalHeight),
    availableHeight: A4_CONSTRAINTS.PAGE_HEIGHT,
    overflow: Math.round(overflow),
    suggestions
  };
}