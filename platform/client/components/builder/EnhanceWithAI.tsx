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
  onProjectEnhanced?: (enhancedProject: any) => void;
  onClose?: () => void;
}

export function EnhanceWithAI({ project, onProjectEnhanced, onClose }: EnhanceWithAIProps) {
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const examplePrompts = [
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Enhance with AI
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Describe how you'd like to improve your website
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

        {/* Example Prompts */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Try these examples:
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
                <span>Enhance Project</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
