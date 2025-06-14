'use client';

import React from 'react';
import A4Page from './A4Page';
import { 
  MetricCard,
  Hero,
  FeatureGrid,
  ImageBlock,
  Testimonial,
  ContactBlock,
  PricingTable,
  Timeline,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  Badge
} from '@/components/ui';
import { getIcon } from '@/components/ui/IconMap';
import { BrochureContent, BrochureSection } from '@/types/brochure';
import { A4_CONSTRAINTS } from '@/lib/brochure-layout';
import { cn } from '@/lib/utils';

interface BrochureRendererProps {
  content: BrochureContent;
  className?: string;
}

export const BrochureRenderer: React.FC<BrochureRendererProps> = ({
  content,
  className
}) => {
  const { settings } = content;
  
  // Helper function to map button variants for brochures
  const mapButtonVariant = (variant?: string) => {
    // Map website-style variants to brochure-appropriate ones
    if (variant === 'outline' || variant === 'default') return 'secondary';
    if (variant === 'approve' || variant === 'danger') return 'primary';
    return variant as 'primary' | 'secondary' | 'ghost' | undefined;
  };
  
  // Theme-based styling
  const themeClasses = settings.theme === 'dark' 
    ? 'bg-slate-900 text-white' 
    : 'bg-white text-gray-900';
  
  // Font size mapping
  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base', 
    large: 'text-lg'
  };
  
  // Layout density spacing
  const densitySpacing = {
    compact: 'space-y-4',
    normal: 'space-y-6',
    spacious: 'space-y-8'
  };

  // Color scheme mapping (for accents)
  const colorSchemes = {
    blue: 'accent-blue',
    green: 'accent-green', 
    purple: 'accent-purple',
    orange: 'accent-orange'
  };

  const renderSection = (section: BrochureSection, index: number) => {
    const key = `section-${index}`;
    
    switch (section.type) {
      case 'hero':
        return (
          <Hero
            key={key}
            title={section.title}
            subtitle={section.subtitle}
            description={section.description}
            backgroundImage={section.backgroundImage}
            textColor={settings.theme === 'dark' ? 'light' : 'dark'}
            ctaButton={section.ctaButton ? {
              ...section.ctaButton,
              variant: mapButtonVariant(section.ctaButton.variant)
            } : undefined}
            className="mb-6"
          />
        );

      case 'metrics':
        return (
          <div key={key} className="mb-6">
            {section.title && (
              <h2 className="text-2xl font-bold text-center mb-6">
                {section.title}
              </h2>
            )}
            <div className="grid grid-cols-3 gap-4">
              {section.metrics.map((metric, idx) => (
                <MetricCard
                  key={idx}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change && metric.change.type !== 'neutral' ? { value: metric.change.value, type: metric.change.type as 'increase' | 'decrease' } : undefined}
                  icon={metric.icon ? getIcon(metric.icon) : undefined}
                />
              ))}
            </div>
          </div>
        );

      case 'features':
        return (
          <FeatureGrid
            key={key}
            title={section.title}
            description={section.description}
            columns={section.columns}
            features={section.features.map(feature => ({
              ...feature,
              icon: feature.icon ? getIcon(feature.icon) : undefined,
              iconColor: settings.theme === 'dark' 
                ? 'bg-slate-700 text-slate-300' 
                : 'bg-blue-100 text-blue-600'
            }))}
            className="mb-6"
          />
        );

      case 'image':
        return (
          <ImageBlock
            key={key}
            src={section.src}
            alt={section.alt}
            caption={section.caption}
            layout={section.layout}
            title={section.title}
            description={section.description}
            className="mb-6"
          />
        );

      case 'testimonial':
        return (
          <Testimonial
            key={key}
            quote={section.quote}
            author={section.author}
            rating={section.rating}
            layout={section.layout}
            className="mb-6"
          />
        );

      case 'timeline':
        return (
          <div key={key} className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>{section.title || 'Timeline'}</CardTitle>
                {section.description && (
                  <p className="text-gray-600">{section.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <Timeline 
                  steps={section.steps} 
                  orientation="vertical" 
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'team':
        return (
          <div key={key} className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>{section.title || 'Our Team'}</CardTitle>
                {section.description && (
                  <p className="text-gray-600">{section.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.members.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Avatar name={member.name} />
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                      {member.status && (
                        <Badge variant={
                          member.status === 'active' ? 'success' :
                          member.status === 'away' ? 'waiting' : 'default'
                        }>
                          {member.status}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'contact':
        return (
          <ContactBlock
            key={key}
            title={section.title}
            description={section.description}
            contactInfo={section.contactInfo}
            socialLinks={section.socialLinks}
            ctaButton={section.ctaButton ? {
              ...section.ctaButton,
              variant: mapButtonVariant(section.ctaButton.variant)
            } : undefined}
            backgroundColor={settings.theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}
            className="mb-6"
          />
        );

      case 'pricing':
        return (
          <PricingTable
            key={key}
            title={section.title}
            description={section.description}
            tiers={section.tiers.map(tier => ({
              ...tier,
              ctaButton: tier.ctaButton ? {
                ...tier.ctaButton,
                variant: mapButtonVariant(tier.ctaButton.variant)
              } : undefined
            }))}
            className="mb-6"
          />
        );

      case 'text':
        return (
          <div key={key} className="mb-6">
            {section.title && (
              <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            )}
            <div className={cn(
              'prose max-w-none',
              section.layout === 'two-column' && 'columns-2 gap-8'
            )}>
              <p className="leading-relaxed">{section.content}</p>
            </div>
          </div>
        );

      case 'grid':
        return (
          <div key={key} className="mb-6">
            <div className={cn(
              'grid gap-6',
              section.columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
            )}>
              {section.items.map((item, idx) => (
                <Card key={idx}>
                  {item.image && (
                    <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <A4Page 
      orientation="portrait" 
      margins="normal" 
      background="white"
      showPageNumber={true}
      pageNumber={1}
      className={cn(
        'print-colors',
        themeClasses,
        fontSizeClasses[settings.fontSize],
        colorSchemes[settings.colorScheme],
        className
      )}
    >
      {/* Dark theme specific styles */}
      {settings.theme === 'dark' && (
        <style jsx>{`
          .print-colors {
            background: #1e293b !important;
            color: white !important;
          }
          .print-colors .bg-white {
            background: #334155 !important;
          }
          .print-colors .text-gray-900 {
            color: white !important;
          }
          .print-colors .text-gray-600 {
            color: #cbd5e1 !important;
          }
          .print-colors .border-gray-200 {
            border-color: #475569 !important;
          }
        `}</style>
      )}

      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
          <p className={cn(
            'text-lg',
            settings.theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
          )}>
            {content.description}
          </p>
        </div>

        {/* Main content area */}
        <div 
          className={cn('flex flex-col', densitySpacing[settings.layoutDensity])}
        >
          {/* Render all sections */}
          {content.sections.map((section, index) => renderSection(section, index))}
        </div>

        {/* Footer */}
        <div className={cn(
          'mt-auto pt-4 border-t text-center',
          settings.theme === 'dark' ? 'border-slate-600 text-slate-400' : 'border-gray-200 text-gray-500'
        )}>
          <p className="text-sm">
            Generated on {new Date().toLocaleDateString()} | {content.title}
          </p>
        </div>
      </div>
    </A4Page>
  );
};

export default BrochureRenderer;