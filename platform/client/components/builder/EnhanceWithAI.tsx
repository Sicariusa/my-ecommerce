/**
 * EnhanceWithAI Component
 * 
 * UI component for AI-powered website enhancement.
 * Allows users to enter enhancement prompts and receive AI-improved projects.
 */

'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface EnhanceWithAIProps {
  project: any;
  componentId?: string;
  componentType?: string;
  onProjectEnhanced?: (enhancedProject: any) => void;
  onClose?: () => void;
}

// Component-specific enhancement suggestions
const getComponentSuggestions = (componentType?: string): string[] => {
  const suggestions: Record<string, string[]> = {
    Section: [
      'Add a gradient background with subtle animation',
      'Improve spacing and add a subtle border',
      'Make it full-width with better padding',
      'Add a decorative element or icon',
    ],
    Container: [
      'Convert to a card layout with shadow',
      'Add responsive flexbox layout',
      'Improve alignment and spacing',
      'Add hover effects for interactivity',
    ],
    Text: [
      'Make the text more prominent with better typography',
      'Add a gradient text effect',
      'Improve readability with better line height and spacing',
      'Add subtle animation on scroll',
    ],
    Image: [
      'Add a border radius and shadow effect',
      'Make it responsive with aspect ratio',
      'Add a hover zoom effect',
      'Wrap in a figure with caption',
    ],
    Button: [
      'Add a modern gradient background',
      'Improve hover and active states',
      'Add an icon or emoji to the button',
      'Make it more prominent with better sizing',
    ],
    Grid: [
      'Make it responsive with better breakpoints',
      'Add auto-fit columns for flexibility',
      'Improve gap spacing between items',
      'Add subtle card design to grid items',
    ],
    List: [
      'Add custom icons as bullet points',
      'Improve spacing and typography',
      'Add alternating background colors',
      'Convert to a feature list with descriptions',
    ],
    Form: [
      'Improve input styling and spacing',
      'Add validation indicators',
      'Make it more modern with better layout',
      'Add placeholder text and help messages',
    ],
    Div: [
      'Convert to a card with shadow and border',
      'Add background with padding',
      'Improve layout with flexbox or grid',
      'Add responsive behavior',
    ],
  };

  if (componentType && suggestions[componentType]) {
    return suggestions[componentType];
  }

  // Default suggestions for project-level or unknown types
  return [
    'Add a contact form section with name, email, and message fields',
    'Make the design more modern with better spacing and colors',
    'Add a features section with 3 columns showcasing key benefits',
    'Improve the hero section with a better call-to-action',
    'Add a testimonials section with customer reviews',
    'Create a pricing section with 3 tiers',
  ];
};

export function EnhanceWithAI({ project, componentId, componentType, onProjectEnhanced, onClose }: EnhanceWithAIProps) {
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const isComponentLevel = !!componentId;
  const examplePrompts = getComponentSuggestions(componentType);

  const handleEnhance = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter an enhancement request');
      return;
    }

    if (!project) {
      toast.error('No project to enhance');
      return;
    }

    const startTime = Date.now();
    console.log('🎨 [ENHANCE UI] Starting enhancement request', {
      isComponentLevel,
      componentId,
      componentType,
      promptLength: prompt.length,
      timestamp: new Date().toISOString(),
    });

    setIsEnhancing(true);
    const loadingMessage = isComponentLevel 
      ? `AI is enhancing your ${componentType}...` 
      : 'AI is enhancing your project...';
    const loadingToast = toast.loading(loadingMessage);

    try {
      console.log('📤 [ENHANCE UI] Sending request to API...');
      const response = await fetch('/api/builder/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project,
          enhancementPrompt: prompt,
          componentId: componentId || undefined,
          componentType: componentType || undefined,
        }),
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      console.log('📥 [ENHANCE UI] Received response', {
        ok: response.ok,
        status: response.status,
        duration: duration + 'ms',
        hasProject: !!data.project,
        metadata: data.metadata,
      });

      if (!response.ok) {
        console.error('❌ [ENHANCE UI] Enhancement failed', {
          error: data.error,
          details: data.details,
          status: response.status,
        });
        throw new Error(data.error || 'Enhancement failed');
      }

      const successMessage = isComponentLevel 
        ? `✨ ${componentType} enhanced successfully in ${duration}ms!`
        : `✨ Project enhanced successfully in ${duration}ms!`;
      
      console.log('✅ [ENHANCE UI]', successMessage);
      toast.success(successMessage, { id: loadingToast, duration: 4000 });
      
      if (onProjectEnhanced && data.project) {
        console.log('🔄 [ENHANCE UI] Applying enhanced project to store...');
        onProjectEnhanced(data.project);
      }

      // Clear the prompt and close
      setPrompt('');
      if (onClose) {
        onClose();
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('💥 [ENHANCE UI] Enhancement error after ' + duration + 'ms:', error);
      console.error('🔍 [ENHANCE UI] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      
      toast.error(
        error instanceof Error ? error.message : 'Failed to enhance ' + (isComponentLevel ? 'component' : 'project'),
        { id: loadingToast, duration: 5000 }
      );
    } finally {
      setIsEnhancing(false);
      console.log('🏁 [ENHANCE UI] Enhancement request completed');
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isComponentLevel ? `Enhance ${componentType}` : 'Enhance with AI'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isComponentLevel 
                ? <>Describe how you&apos;d like to improve this {componentType}</>
                : <>Describe how you&apos;d like to improve your website</>
              }
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Prompt Input */}
        <div className="space-y-2">
          <label
            htmlFor="enhancement-prompt"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            What would you like to enhance?
          </label>
          <textarea
            id="enhancement-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Add a contact form, improve the hero section, make it more modern..."
            rows={4}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            disabled={isEnhancing}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Be specific about what you want to add or change. The AI will modify your project while preserving the existing structure.
          </p>
        </div>

        {/* Enhancement Scope Info */}
        {isComponentLevel && (
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <p className="text-sm text-purple-900 dark:text-purple-100">
              <strong>Component Mode:</strong> Only the selected <strong>{componentType}</strong> will be enhanced. Other parts of your project will remain unchanged.
            </p>
          </div>
        )}

        {/* Example Prompts */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isComponentLevel ? `Suggestions for ${componentType}:` : 'Try these examples:'}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                disabled={isEnhancing}
                className="text-left px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        {/* <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                How AI Enhancement Works
              </p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Your current project is sent to our AI along with your request</li>
                <li>• The AI analyzes your design and applies enhancements</li>
                <li>• Your project structure and existing content are preserved</li>
                <li>• You can undo changes if you're not satisfied</li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            disabled={isEnhancing}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleEnhance}
            disabled={isEnhancing || !prompt.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isEnhancing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enhancing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isComponentLevel ? `Enhance ${componentType}` : 'Enhance Project'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
