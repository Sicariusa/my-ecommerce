/**
 * API Route: /api/builder/enhance
 * 
 * Integrates the website builder with the Chef agent to provide AI-powered
 * enhancements to website projects. Accepts project JSON and enhancement
 * prompts, forwards them to the Chef agent, and returns enhanced projects.
 */

import { NextRequest, NextResponse } from 'next/server';

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

    // Construct the prompt for the Chef agent
    const systemPrompt = `You are enhancing an existing website builder project. The user will provide:
1. A project JSON structure containing pages, components, and styling
2. An enhancement request

Your task is to:
- Understand the current project structure
- Apply the requested enhancements while maintaining JSON structure integrity
- Return ONLY the enhanced project JSON, nothing else
- Preserve all existing IDs unless creating new components
- Maintain the project structure format exactly

Important: Return ONLY valid JSON. Do not include any explanatory text, markdown formatting, or code blocks.`;

    const userPrompt = `Current Project:
${JSON.stringify(project, null, 2)}

Enhancement Request:
${enhancementPrompt}

Please return the enhanced project JSON.`;

    // Call the Chef agent API
    const chefApiUrl = process.env.NEXT_PUBLIC_CHEF_API_URL || 'http://localhost:5173/api/chat';
    
    const chefResponse = await fetch(chefApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!chefResponse.ok) {
      const errorText = await chefResponse.text();
      console.error('Chef agent error:', errorText);
      return NextResponse.json(
        { error: 'AI enhancement failed. Please try again.' },
        { status: 500 }
      );
    }

    const chefData = await chefResponse.json();
    
    // Extract the enhanced project from the response
    let enhancedProject;
    try {
      // The Chef agent might return the JSON directly or wrapped in a response
      const content = chefData.content || chefData.message?.content || chefData;
      
      // Try to parse as JSON if it's a string
      if (typeof content === 'string') {
        // Remove markdown code blocks if present
        const cleanedContent = content
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        enhancedProject = JSON.parse(cleanedContent);
      } else {
        enhancedProject = content;
      }

      // Validate that the enhanced project has the required structure
      if (!enhancedProject.id || !enhancedProject.pages || !Array.isArray(enhancedProject.pages)) {
        throw new Error('Invalid project structure in response');
      }

    } catch (parseError) {
      console.error('Failed to parse enhanced project:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse AI response. The enhancement may be too complex.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      project: enhancedProject,
    });

  } catch (error) {
    console.error('Builder enhancement error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
