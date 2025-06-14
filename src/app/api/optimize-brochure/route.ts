import { NextRequest, NextResponse } from 'next/server';
import { BrochureContent } from '@/types/brochure';
import { createBrochurePrompt, DEFAULT_LLM_OPTIONS, GenerationContext } from '@/lib/llm-prompts';

export async function POST(request: NextRequest) {
  try {
    const { content, realMeasurement } = await request.json();

    if (!content || !realMeasurement) {
      return NextResponse.json({ error: 'Content and real measurement data required' }, { status: 400 });
    }

    console.log(`\n=== CLIENT-SIDE OPTIMIZATION ===`);
    console.log(`Real DOM overflow: ${realMeasurement.overflow}px`);
    console.log(`Total height: ${realMeasurement.totalHeight}px`);
    console.log(`Available: ${realMeasurement.availableHeight}px`);
    console.log('=================================\n');

    // Create optimized context with real measurement feedback
    const optimizedContext: GenerationContext = {
      description: `Optimize this brochure content: ${content.title} - ${content.description}`,
      settings: content.settings,
      validation: {
        previousAttempt: content,
        overflow: realMeasurement.overflow,
        totalHeight: realMeasurement.totalHeight,
        availableHeight: realMeasurement.availableHeight,
        isValid: realMeasurement.isValid,
        suggestions: realMeasurement.suggestions || [
          `Content overflows by ${realMeasurement.overflow}px`,
          'Reduce content length significantly',
          'Use more compact descriptions',
          'Consider fewer sections'
        ]
      },
      existingContent: content,
      isOptimization: true
    };

    const optimizedPrompt = createBrochurePrompt(optimizedContext);
    
    console.log('\n=== OPTIMIZATION PROMPT ===');
    console.log(optimizedPrompt);
    console.log('===========================\n');

    // Generate optimized content
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: DEFAULT_LLM_OPTIONS.maxTokens,
        temperature: 0.3, // Lower temperature for focused optimization
        messages: [
          {
            role: 'user',
            content: `You are a professional brochure designer. Generate only valid JSON objects for brochure content. Do not include any markdown formatting or additional text.\n\n${optimizedPrompt}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.content[0].text.trim();

    console.log('\n=== OPTIMIZED RESPONSE ===');
    console.log('Raw response:', generatedContent);
    console.log('===========================\n');

    // Clean up and parse the response
    const jsonContent = generatedContent
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    let optimizedBrochure: BrochureContent;
    try {
      optimizedBrochure = JSON.parse(jsonContent);
      console.log('\n=== OPTIMIZED PARSED JSON ===');
      console.log(JSON.stringify(optimizedBrochure, null, 2));
      console.log('==============================\n');
    } catch (parseError) {
      console.error('Failed to parse optimized response:', generatedContent);
      throw new Error('Invalid JSON response from optimization');
    }

    return NextResponse.json({ 
      content: optimizedBrochure,
      originalOverflow: realMeasurement.overflow
    });

  } catch (error) {
    console.error('Error optimizing brochure:', error);
    return NextResponse.json(
      { 
        error: 'Failed to optimize brochure', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}