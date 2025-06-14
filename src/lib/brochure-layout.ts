import { BrochureContent, BrochureSection } from '@/types/brochure';

// A4 dimensions and constraints (based on existing A4Page component)
export const A4_CONSTRAINTS = {
  // A4 dimensions at 96 DPI: 794×1123 pixels
  PAGE_WIDTH: 794,
  PAGE_HEIGHT: 1123,
  
  // Margins from A4Page component (p-12 = 48px padding on ALL sides)
  MARGIN_TOP: 48,
  MARGIN_BOTTOM: 48,
  MARGIN_LEFT: 48,
  MARGIN_RIGHT: 48,
  
  // Available content area AFTER removing padding
  get CONTENT_WIDTH() { return this.PAGE_WIDTH - this.MARGIN_LEFT - this.MARGIN_RIGHT; }, // 794 - 96 = 698px
  get CONTENT_HEIGHT() { return this.PAGE_HEIGHT - this.MARGIN_TOP - this.MARGIN_BOTTOM; }, // 1123 - 96 = 1027px
  
  // Header/footer space (these are WITHIN the content area)
  PAGE_NUMBER_SPACE: 48, // Page number is positioned bottom-12 (48px from content bottom)
  HEADER_HEIGHT: 124,    // Title (text-3xl ~36px) + description (text-lg ~28px) + mb-6 (24px) + spacing
  FOOTER_HEIGHT: 48,     // Generated date line + pt-4 border + mt-auto spacing
  
  // Available space for main content sections
  get AVAILABLE_HEIGHT() { 
    return this.CONTENT_HEIGHT - this.HEADER_HEIGHT - this.FOOTER_HEIGHT - this.PAGE_NUMBER_SPACE;
  }
};

// Height estimates for different components (in pixels)
export const COMPONENT_HEIGHTS = {
  // Layout density spacing (space-y-* classes)
  DENSITY_SPACING: {
    compact: 16,  // space-y-4
    normal: 24,   // space-y-6  
    spacious: 32  // space-y-8
  },
  
  // Hero section
  HERO_COMPACT: 140,
  HERO_NORMAL: 180,
  HERO_WITH_CTA: 220,
  
  // Metrics
  METRIC_CARD_HEIGHT: 110,
  METRICS_TITLE: 35,
  METRICS_3_COLS: 145, // Title + cards + spacing
  
  // Features
  FEATURE_TITLE: 55,   // Title + description
  FEATURE_CARD_HEIGHT: 130,
  FEATURES_3_COLS: 240, // Title + 3 feature cards
  FEATURES_4_COLS: 185, // Shorter cards in 4-col layout
  
  // Testimonial
  TESTIMONIAL_INLINE: 75,
  TESTIMONIAL_CARD: 110,
  TESTIMONIAL_CENTERED: 160,
  
  // Contact
  CONTACT_COMPACT: 110,
  CONTACT_WITH_SOCIAL: 145,
  
  // Pricing
  PRICING_TITLE: 60,
  PRICING_PER_TIER: 400, // Each pricing tier is quite tall
  
  // Timeline
  TIMELINE_TITLE: 60,
  TIMELINE_PER_STEP: 60,
  
  // Team
  TEAM_TITLE: 60,
  TEAM_PER_MEMBER: 50,
  
  // Text
  TEXT_TITLE: 40,
  TEXT_PER_LINE: 24, // Approximate line height
  
  // Grid
  GRID_2_COLS: 200,
  GRID_3_COLS: 180,
  
  // Image
  IMAGE_FULL: 200,
  IMAGE_SIDE_BY_SIDE: 160
};

export interface LayoutValidation {
  isValid: boolean;
  totalHeight: number;
  availableHeight: number;
  overflow: number;
  suggestions: string[];
  pageBreaks?: number[]; // For 2-page layouts
}

export function estimateSectionHeight(section: BrochureSection, settings: any): number {
  const { COMPONENT_HEIGHTS: H } = { COMPONENT_HEIGHTS };
  
  switch (section.type) {
    case 'hero':
      let heroHeight = H.HERO_NORMAL;
      if (section.ctaButton) heroHeight = H.HERO_WITH_CTA;
      if (section.description && section.description.length > 100) heroHeight += 40;
      return heroHeight;
      
    case 'metrics':
      return H.METRICS_TITLE + H.METRICS_3_COLS;
      
    case 'features':
      const featureHeight = section.columns === 4 ? H.FEATURES_4_COLS : H.FEATURES_3_COLS;
      return H.FEATURE_TITLE + featureHeight;
      
    case 'testimonial':
      switch (section.layout) {
        case 'centered': return H.TESTIMONIAL_CENTERED;
        case 'card': return H.TESTIMONIAL_CARD;
        default: return H.TESTIMONIAL_INLINE;
      }
      
    case 'contact':
      const hasExtras = section.socialLinks?.length || section.ctaButton;
      return hasExtras ? H.CONTACT_WITH_SOCIAL : H.CONTACT_COMPACT;
      
    case 'pricing':
      const tierCount = section.tiers?.length || 3;
      return H.PRICING_TITLE + (H.PRICING_PER_TIER * Math.min(tierCount, 3)); // Max 3 per row
      
    case 'timeline':
      const stepCount = section.steps?.length || 3;
      return H.TIMELINE_TITLE + (H.TIMELINE_PER_STEP * stepCount);
      
    case 'team':
      const memberCount = section.members?.length || 3;
      return H.TEAM_TITLE + (H.TEAM_PER_MEMBER * memberCount);
      
    case 'text':
      const lineCount = Math.ceil((section.content?.length || 100) / 80); // ~80 chars per line
      return H.TEXT_TITLE + (H.TEXT_PER_LINE * lineCount);
      
    case 'grid':
      return section.columns === 2 ? H.GRID_2_COLS : H.GRID_3_COLS;
      
    case 'image':
      return section.layout === 'full' ? H.IMAGE_FULL : H.IMAGE_SIDE_BY_SIDE;
      
    default:
      return 100; // Default estimate
  }
}

export function validateBrochureLayout(content: BrochureContent): LayoutValidation {
  const { settings, sections } = content;
  const availableHeight = A4_CONSTRAINTS.AVAILABLE_HEIGHT;
  
  let totalHeight = 0;
  const suggestions: string[] = [];
  const pageBreaks: number[] = [];
  
  // Get spacing based on layout density
  const densitySpacing = COMPONENT_HEIGHTS.DENSITY_SPACING[settings.layoutDensity];
  
  // Calculate total height
  sections.forEach((section, index) => {
    const sectionHeight = estimateSectionHeight(section, settings);
    totalHeight += sectionHeight;
    
    // Add spacing between sections (except for the last one)
    if (index < sections.length - 1) {
      totalHeight += densitySpacing;
    }
    
    // Track potential page breaks for 2-page layout
    if (totalHeight > availableHeight && settings.pageCount === 2) {
      pageBreaks.push(index);
    }
  });
  
  const overflow = totalHeight - availableHeight;
  const isValid = overflow <= 0 || settings.pageCount === 2;
  
  // Generate suggestions
  if (overflow > 0 && settings.pageCount === 1) {
    suggestions.push(`Content overflows by ${Math.round(overflow)}px`);
    
    if (overflow > 200) {
      suggestions.push('Consider switching to 2-page layout');
    }
    
    // Find sections that could be optimized
    sections.forEach((section, index) => {
      switch (section.type) {
        case 'features':
          if (section.features && section.features.length > 3) {
            suggestions.push('Reduce features to 3 or fewer');
          }
          break;
        case 'pricing':
          if (section.tiers && section.tiers.length > 2) {
            suggestions.push('Consider showing only 2 pricing tiers');
          }
          break;
        case 'testimonial':
          if (section.layout === 'centered') {
            suggestions.push('Use inline testimonial layout to save space');
          }
          break;
        case 'timeline':
          if (section.steps && section.steps.length > 4) {
            suggestions.push('Limit timeline to 4 steps or fewer');
          }
          break;
      }
    });
    
    // Layout density suggestions
    if (settings.layoutDensity === 'spacious') {
      suggestions.push('Try "compact" layout density');
    } else if (settings.layoutDensity === 'normal') {
      suggestions.push('Try "compact" layout density');
    }
    
    // Font size suggestions
    if (settings.fontSize === 'large') {
      suggestions.push('Try "medium" or "small" font size');
    } else if (settings.fontSize === 'medium') {
      suggestions.push('Try "small" font size');
    }
  }
  
  return {
    isValid,
    totalHeight: Math.round(totalHeight),
    availableHeight: Math.round(availableHeight),
    overflow: Math.round(overflow),
    suggestions,
    pageBreaks: settings.pageCount === 2 ? pageBreaks : undefined
  };
}

export function optimizeContentForSinglePage(content: BrochureContent): BrochureContent {
  const validation = validateBrochureLayout(content);
  
  if (validation.isValid) return content;
  
  // Clone content for optimization
  const optimized = JSON.parse(JSON.stringify(content)) as BrochureContent;
  
  // Apply optimizations
  optimized.settings.layoutDensity = 'compact';
  
  if (optimized.settings.fontSize === 'large') {
    optimized.settings.fontSize = 'medium';
  }
  
  // Optimize sections
  optimized.sections = optimized.sections.map(section => {
    switch (section.type) {
      case 'features':
        if (section.features && section.features.length > 3) {
          return {
            ...section,
            features: section.features.slice(0, 3)
          };
        }
        break;
        
      case 'pricing':
        if (section.tiers && section.tiers.length > 2) {
          return {
            ...section,
            tiers: section.tiers.slice(0, 2)
          };
        }
        break;
        
      case 'testimonial':
        if (section.layout === 'centered') {
          return {
            ...section,
            layout: 'inline' as const
          };
        }
        break;
        
      case 'timeline':
        if (section.steps && section.steps.length > 4) {
          return {
            ...section,
            steps: section.steps.slice(0, 4)
          };
        }
        break;
    }
    return section;
  });
  
  return optimized;
}