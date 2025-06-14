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

    // Validate layout constraints using estimation (server-side)
    const layoutValidation = validateBrochureLayout(brochureContent);

    console.log('\n=== LAYOUT VALIDATION ===');
    console.log('Validation result:', layoutValidation);
    console.log('Overflow:', layoutValidation.overflow);
    console.log('Is valid:', layoutValidation.isValid);
    console.log('Will optimize:', layoutValidation.overflow > 50 && !validation);
    console.log('=========================\n');

    // If there's significant overflow and this is not a retry, attempt multiple optimizations
    if (layoutValidation.overflow > 50 && !validation) {
      let currentContent = brochureContent;
      let currentValidation = layoutValidation;
      let attempts = 0;
      const maxAttempts = 3;

      console.log(`\n=== AUTO-OPTIMIZING (UP TO ${maxAttempts} ATTEMPTS) ===`);
      console.log(`Initial overflow: ${currentValidation.overflow}px`);
      console.log('===============================================\n');

      while (attempts < maxAttempts && currentValidation.overflow > 20) {
        attempts++;
        console.log(`\n--- ATTEMPT ${attempts}/${maxAttempts} ---`);
        console.log(`Current overflow: ${currentValidation.overflow}px`);

        // Create optimized context with validation feedback
        const optimizedContext: GenerationContext = {
          description,
          settings: brochureSettings,
          validation: {
            previousAttempt: currentContent,
            overflow: currentValidation.overflow,
            suggestions: currentValidation.suggestions
          }
        };

        const optimizedPrompt = createBrochurePrompt(optimizedContext);
        
        console.log(`\n=== OPTIMIZATION PROMPT (Attempt ${attempts}) ===`);
        console.log(optimizedPrompt);
        console.log('============================================\n');

        // Try generating optimized content
        try {
          const optimizedResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.ANTHROPIC_API_KEY!,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-3-5-sonnet-20241022',
              max_tokens: DEFAULT_LLM_OPTIONS.maxTokens,
              temperature: Math.max(0.3, 0.7 - (attempts * 0.2)), // Lower temperature with each attempt
              messages: [
                {
                  role: 'user',
                  content: `You are a professional brochure designer. Generate only valid JSON objects for brochure content. Do not include any markdown formatting or additional text.\n\n${optimizedPrompt}`
                }
              ]
            })
          });

          if (optimizedResponse.ok) {
            const optimizedData = await optimizedResponse.json();
            const optimizedContent = optimizedData.content[0].text.trim()
              .replace(/```json\n?/g, '')
              .replace(/```\n?/g, '')
              .trim();

            console.log(`\n=== OPTIMIZED RESPONSE (Attempt ${attempts}) ===`);
            console.log('Raw response:', optimizedContent);
            console.log('=============================================\n');

            try {
              const optimizedBrochure = JSON.parse(optimizedContent);
              const optimizedValidation = validateBrochureLayout(optimizedBrochure);
              
              console.log(`\n=== ATTEMPT ${attempts} RESULT ===`);
              console.log(`Previous overflow: ${currentValidation.overflow}px`);
              console.log(`New overflow: ${optimizedValidation.overflow}px`);
              console.log(`Improvement: ${currentValidation.overflow - optimizedValidation.overflow}px`);
              console.log('===============================\n');

              // Use optimized version if it's better (or at least not worse)
              if (optimizedValidation.overflow <= currentValidation.overflow) {
                currentContent = optimizedBrochure;
                currentValidation = optimizedValidation;
                
                // If we've achieved good results, break early
                if (optimizedValidation.overflow <= 20) {
                  console.log(`SUCCESS: Overflow reduced to ${optimizedValidation.overflow}px, stopping optimization`);
                  break;
                }
              } else {
                console.log(`No improvement in attempt ${attempts}, continuing...`);
              }
            } catch (parseError) {
              console.log(`Attempt ${attempts} failed to parse, continuing...`);
            }
          } else {
            console.log(`Attempt ${attempts} API call failed, continuing...`);
          }
        } catch (optimizationError) {
          console.log(`Attempt ${attempts} error:`, optimizationError);
        }
      }

      console.log(`\n=== FINAL OPTIMIZATION SUMMARY ===`);
      console.log(`Original overflow: ${layoutValidation.overflow}px`);
      console.log(`Final overflow: ${currentValidation.overflow}px`);
      console.log(`Total improvement: ${layoutValidation.overflow - currentValidation.overflow}px`);
      console.log(`Attempts used: ${attempts}/${maxAttempts}`);
      console.log('===================================\n');

      // Return the best version we achieved
      if (currentValidation.overflow < layoutValidation.overflow) {
        return NextResponse.json({ 
          content: currentContent,
          validation: currentValidation,
          optimized: true,
          attempts: attempts
        });
      }
    }

    return NextResponse.json({ 
      content: brochureContent,
      validation: layoutValidation,
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