// Status types for the application
export type Status = 
  | 'waiting'
  | 'pending' 
  | 'approved'
  | 'rejected'
  | 'success'
  | 'intake'
  | 'legal-review'
  | 'tax-review'
  | 'business-review'
  | 'scheduled'
  | 'submitted';

// Brochure types
export interface BrochureSection {
  id: string;
  type: 'hero' | 'content' | 'features' | 'testimonials' | 'contact' | 'custom';
  title?: string;
  content?: React.ReactNode;
  background?: string;
  fullWidth?: boolean;
}

export interface PDFExportOptions {
  format?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  scale?: number;
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
  printBackground?: boolean;
  filename?: string;
}