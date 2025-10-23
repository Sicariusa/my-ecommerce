/**
 * API Route: /api/builder/enhance
 * 
 * Provides AI-powered enhancements to website projects by directly calling
 * Google's Gemini AI without requiring Chef backend.
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('🚀 [ENHANCE API] Request received at', new Date().toISOString());
  
  try {
    const body = await request.json();
    const { project, enhancementPrompt, componentId, componentType } = body;

    console.log('📊 [ENHANCE API] Request details:', {
      hasProject: !!project,
      promptLength: enhancementPrompt?.length || 0,
      componentId: componentId || 'none (full project)',
      componentType: componentType || 'none',
    });

    if (!project) {
      console.error('❌ [ENHANCE API] Missing project data');
      return NextResponse.json(
        { error: 'Project data is required' },
        { status: 400 }
      );
    }

    if (!enhancementPrompt || enhancementPrompt.trim().length === 0) {
      console.error('❌ [ENHANCE API] Missing enhancement prompt');
      return NextResponse.json(
        { error: 'Enhancement prompt is required' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('❌ [ENHANCE API] Missing GOOGLE_API_KEY');
      return NextResponse.json(
        { 
          error: 'AI service not configured. Please add GOOGLE_API_KEY to your .env.local file.' 
        },
        { status: 500 }
      );
    }

    console.log('✅ [ENHANCE API] API key found, initializing Gemini...');

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    // Determine if this is a component-level or project-level enhancement
    const isComponentLevel = !!componentId;
    const enhancementScope = isComponentLevel ? `component (${componentType})` : 'full project';
    console.log(`🎯 [ENHANCE API] Enhancement scope: ${enhancementScope}`);

    // Construct the prompt with context about the builder
    const systemPrompt = isComponentLevel 
      ? `You are a website builder component enhancement assistant. You receive a component JSON structure and modification requests.

The component is of type: ${componentType}

Component structure format:
{
  "id": "component-id",
  "type": "ComponentType",
  "props": {},
  "styles": {},
  "metadata": {},
  "children": []
}`
      : `You are a website builder enhancement assistant. You receive a project JSON structure and modification requests.

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
1. Analyze the current ${isComponentLevel ? 'component' : 'project'} structure
2. Apply the requested enhancements
3. Return ONLY the complete enhanced ${isComponentLevel ? 'component' : 'project'} JSON
4. Maintain all existing component IDs unless creating new ones
5. Use format: {type.toLowerCase()}-{timestamp}-{random} for new IDs
6. Preserve the exact JSON structure
${isComponentLevel ? '7. Only modify the specified component and its children, do not change the component ID' : ''}

CRITICAL: Return ONLY valid JSON. No explanations, no markdown, no code blocks.`;

    // Find the component if this is component-level enhancement
    let targetData = project;
    if (isComponentLevel) {
      const findComponent = (nodes: any[], id: string): any => {
        for (const node of nodes) {
          if (node.id === id) return node;
          if (node.children) {
            const found = findComponent(node.children, id);
            if (found) return found;
          }
        }
        return null;
      };

      let foundComponent = null;
      for (const page of project.pages || []) {
        foundComponent = findComponent(page.tree || [], componentId);
        if (foundComponent) break;
      }

      if (!foundComponent) {
        console.error('❌ [ENHANCE API] Component not found:', componentId);
        return NextResponse.json(
          { error: 'Component not found in project' },
          { status: 404 }
        );
      }

      targetData = foundComponent;
      console.log('🔍 [ENHANCE API] Found component to enhance:', {
        id: targetData.id,
        type: targetData.type,
        hasChildren: !!(targetData.children?.length),
      });
    }

    const userMessage = `${systemPrompt}

Current ${isComponentLevel ? 'component' : 'project'}:
${JSON.stringify(targetData, null, 2)}

Enhancement request:
${enhancementPrompt}

Return the enhanced ${isComponentLevel ? 'component' : 'project'} JSON:`;

    console.log(`🤖 [ENHANCE API] Calling Gemini API for ${enhancementScope} enhancement...`);
    console.log(`📝 [ENHANCE API] Prompt length: ${userMessage.length} characters`);

    // Call Google Gemini API
    const apiCallStart = Date.now();
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const responseText = response.text();
    const apiCallDuration = Date.now() - apiCallStart;

    console.log(`⏱️  [ENHANCE API] API call completed in ${apiCallDuration}ms`);
    console.log(`📄 [ENHANCE API] Response length: ${responseText.length} characters`);

    if (!responseText) {
      console.error('❌ [ENHANCE API] Empty response from AI');
      throw new Error('No response from AI');
    }

    console.log('🔄 [ENHANCE API] Parsing AI response...');

    // Parse the enhanced data
    let enhancedData;
    try {
      // Remove markdown code blocks if present
      let cleanedContent = responseText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      
      console.log('🧹 [ENHANCE API] Cleaned response preview:', cleanedContent.substring(0, 200));
      
      // Try to find JSON object in the response
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedContent = jsonMatch[0];
        console.log('🔍 [ENHANCE API] Extracted JSON from response');
      }
      
      enhancedData = JSON.parse(cleanedContent);

      // Validate structure
      if (isComponentLevel) {
        if (!enhancedData.id || !enhancedData.type) {
          throw new Error('Invalid component structure in AI response');
        }
        console.log('✅ [ENHANCE API] Component validation passed');
        
        // Replace the component in the project
        const replaceComponent = (nodes: any[], id: string, newComponent: any): boolean => {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id) {
              // Preserve the original ID
              newComponent.id = id;
              nodes[i] = newComponent;
              console.log('🔄 [ENHANCE API] Component replaced in tree');
              return true;
            }
            if (nodes[i].children) {
              if (replaceComponent(nodes[i].children, id, newComponent)) {
                return true;
              }
            }
          }
          return false;
        };

        const enhancedProject = { ...project };
        let replaced = false;
        for (const page of enhancedProject.pages || []) {
          if (replaceComponent(page.tree || [], componentId, enhancedData)) {
            replaced = true;
            break;
          }
        }

        if (!replaced) {
          throw new Error('Failed to replace component in project tree');
        }

        enhancedData = enhancedProject;
      } else {
        if (!enhancedData.id || !enhancedData.pages || !Array.isArray(enhancedData.pages)) {
          throw new Error('Invalid project structure in AI response');
        }
        console.log('✅ [ENHANCE API] Project validation passed');
      }

      const totalDuration = Date.now() - startTime;
      console.log(`✨ [ENHANCE API] Enhancement completed successfully in ${totalDuration}ms`);
      console.log(`📊 [ENHANCE API] Enhanced ${isComponentLevel ? 'component' : 'project'}:`, {
        id: enhancedData.id,
        type: enhancedData.type || 'project',
        pagesCount: enhancedData.pages?.length || 0,
      });

    } catch (parseError) {
      console.error('❌ [ENHANCE API] Failed to parse AI response:', parseError);
      console.error('📄 [ENHANCE API] Response preview:', responseText.substring(0, 500));
      return NextResponse.json(
        { 
          error: 'Failed to parse AI response. The AI may have returned invalid JSON.',
          details: parseError instanceof Error ? parseError.message : 'Unknown error',
          responsePreview: responseText.substring(0, 200),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      project: enhancedData,
      metadata: {
        enhancementType: isComponentLevel ? 'component' : 'project',
        componentType: componentType || null,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error: any) {
    const totalDuration = Date.now() - startTime;
    console.error(`💥 [ENHANCE API] Error after ${totalDuration}ms:`, error);
    console.error('🔍 [ENHANCE API] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.substring(0, 500),
    });
    
    // Handle Google API errors
    if (error.message?.includes('API key')) {
      console.error('❌ [ENHANCE API] API key error');
      return NextResponse.json(
        { 
          error: 'Invalid API key. Please check your GOOGLE_API_KEY in .env.local',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
    
    if (error.status === 429 || error.message?.includes('quota')) {
      console.error('❌ [ENHANCE API] Rate limit error');
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again in a moment.',
          timestamp: new Date().toISOString(),
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error.message || 'Unknown error',
        timestamp: new Date().toISOString(),
        duration: totalDuration,
      },
      { status: 500 }
    );
  }
}
