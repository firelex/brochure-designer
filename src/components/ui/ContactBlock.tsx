'use client';

import React from 'react';
import Button from './Button';
import { cn } from '@/lib/utils';

interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
}

interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'youtube';
  url: string;
}

interface ContactBlockProps {
  title?: string;
  description?: string;
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
  ctaButton?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
  layout?: 'card' | 'inline' | 'split';
  backgroundColor?: string;
  className?: string;
}

export const ContactBlock: React.FC<ContactBlockProps> = ({
  title = "Get in Touch",
  description,
  contactInfo,
  socialLinks,
  ctaButton,
  layout = 'card',
  backgroundColor = 'bg-gray-50',
  className
}) => {
  const SocialIcon = ({ platform }: { platform: string }) => {
    const iconClass = "w-5 h-5";
    
    switch (platform) {
      case 'twitter':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      default:
        return <div className={iconClass} />;
    }
  };

  const ContactItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div className="flex items-center space-x-3">
      <div className="text-gray-500">
        {icon}
      </div>
      <span className="text-gray-700">{text}</span>
    </div>
  );

  const content = (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        {description && (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
        )}
      </div>

      {contactInfo && (
        <div className="space-y-4 mb-8">
          {contactInfo.email && (
            <ContactItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              text={contactInfo.email}
            />
          )}
          
          {contactInfo.phone && (
            <ContactItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
              text={contactInfo.phone}
            />
          )}
          
          {contactInfo.address && (
            <ContactItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              text={contactInfo.address}
            />
          )}
          
          {contactInfo.website && (
            <ContactItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              }
              text={contactInfo.website}
            />
          )}
        </div>
      )}

      {socialLinks && socialLinks.length > 0 && (
        <div className="flex justify-center space-x-4 mb-8">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="p-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              <SocialIcon platform={link.platform} />
            </a>
          ))}
        </div>
      )}

      {ctaButton && (
        <div className="text-center">
          <Button variant={ctaButton.variant || 'primary'} size="lg">
            {ctaButton.text}
          </Button>
        </div>
      )}
    </>
  );

  if (layout === 'inline') {
    return (
      <div className={cn('py-8', className)}>
        {content}
      </div>
    );
  }

  return (
    <div className={cn('p-8 rounded-lg', backgroundColor, className)}>
      {content}
    </div>
  );
};

export default ContactBlock;