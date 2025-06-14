import { NextRequest, NextResponse } from 'next/server';
import { BrochureContent } from '@/types/brochure';
import { createBrochurePrompt, DEFAULT_LLM_OPTIONS, GenerationContext } from '@/lib/llm-prompts';
import { validateBrochureLayout } from '@/lib/brochure-layout';

export async function POST(request: NextRequest) {
  try {
    const { description, settings, validation } = await request.json();

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    // Default settings if not provided
    const brochureSettings = {
      pageCount: 1,
      theme: 'light',
      fontSize: 'medium',
      colorScheme: 'blue',
      layoutDensity: 'normal',
      ...settings
    };

    // Create generation context with validation feedback
    const context: GenerationContext = {
      description,
      settings: brochureSettings,
      validation
    };

    const prompt = createBrochurePrompt(context);

    // Log the prompt for debugging
    console.log('\n=== LLM PROMPT ===');
    console.log(prompt);
    console.log('==================\n');

    // Make API call to Claude Sonnet
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
        temperature: DEFAULT_LLM_OPTIONS.temperature,
        messages: [
          {
            role: 'user',
            content: `You are a professional brochure designer. Generate only valid JSON objects for brochure content. Do not include any markdown formatting or additional text.\n\n${prompt}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.content[0].text.trim();

    // Log the LLM response for debugging
    console.log('\n=== LLM RESPONSE ===');
    console.log('Raw response:', generatedContent);
    console.log('====================\n');

    // Clean up the response in case it has markdown formatting
    const jsonContent = generatedContent
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Parse and validate the JSON
    let brochureContent: BrochureContent;
    try {
      brochureContent = JSON.parse(jsonContent);
      console.log('\n=== PARSED JSON ===');
      console.log(JSON.stringify(brochureContent, null, 2));
      console.log('===================\n');
    } catch (parseError) {
      console.error('Failed to parse LLM response:', generatedContent);
      console.error('Parse error:', parseError);
      throw new Error('Invalid JSON response from LLM');
    }

    // Validate required fields
    if (!brochureContent.title || !brochureContent.sections || !Array.isArray(brochureContent.sections)) {
      throw new Error('Invalid brochure structure generated');
    }

    // Skip server-side validation - it's inaccurate
    // Real validation happens on the frontend with actual DOM measurements
    console.log('\n=== SKIPPING SERVER VALIDATION ===');
    console.log('Server estimation is inaccurate - frontend will handle real measurement');
    console.log('=====================================\n');

    return NextResponse.json({ 
      content: brochureContent,
      validation: null, // Frontend will measure
      optimized: false
    });

  } catch (error) {
    console.error('Error generating brochure:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate brochure', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}