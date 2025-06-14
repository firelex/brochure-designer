import { BrochureContent } from '@/types/brochure';

export interface GenerationContext {
  description: string;
  settings: {
    pageCount: number;
    theme: string;
    fontSize: string;
    colorScheme: string;
    layoutDensity: string;
  };
  validation?: {
    previousAttempt?: BrochureContent;
    overflow?: number;
    suggestions?: string[];
  };
}

export function createBrochurePrompt(context: GenerationContext): string {
  const { description, settings, validation } = context;
  
  // Space constraint guidance based on layout density and page count
  const spaceConstraints = getSpaceConstraints(settings);
  
  // Optimization instructions if this is a retry
  const optimizationInstructions = validation ? getOptimizationInstructions(validation) : '';

  return `Create a professional business brochure based on this description: "${description}"

${optimizationInstructions}

CRITICAL SPACE CONSTRAINTS:
${spaceConstraints}

Settings:
- Pages: ${settings.pageCount} (${settings.pageCount === 1 ? 'MUST fit on single page' : 'can use 2 pages'})
- Layout density: ${settings.layoutDensity} (${getDensityGuidance(settings.layoutDensity)})
- Font size: ${settings.fontSize}
- Color scheme: ${settings.colorScheme}
- Theme: ${settings.theme}

JSON Structure Required:
{
  "title": "Business Name (keep under 50 characters)",
  "description": "Brief tagline (keep under 80 characters)",
  "settings": {
    "pageCount": ${settings.pageCount},
    "theme": "${settings.theme}",
    "fontSize": "${settings.fontSize}",
    "colorScheme": "${settings.colorScheme}",
    "layoutDensity": "${settings.layoutDensity}"
  },
  "sections": [
    ${getSectionGuidance(settings)}
  ]
}

CONTENT GUIDELINES:
- Hero: Title (max 8 words), subtitle optional, description 1-2 sentences
- Metrics: Max 3 metrics for single page, use realistic numbers
- Features: Max ${settings.pageCount === 1 ? '3-4' : '6'} features, keep descriptions under 15 words each
- Testimonial: Quote under 25 words, use "centered" layout for impact
- Contact: Keep contact info concise, max 3 contact methods

VALIDATION RULES:
- All button variants must be: "primary", "secondary", or "ghost"
- Features columns: 2-3 max (3 for normal/spacious, 2 for compact)
- Pricing tiers: Max 3 for single page
- Timeline steps: Max 4 for single page
- ALL features MUST have unique "id" fields (e.g., "feature-1", "feature-2")
- ALL metrics MUST have unique "id" fields if they exist

Return ONLY the JSON object, no additional text or markdown.`;
}

function getSpaceConstraints(settings: any): string {
  if (settings.pageCount === 1) {
    if (settings.layoutDensity === 'compact') {
      return `- SINGLE PAGE MAXIMUM: 3-4 sections ONLY (hero + 1-2 optional + contact)
- Compact spacing: 2-3 word descriptions maximum
- Hero section MUST be minimal (no subtitle, short description)
- Contact section MUST be minimal (email only, short title)`;
    } else if (settings.layoutDensity === 'spacious') {
      return `- SINGLE PAGE MAXIMUM: 2-3 sections ONLY (hero + contact + maybe 1 more)
- Spacious layout means VERY limited content
- Descriptions must be 1-2 words only
- Remove ALL optional elements`;
    } else {
      return `- SINGLE PAGE MAXIMUM: 3-4 sections ONLY
- Available height: ONLY 807 pixels total
- Each section averages 200px - plan accordingly
- REMOVE sections if content doesn't fit`;
    }
  } else {
    return `- TWO PAGES: Can include 6-8 sections total
- Distribute content evenly between pages
- More detailed descriptions allowed`;
  }
}

function getDensityGuidance(density: string): string {
  switch (density) {
    case 'compact': return 'tight spacing, more content, shorter descriptions';
    case 'spacious': return 'generous spacing, less content, breathing room';
    default: return 'balanced spacing and content';
  }
}

function getSectionGuidance(settings: any): string {
  const isCompact = settings.layoutDensity === 'compact';
  const isSinglePage = settings.pageCount === 1;
  
  if (isSinglePage && isCompact) {
    return `{
      "type": "hero",
      "title": "Short Impactful Title",
      "description": "One concise sentence.",
      "ctaButton": {"text": "Action", "variant": "primary"}
    },
    {
      "type": "features",
      "title": "Key Services",
      "columns": 3,
      "features": [
        {"id": "feature-1", "title": "Service 1", "description": "Brief description."},
        {"id": "feature-2", "title": "Service 2", "description": "Brief description."},
        {"id": "feature-3", "title": "Service 3", "description": "Brief description."}
      ]
    },
    {
      "type": "contact",
      "title": "Get Started",
      "contactInfo": {"email": "contact@business.com", "phone": "(555) 123-4567"},
      "ctaButton": {"text": "Contact Us", "variant": "primary"}
    }`;
  }
  
  return `{
      "type": "hero",
      "title": "Compelling Business Title",
      "subtitle": "Optional subtitle",
      "description": "Brief value proposition in 1-2 sentences.",
      "ctaButton": {"text": "Get Started", "variant": "primary"}
    },
    {
      "type": "metrics",
      "title": "Proven Results",
      "metrics": [
        {"value": "150+", "title": "Clients", "change": {"value": "25", "period": "this year"}},
        {"value": "98%", "title": "Success Rate"}
      ]
    },
    {
      "type": "features",
      "title": "Core Services",
      "columns": 3,
      "features": [
        {"id": "feature-1", "title": "Service 1", "description": "Clear description of service."},
        {"id": "feature-2", "title": "Service 2", "description": "Clear description of service."},
        {"id": "feature-3", "title": "Service 3", "description": "Clear description of service."}
      ]
    },
    {
      "type": "contact",
      "title": "Start Your Journey",
      "description": "Ready to transform your business?",
      "contactInfo": {"email": "contact@business.com", "phone": "(555) 123-4567"},
      "ctaButton": {"text": "Schedule Consultation", "variant": "primary"}
    }`;
}

function getOptimizationInstructions(validation: any): string {
  if (!validation.overflow || validation.overflow <= 0) {
    return '';
  }

  const overflow = validation.overflow;
  const instructions = [`CRITICAL: Previous attempt overflowed by ${overflow}px. You MUST make MAJOR changes to fit.`];
  
  // Give increasingly aggressive instructions based on overflow amount
  if (overflow > 200) {
    instructions.push('\nDRASTIC REDUCTION REQUIRED:');
    instructions.push('- REMOVE entire sections if necessary (keep only hero + contact minimum)');
    instructions.push('- If keeping metrics, use only 2 metrics max');
    instructions.push('- If keeping features, use only 2 features max with 5-word descriptions');
    instructions.push('- Eliminate ALL optional content (subtitles, descriptions, etc.)');
  } else if (overflow > 100) {
    instructions.push('\nSIGNIFICANT REDUCTION REQUIRED:');
    instructions.push('- REMOVE 1-2 sections entirely (keep most essential only)');
    instructions.push('- Cut all descriptions to maximum 3-5 words');
    instructions.push('- Remove subtitles and optional text');
    instructions.push('- Use minimum possible content');
  } else if (overflow > 50) {
    instructions.push('\nMODERATE REDUCTION REQUIRED:');
    instructions.push('- Shorten ALL descriptions significantly');
    instructions.push('- Remove non-essential sections');
    instructions.push('- Use more compact wording');
  }
  
  instructions.push('\nSECTION REMOVAL GUIDELINES:');
  instructions.push('- Hero section: REQUIRED (but make minimal)');
  instructions.push('- Contact section: REQUIRED (but make minimal)');
  instructions.push('- Metrics section: OPTIONAL - remove if needed');
  instructions.push('- Features section: OPTIONAL - remove if needed');
  instructions.push('- Testimonial section: OPTIONAL - remove if needed');
  instructions.push('- Any other sections: REMOVE if needed');
  
  instructions.push('\nPRIORITY: Fitting on one page is MORE IMPORTANT than having complete content.');
  
  return instructions.join('\n') + '\n\n';
}

export interface LLMGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  retries?: number;
}

export const DEFAULT_LLM_OPTIONS: LLMGenerationOptions = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2000,
  retries: 2
};