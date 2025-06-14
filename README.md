# Brochure Design App

A Next.js application for generating professional business report brochures with high-quality PDF export functionality.

## Features

- **Professional A4 Report Layout**: Clean, business-ready report design with metrics, timelines, and team information
- **High-Quality PDF Export**: Server-side PDF generation using Puppeteer with perfect styling preservation
- **Responsive Design**: Optimized for both screen display and print output
- **Component-Based Architecture**: Reusable UI components built with TypeScript and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Generation**: Puppeteer
- **UI Components**: Custom component library with shadcn/ui patterns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd brochure-design
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/export-pdf-url/     # PDF export API endpoint
│   ├── print/ui-brochure/      # Print-optimized page for PDF generation
│   ├── ui-brochure/            # Main brochure interface
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page (redirects to ui-brochure)
├── components/
│   ├── brochure/
│   │   ├── A4Page.tsx          # A4 page container component
│   │   └── UIBasedA4.tsx       # Main brochure content component
│   └── ui/                     # Reusable UI components
├── lib/
│   └── pdf.ts                  # PDF generation utilities
└── types/                      # TypeScript type definitions
```

## Usage

### Viewing the Brochure

1. Navigate to the application (automatically redirects to `/ui-brochure`)
2. View the live preview of the business report
3. The preview shows exactly how the PDF will look

### Exporting to PDF

1. Click the "Export as PDF" button
2. The system will:
   - Open a print-optimized version of the page
   - Use Puppeteer to generate a high-quality PDF
   - Automatically download the PDF file
3. The exported PDF maintains perfect styling and layout

## Technical Details

### PDF Generation Process

1. **Print Route**: A dedicated `/print/ui-brochure` route serves a clean version of the brochure
2. **Server-Side Rendering**: Puppeteer visits this route server-side
3. **Style Preservation**: All CSS is fully loaded and rendered
4. **PDF Generation**: High-quality PDF with exact visual fidelity

### A4 Page Component

The `A4Page` component provides:
- Exact A4 dimensions (794px × 1123px at 96 DPI)
- Configurable margins and orientation
- Print-optimized styling
- Page numbering support

### UI Components

All components are built with:
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design principles
- Print-friendly color schemes

## Customization

### Modifying the Brochure Content

Edit `src/components/brochure/UIBasedA4.tsx` to customize:
- Metrics and KPIs
- Timeline information
- Team member details
- Company branding

### Styling Changes

- Global styles: `src/app/globals.css`
- Component styles: Individual component files
- Print styles: Included in A4Page component

### PDF Export Options

Modify `src/app/ui-brochure/ExportButton.tsx` to adjust:
- Page margins
- Paper format (A4, Letter, Legal)
- Orientation (portrait/landscape)
- File naming

## API Endpoints

### POST /api/export-pdf-url

Generates PDF from a URL using Puppeteer.

**Request Body:**
```json
{
  "url": "http://localhost:3000/print/ui-brochure",
  "options": {
    "format": "A4",
    "orientation": "portrait",
    "printBackground": true,
    "filename": "report.pdf",
    "margins": {
      "top": "0mm",
      "right": "0mm", 
      "bottom": "0mm",
      "left": "0mm"
    }
  }
}
```

**Response:** PDF file download

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.