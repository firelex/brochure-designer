import { NextRequest, NextResponse } from 'next/server';
import { PDFExporter } from '@/lib/pdf';

export async function POST(request: NextRequest) {
  const exporter = new PDFExporter();
  
  try {
    const { url, options } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Generate PDF from URL - this will capture all styles
    const pdfBuffer = await exporter.generateFromUrl(url, {
      ...options,
      printBackground: true,
    });

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${options?.filename || 'brochure.pdf'}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  } finally {
    await exporter.close();
  }
}