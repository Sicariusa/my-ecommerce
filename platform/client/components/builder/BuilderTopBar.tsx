/**
 * BuilderTopBar Component
 * 
 * Top navigation bar for the builder with deploy, preview, and save actions.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Save,
    Upload,
    Eye,
    EyeOff,
    Settings,
    ArrowLeft,
    Rocket,
    ExternalLink,
    Undo,
    Redo,
    Download,
    Moon,
    Sun,
    Check,
    AlertCircle,
    Loader2,
    Sparkles,
} from 'lucide-react';
import { useBuilderStore } from '@/lib/stores/useBuilderStore';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { useAutoSave } from '@/lib/hooks/useAutoSave';
import { EnhancedDeploymentModal } from './EnhancedDeploymentModal';
import { EnhanceWithAI } from './EnhanceWithAI';
import toast from 'react-hot-toast';

interface BuilderTopBarProps {
    projectId: string;
    projectName: string;
}

export function BuilderTopBar({ projectId, projectName }: BuilderTopBarProps) {
    const router = useRouter();
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [isEnhanceModalOpen, setIsEnhanceModalOpen] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const project = useBuilderStore((state) => state.project);
    const setProject = useBuilderStore((state) => state.setProject);
    const undo = useBuilderStore((state) => state.undo);
    const redo = useBuilderStore((state) => state.redo);
    const canUndo = useBuilderStore((state) => state.canUndo());
    const canRedo = useBuilderStore((state) => state.canRedo());

    // Theme
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    // Auto-save with visual indicator
    const { saveStatus, lastSaved, triggerSave } = useAutoSave({
        enabled: true,
        interval: 5000, // 5 seconds
        onSave: (success) => {
            if (!success) {
                toast.error('Auto-save failed');
            }
        },
    });

    const handleSave = async () => {
        toast.loading('Saving project...');
        const result = await triggerSave();
        toast.dismiss();

        if (result.success) {
            toast.success('Project saved successfully');
        } else {
            toast.error('Failed to save project');
        }
    };

    const handleDownload = async () => {
        if (!project) {
            toast.error('No project to export');
            return;
        }

        setIsExporting(true);
        toast.loading('Generating project files...');

        try {
            const response = await fetch('/api/projects/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project }),
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            // Download the ZIP file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.dismiss();
            toast.success('Project exported successfully');
        } catch (error) {
            console.error('Export error:', error);
            toast.dismiss();
            toast.error('Failed to export project');
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeploy = () => {
        if (!project || !project.pages || project.pages.length === 0) {
            toast.error('Add at least one page before deploying');
            return;
        }
        setIsDeployModalOpen(true);
    };

    const handlePreviewToggle = () => {
        setIsPreviewMode(!isPreviewMode);
        toast.success(isPreviewMode ? 'Editor mode enabled' : 'Preview mode enabled');
    };

    const handleBack = () => {
        if (confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
            router.push('/dashboard');
        }
    };

    const handleProjectEnhanced = (enhancedProject: any) => {
        setProject(enhancedProject);
        setIsEnhanceModalOpen(false);
        toast.success('Your project has been enhanced!');
    };

    const handleEnhanceClick = () => {
        if (!project || !project.pages || project.pages.length === 0) {
            toast.error('Add at least one page before enhancing');
            return;
        }
        setIsEnhanceModalOpen(true);
    };

    return (
        <>
            <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 z-50">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>

                    <div className="border-l border-gray-300 dark:border-gray-700 h-8" />

                    <div>
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {projectName}
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {project?.pages?.length || 0} page(s)
                        </p>
                    </div>
                </div>

                {/* Center Section - Actions */}
                <div className="flex items-center gap-2">
                    {/* Undo/Redo */}
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={undo}
                            disabled={!canUndo}
                            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Undo"
                        >
                            <Undo className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                            onClick={redo}
                            disabled={!canRedo}
                            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Redo"
                        >
                            <Redo className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>
                    </div>

                    <div className="border-l border-gray-300 dark:border-gray-700 h-8" />

                    {/* Enhance with AI */}
                    <button
                        onClick={handleEnhanceClick}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                        title="Enhance with AI"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Enhance with AI</span>
                    </button>

                    <div className="border-l border-gray-300 dark:border-gray-700 h-8" />

                    {/* Preview Toggle */}
                    <button
                        onClick={handlePreviewToggle}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isPreviewMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        title={isPreviewMode ? 'Exit Preview' : 'Enter Preview'}
                    >
                        {isPreviewMode ? (
                            <>
                                <EyeOff className="w-4 h-4" />
                                <span className="text-sm font-medium">Exit Preview</span>
                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4" />
                                <span className="text-sm font-medium">Preview</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Auto-save Status Indicator */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {saveStatus === 'saving' && (
                            <>
                                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">Saving...</span>
                            </>
                        )}
                        {saveStatus === 'saved' && (
                            <>
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    Saved {lastSaved ? new Date(lastSaved).toLocaleTimeString() : ''}
                                </span>
                            </>
                        )}
                        {saveStatus === 'error' && (
                            <>
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <span className="text-xs text-red-600">Save failed</span>
                            </>
                        )}
                        {saveStatus === 'idle' && lastSaved && (
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                                Last saved {new Date(lastSaved).toLocaleTimeString()}
                            </span>
                        )}
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    >
                        {theme === 'light' ? (
                            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        ) : (
                            <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        )}
                    </button>

                    <div className="border-l border-gray-300 dark:border-gray-700 h-8" />

                    {/* Manual Save */}
                    <button
                        onClick={handleSave}
                        disabled={saveStatus === 'saving'}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {saveStatus === 'saving' ? 'Saving...' : 'Save Now'}
                        </span>
                    </button>

                    {/* Download Project */}
                    <button
                        onClick={handleDownload}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Download as Next.js Project"
                    >
                        {isExporting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                            {isExporting ? 'Exporting...' : 'Download'}
                        </span>
                    </button>

                    {/* Deploy to Staging */}
                    <button
                        onClick={handleDeploy}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Rocket className="w-4 h-4" />
                        <span className="text-sm font-medium">Deploy</span>
                    </button>
                </div>
            </div>

            {/* Deployment Modal */}
            <EnhancedDeploymentModal
                isOpen={isDeployModalOpen}
                onClose={() => setIsDeployModalOpen(false)}
            />

            {/* Enhancement Modal */}
            {isEnhanceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
                        <EnhanceWithAI
                            project={project}
                            onProjectEnhanced={handleProjectEnhanced}
                            onClose={() => setIsEnhanceModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
