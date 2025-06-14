import { BrochureContent } from '@/types/brochure';
import { A4_CONSTRAINTS } from './brochure-layout';

// Measure the actual rendered brochure by finding it in the DOM
export async function measureActualRenderedHeight(): Promise<{
  totalHeight: number;
  availableHeight: number;
  overflow: number;
  isValid: boolean;
}> {
  return new Promise((resolve) => {
    // Find the actual brochure preview container
    const previewContainer = document.getElementById('ui-brochure-preview');
    
    console.log('Real measurement: Looking for preview container...');
    
    if (!previewContainer) {
      console.log('Real measurement: Preview container not found!');
      resolve({
        totalHeight: 0,
        availableHeight: 807,
        overflow: 0,
        isValid: false
      });
      return;
    }
    
    console.log('Real measurement: Preview container found, content length:', previewContainer.innerHTML.length);

    // The preview container has transform scale-75, so we need to account for that
    const scaleFactor = 0.75;
    
    // Find the A4Page component inside the preview
    const a4Page = previewContainer.querySelector('[style*="794px"]') || 
                   previewContainer.querySelector('.w-\\[794px\\]') ||
                   previewContainer.firstElementChild as HTMLElement;
    
    console.log('Real measurement: A4 page element:', a4Page ? 'found' : 'not found');
    
    if (!a4Page) {
      console.log('Real measurement: A4 page element not found in preview container');
      resolve({
        totalHeight: 0,
        availableHeight: 807,
        overflow: 0,
        isValid: false
      });
      return;
    }
    
    console.log('Real measurement: A4 page element found, measuring...');

    // Wait for all rendering to complete
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Get the actual rendered height
        const actualHeight = a4Page.scrollHeight;
        const availableHeight = A4_CONSTRAINTS.AVAILABLE_HEIGHT; // 807px
        
        console.log('Real measurement: Raw measurements:', {
          actualHeight,
          availableHeight,
          scrollHeight: a4Page.scrollHeight,
          offsetHeight: a4Page.offsetHeight,
          clientHeight: a4Page.clientHeight
        });
        
        // Calculate overflow against available content height (consistent with estimation mode)
        const overflow = actualHeight - availableHeight;
        
        const result = {
          totalHeight: Math.round(actualHeight),
          availableHeight: availableHeight,
          overflow: Math.round(overflow),
          isValid: overflow <= 0
        };
        
        console.log('Real measurement: Final result:', result);
        
        resolve(result);
      });
    });
  });
}

// Enhanced validation using the actual DOM
export async function validateActualRendering(): Promise<{
  isValid: boolean;
  totalHeight: number;
  availableHeight: number;
  overflow: number;
  suggestions: string[];
}> {
  const measurement = await measureActualRenderedHeight();
  
  const suggestions: string[] = [];
  
  if (measurement.overflow > 0) {
    suggestions.push(`Content overflows by ${measurement.overflow}px`);
    
    if (measurement.overflow > 200) {
      suggestions.push('Content significantly overflows - consider 2-page layout');
    }
    
    if (measurement.overflow > 100) {
      suggestions.push('Try compact layout density');
      suggestions.push('Try smaller font size');
      suggestions.push('Reduce number of sections');
    }
    
    // Analyze which sections might be causing overflow
    const previewContainer = document.getElementById('ui-brochure-preview');
    if (previewContainer) {
      const sections = previewContainer.querySelectorAll('[class*="mb-6"]');
      if (sections.length > 4) {
        suggestions.push(`Consider reducing from ${sections.length} to 3-4 sections`);
      }
    }
  }
  
  return {
    isValid: measurement.isValid,
    totalHeight: measurement.totalHeight,
    availableHeight: measurement.availableHeight,
    overflow: measurement.overflow,
    suggestions
  };
}

// Measure individual sections for debugging
export async function debugSectionHeights(): Promise<Array<{
  sectionType: string;
  height: number;
  element: HTMLElement;
}>> {
  return new Promise((resolve) => {
    const previewContainer = document.getElementById('ui-brochure-preview');
    
    if (!previewContainer) {
      resolve([]);
      return;
    }

    const a4Page = previewContainer.querySelector('[style*="794px"]') || 
                   previewContainer.firstElementChild as HTMLElement;
    
    if (!a4Page) {
      resolve([]);
      return;
    }

    requestAnimationFrame(() => {
      // Find all direct children of the main content area
      const contentArea = a4Page.querySelector('.flex-1') || a4Page;
      const sections = Array.from(contentArea.children) as HTMLElement[];
      
      const measurements = sections.map((section, index) => {
        // Try to identify section type from content
        let sectionType = 'unknown';
        
        if (section.querySelector('h1')) sectionType = 'header';
        else if (section.textContent?.includes('Proven Results')) sectionType = 'metrics';
        else if (section.textContent?.includes('Core Services')) sectionType = 'features';
        else if (section.textContent?.includes('transformed')) sectionType = 'testimonial';
        else if (section.textContent?.includes('Growth Journey')) sectionType = 'contact';
        else if (section.textContent?.includes('Generated on')) sectionType = 'footer';
        else sectionType = `section-${index}`;
        
        return {
          sectionType,
          height: section.offsetHeight,
          element: section
        };
      });
      
      resolve(measurements);
    });
  });
}