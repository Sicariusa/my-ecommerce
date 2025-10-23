/**
 * EnhanceWithAI Component
 * 
 * UI component for AI-powered website enhancement.
 * Allows users to enter enhancement prompts and receive AI-improved projects.
 */

'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface EnhanceWithAIProps {
  project: any;
  onProjectEnhanced?: (enhancedProject: any) => void;
  onClose?: () => void;
  customSuggestions?: string[];
}

export function EnhanceWithAI({ project, onProjectEnhanced, onClose, customSuggestions }: EnhanceWithAIProps) {
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const examplePrompts = customSuggestions || [
    'Add a contact form section with name, email, and message fields',
    'Make the design more modern with better spacing and colors',
    'Add a features section with 3 columns showcasing key benefits',
    'Improve the hero section with a better call-to-action',
    'Add a testimonials section with customer reviews',
    'Create a pricing section with 3 tiers',
  ];

  const handleEnhance = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter an enhancement request');
      return;
    }

    if (!project) {
      toast.error('No project to enhance');
      return;
    }

    setIsEnhancing(true);
    const loadingToast = toast.loading('AI is enhancing your project...');

    try {
      const response = await fetch('/api/builder/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project,
          enhancementPrompt: prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Enhancement failed');
      }

      toast.success('Project enhanced successfully!', { id: loadingToast });
      
      if (onProjectEnhanced && data.project) {
        onProjectEnhanced(data.project);
      }

      // Clear the prompt and close
      setPrompt('');
      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error('Enhancement error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to enhance project',
        { id: loadingToast }
      );
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="space-y-4">
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
          rows={3}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          disabled={isEnhancing}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Be specific about what you want to add or change. The AI will modify your project while preserving the existing structure.
        </p>
      </div>

      {/* Example Prompts */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Try these examples:
        </p>
        <div className="grid grid-cols-1 gap-1">
          {examplePrompts.slice(0, 3).map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={isEnhancing}
              className="text-left px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleEnhance}
        disabled={isEnhancing || !prompt.trim()}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {isEnhancing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Enhancing...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Enhance Component</span>
          </>
        )}
      </button>
    </div>
  );
}
