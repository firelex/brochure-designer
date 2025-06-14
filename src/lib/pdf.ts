import puppeteer, { Browser, Page } from 'puppeteer';

interface PDFExportOptions {
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

export class PDFExporter {
  private browser: Browser | null = null;

  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }


  async generateFromUrl(url: string, options: PDFExportOptions & { waitForSelector?: string } = {}): Promise<Buffer> {
    await this.initialize();
    
    if (!this.browser) {
      throw new Error('Failed to initialize browser');
    }

    const page = await this.browser.newPage();
    
    try {
      // Set viewport for consistent rendering
      await page.setViewport({ 
        width: options.orientation === 'landscape' ? 1123 : 794,
        height: options.orientation === 'landscape' ? 794 : 1123,
        deviceScaleFactor: 2 // Higher quality
      });
      
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      // Wait for specific selector if provided
      if (options.waitForSelector) {
        await page.waitForSelector(options.waitForSelector, { timeout: 10000 });
      }
      
      // Hide React dev tools and overlays with JavaScript
      await page.evaluate(() => {
        // Remove any fixed positioned elements that might be dev tools
        const fixedElements = document.querySelectorAll('*');
        fixedElements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' && 
              (el.innerHTML.includes('⚡') || 
               el.innerHTML.includes('lightning') ||
               el.getAttribute('data-nextjs') ||
               el.className.includes('__next') ||
               el.id.includes('__next'))) {
            el.remove();
          }
        });
      });
      
      await page.addStyleTag({
        content: `
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
          
          /* Hide any remaining development indicators */
          [style*="position: fixed"],
          [data-nextjs-toast],
          #__next-build-watcher,
          .__next-dev-overlay,
          [id*="__next"],
          [class*="__next"] {
            display: none !important;
          }
        `
      });
      
      // Wait a bit more for styles to apply
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        landscape: options.orientation === 'landscape',
        margin: options.margins || {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm'
        },
        scale: options.scale || 1,
        displayHeaderFooter: options.displayHeaderFooter || false,
        headerTemplate: options.headerTemplate || '',
        footerTemplate: options.footerTemplate || '',
        printBackground: options.printBackground !== false
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await page.close();
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

