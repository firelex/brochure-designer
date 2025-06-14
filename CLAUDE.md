# Claude Code Context - Brochure Design App

## Project Overview

This is a **clean, focused Next.js application** for generating business report brochures with PDF export functionality. The app was recently cleaned up to remove unused code and focus solely on the ui-brochure functionality.

## Key Architecture Decisions

### PDF Generation Strategy
- **Method Used**: URL-based PDF generation with Puppeteer
- **Why**: Ensures perfect CSS rendering and style preservation
- **Process**: 
  1. Dedicated print route (`/print/ui-brochure`) serves clean brochure
  2. Puppeteer visits this route server-side
  3. Generates PDF with exact visual fidelity

### Removed/Cleaned Up
- ❌ Old HTML-based PDF export (`/api/export-pdf`)
- ❌ JPM references throughout codebase
- ❌ Unused brochure components (BrochureElements, BrochureTemplate, TestBrochure)
- ❌ captureStyles utility (no longer needed)
- ❌ brochure-demo route
- ✅ Kept only: `/ui-brochure` route with URL-based PDF export

## Important File Structure

```
Key Files:
├── src/app/ui-brochure/page.tsx          # Main brochure interface
├── src/app/ui-brochure/ExportButton.tsx  # PDF export component  
├── src/app/print/ui-brochure/page.tsx    # Print-optimized page
├── src/app/api/export-pdf-url/route.ts   # PDF generation API
├── src/components/brochure/UIBasedA4.tsx # Main brochure content
├── src/components/brochure/A4Page.tsx    # A4 container component
└── src/lib/pdf.ts                        # PDF utilities (URL-based only)
```

## Critical CSS/Layout Notes

### Margin Alignment Issue (SOLVED)
- **Problem**: PDF margins didn't match browser preview
- **Root Cause**: Multiple conflicting margin systems
- **Solution**: 
  - PDF margins set to `0mm` (let A4Page handle spacing)
  - A4Page uses `margins="normal"` = `p-12` (48px internal padding)
  - Removed conflicting `print:p-0` styles
- **Result**: Perfect alignment between preview and PDF

### Page Overflow Fix (SOLVED)
- **Problem**: Content overflowing to second page in PDF
- **Root Cause**: Page number and footer too close to bottom edge
- **Solution**:
  - Page number: `bottom-4` → `bottom-12` (48px from bottom)
  - Footer: `mt-8` → `mt-4` (reduced top margin)
- **Result**: Single-page layout as intended

## Development Commands

```bash
# Development
npm run dev

# Production build (fixed TypeScript errors)
npm run build
npm start

# Key URLs
http://localhost:3000                    # Home (redirects to ui-brochure)
http://localhost:3000/ui-brochure       # Main interface
http://localhost:3000/print/ui-brochure # Print-optimized page
```

## Common Tasks

### Adding New Content to Brochure
- Edit: `src/components/brochure/UIBasedA4.tsx`
- Components available: MetricCard, Timeline, Card, Badge, Avatar
- Uses A4Page wrapper with proper margins

### Modifying PDF Export
- Export logic: `src/app/ui-brochure/ExportButton.tsx`
- PDF generation: `src/lib/pdf.ts` (PDFExporter.generateFromUrl)
- Print page: `src/app/print/ui-brochure/page.tsx`

### Styling Changes
- Global styles: `src/app/globals.css`
- Print-specific: Add to print page's `<style jsx global>`
- Components: Individual component files with Tailwind

## Puppeteer Configuration

### Current Settings (Working)
```typescript
viewport: { width: 794, height: 1123, deviceScaleFactor: 2 }
margins: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
printBackground: true
waitUntil: 'networkidle0'
```

### Dev Environment Handling
- Automatically hides React Fast Refresh lightning icon
- Removes development overlays before PDF generation
- Uses production build for final testing

## TypeScript Notes

### Fixed Issues
- Error handling: Use `error instanceof Error ? error.message : 'Unknown error'`
- Badge component: Removed 'jpmClassification' variant
- querySelector casting: `element as HTMLLinkElement`

## Testing Strategy

1. **Development**: Test in dev mode (npm run dev)
2. **Production**: Build and test (npm run build && npm start)
3. **PDF Quality**: Always test PDF output matches browser preview exactly

## Future Considerations

- All JPM/client-specific references removed
- App is now generic and reusable
- Clean component architecture allows easy customization
- Single PDF export method reduces complexity
- Perfect margin alignment system in place

## Troubleshooting

### PDF Generation Fails
1. Check if print route loads: `http://localhost:3000/print/ui-brochure`
2. Verify API endpoint: `POST /api/export-pdf-url`
3. Check browser console for errors

### Styling Issues in PDF
1. Verify styles load in print route
2. Check for React dev overlays interfering
3. Test in production build (no dev tools)

### Page Overflow
1. Check bottom margins on A4Page content
2. Verify footer and page number positioning
3. Ensure content fits within A4 dimensions (794×1123px)