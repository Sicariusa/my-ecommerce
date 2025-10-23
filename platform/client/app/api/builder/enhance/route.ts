/**
 * API Route: /api/builder/enhance
 * 
 * Provides AI-powered enhancements to website projects by directly calling
 * Google's Gemini AI without requiring Chef backend.
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project, enhancementPrompt } = body;

    if (!project) {
      return NextResponse.json(
        { error: 'Project data is required' },
        { status: 400 }
      );
    }

    if (!enhancementPrompt || enhancementPrompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Enhancement prompt is required' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'AI service not configured. Please add GOOGLE_API_KEY to your .env.local file.' 
        },
        { status: 500 }
      );
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    // Construct the prompt with context about the builder
    const systemPrompt = `You are a website builder enhancement assistant. You receive a project JSON structure and modification requests.

The project structure is:
{
  "id": "project-id",
  "name": "Project Name",
  "pages": [
    {
      "id": "page-id",
      "name": "Page Name",
      "slug": "/page-slug",
      "tree": [
        {
          "id": "component-id",
          "type": "ComponentType",
          "props": {},
          "styles": {},
          "metadata": {},
          "children": []
        }
      ],
      "metadata": {}
    }
  ],
  "metadata": {}
}

Available component types:
- Body: Root container (required, must be first)
- Section: Semantic section container
- Div: Generic container
- Text: Text content (props: text, tag)
- Image: Image (props: src, alt)
- Button: Button (props: text, link, target)
- Container: Flexbox container
- Grid: CSS Grid layout
- List: Lists (props: items, ordered)
- Link: Anchor (props: href, text, target)
- Form: Form with fields

Your task:
1. Analyze the current project structure
2. Apply the requested enhancements
3. Return ONLY the complete enhanced project JSON
4. Maintain all existing component IDs unless creating new ones
5. Use format: {type.toLowerCase()}-{timestamp}-{random} for new IDs
6. Preserve the exact JSON structure

CRITICAL: Return ONLY valid JSON. No explanations, no markdown, no code blocks.`;

    const userMessage = `${systemPrompt}

Current project:
${JSON.stringify(project, null, 2)}

Enhancement request:
${enhancementPrompt}

Return the enhanced project JSON:`;

    console.log('Calling Google Gemini API for project enhancement...');

    // Call Google Gemini API
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const responseText = response.text();

    if (!responseText) {
      throw new Error('No response from AI');
    }

    console.log('Received response from Gemini, parsing...');

    // Parse the enhanced project
    let enhancedProject;
    try {
      // Remove markdown code blocks if present
      let cleanedContent = responseText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      
      // Try to find JSON object in the response
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedContent = jsonMatch[0];
      }
      
      enhancedProject = JSON.parse(cleanedContent);

      // Validate structure
      if (!enhancedProject.id || !enhancedProject.pages || !Array.isArray(enhancedProject.pages)) {
        throw new Error('Invalid project structure in AI response');
      }

      console.log('Successfully parsed enhanced project');

    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Response text:', responseText.substring(0, 500));
      return NextResponse.json(
        { 
          error: 'Failed to parse AI response. The AI may have returned invalid JSON.',
          details: parseError instanceof Error ? parseError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      project: enhancedProject,
    });

  } catch (error: any) {
    console.error('Builder enhancement error:', error);
    
    // Handle Google API errors
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your GOOGLE_API_KEY in .env.local' },
        { status: 500 }
      );
    }
    
    if (error.status === 429 || error.message?.includes('quota')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
