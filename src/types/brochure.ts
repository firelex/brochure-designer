// JSON Schema for Dynamic Brochure Generation

export interface BrochureSettings {
  theme: 'light' | 'dark';
  pageCount: 1 | 2;
  fontSize: 'small' | 'medium' | 'large';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  layoutDensity: 'compact' | 'normal' | 'spacious';
}

export interface BrochureContent {
  title: string;
  description: string;
  settings: BrochureSettings;
  sections: BrochureSection[];
}

export type BrochureSection = 
  | HeroSection
  | MetricsSection
  | FeatureGridSection
  | ImageSection
  | TestimonialSection
  | TimelineSection
  | TeamSection
  | ContactSection
  | PricingSection
  | TextSection
  | GridSection;

// Section Types
export interface HeroSection {
  type: 'hero';
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  ctaButton?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
}

export interface MetricsSection {
  type: 'metrics';
  title?: string;
  metrics: Array<{
    title: string;
    value: string;
    change?: {
      value: number;
      type: 'increase' | 'decrease' | 'neutral';
    };
    icon?: IconType;
  }>;
}

export interface FeatureGridSection {
  type: 'features';
  title?: string;
  description?: string;
  columns?: 2 | 3 | 4;
  features: Array<{
    id: string;
    title: string;
    description: string;
    icon?: IconType;
  }>;
}

export interface ImageSection {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
  layout?: 'full' | 'left' | 'right';
  title?: string;
  description?: string;
}

export interface TestimonialSection {
  type: 'testimonial';
  quote: string;
  author: {
    name: string;
    title?: string;
    company?: string;
  };
  rating?: number;
  layout?: 'card' | 'inline' | 'centered';
}

export interface TimelineSection {
  type: 'timeline';
  title?: string;
  description?: string;
  steps: Array<{
    id: string;
    label: string;
    status: 'completed' | 'current' | 'pending';
    timestamp?: string;
    description?: string;
  }>;
}

export interface TeamSection {
  type: 'team';
  title?: string;
  description?: string;
  members: Array<{
    name: string;
    role: string;
    status?: 'active' | 'away' | 'busy';
  }>;
}

export interface ContactSection {
  type: 'contact';
  title?: string;
  description?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
  };
  socialLinks?: Array<{
    platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'youtube';
    url: string;
  }>;
  ctaButton?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'outline';
  };
}

export interface PricingSection {
  type: 'pricing';
  title?: string;
  description?: string;
  tiers: Array<{
    id: string;
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: Array<{
      text: string;
      included: boolean;
    }>;
    highlighted?: boolean;
    badge?: string;
    ctaButton?: {
      text: string;
      variant?: 'primary' | 'secondary' | 'outline';
    };
  }>;
}

export interface TextSection {
  type: 'text';
  title?: string;
  content: string;
  layout?: 'single' | 'two-column';
}

export interface GridSection {
  type: 'grid';
  columns: 2 | 3;
  items: Array<{
    type: 'card';
    title: string;
    content: string;
    image?: string;
  }>;
}

// Icon type definitions
export type IconType = 'dollar' | 'users' | 'chart' | 'star' | 'check' | 'shield' | 'lightning' | 'heart' | 'globe' | 'cog' | 'arrow-up' | 'arrow-down';