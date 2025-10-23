/**
 * Builder Page
 * 
 * Main website builder interface with three-panel layout:
 * - Left: PageTree (pages and component hierarchy)
 * - Center: Canvas (visual editor)
 * - Right: Inspector (property editor)
 * 
 * Includes drag & drop, toolbar, and import/export functionality.
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useBuilderStore } from '@/lib/stores/useBuilderStore';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { sampleTemplate, createNode } from '@/lib/schema';
import { getAvailableComponents, getComponentDefaults } from '@/lib/componentRegistry';
import { Canvas } from '@/components/builder/Canvas';
import { UnifiedSidebar } from '@/components/builder/UnifiedSidebar';
import { Inspector } from '@/components/builder/Inspector';
import { BuilderTopBar } from '@/components/builder/BuilderTopBar';
import {
    exportProject,
    importProject,
    downloadProjectJSON,
    downloadGeneratedCode
} from '@/lib/utils/importExport';
import toast, { Toaster } from 'react-hot-toast';
import {
    Save,
    Download,
    Upload,
    Code,
    Play,
    Plus,
    ChevronDown,
    FileJson,
    Folder,
    Moon,
    Sun,
    Grid3x3,
    Undo,
    Redo
} from 'lucide-react';

export default function BuilderPage() {
    const [activeComponent, setActiveComponent] = useState<string | null>(null);
    const [invalidDropTarget, setInvalidDropTarget] = useState<string | null>(null);
    const [showComponentMenu, setShowComponentMenu] = useState(false);
    const [showFileMenu, setShowFileMenu] = useState(false);

    const project = useBuilderStore((state: any) => state.project);
    const activePageId = useBuilderStore((state: any) => state.activePageId);
    const setProject = useBuilderStore((state: any) => state.setProject);
    const addNode = useBuilderStore((state: any) => state.addNode);
    const moveNode = useBuilderStore((state: any) => state.moveNode);
    const findNode = useBuilderStore((state: any) => state.findNode);
    const selectedNodeId = useBuilderStore((state: any) => state.selectedNodeId);
    const deleteNode = useBuilderStore((state: any) => state.deleteNode);
    const undo = useBuilderStore((state: any) => state.undo);
    const redo = useBuilderStore((state: any) => state.redo);
    const canUndo = useBuilderStore((state: any) => state.canUndo);
    const canRedo = useBuilderStore((state: any) => state.canRedo);

    // Theme store
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const showGrid = useThemeStore((state) => state.showGrid);
    const toggleGrid = useThemeStore((state) => state.toggleGrid);

    // Initialize with sample template if no project
    useEffect(() => {
        if (!project) {
            setProject(sampleTemplate);
        }
    }, [project, setProject]);

    // Initialize theme on mount
    useEffect(() => {
        // Apply theme class to document
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Delete key - delete selected node
            if (e.key === 'Delete' && selectedNodeId) {
                e.preventDefault();
                deleteNode(selectedNodeId);
                toast.success('Component deleted');
            }

            // Ctrl/Cmd + S - Save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }

            // Ctrl/Cmd + Z - Undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                if (canUndo()) {
                    undo();
                    toast.success('Undone');
                }
            }

            // Ctrl/Cmd + Y OR Ctrl/Cmd + Shift + Z - Redo
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                if (canRedo()) {
                    redo();
                    toast.success('Redone');
                }
            }

            // Ctrl/Cmd + E - Export
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                handleExport();
            }

            // Ctrl/Cmd + G - Toggle Grid
            if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
                e.preventDefault();
                toggleGrid();
                toast.success(showGrid ? 'Grid hidden' : 'Grid visible');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNodeId, deleteNode, showGrid, toggleGrid, canUndo, canRedo, undo, redo]);

    // Setup drag & drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before drag starts
            },
        })
    );

    // Handle drag start
    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        setActiveComponent(active.id as string);
    }, []);

    // Handle drag over - visual feedback for invalid drops
    const handleDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event;

        if (!over) {
            setInvalidDropTarget(null);
            return;
        }

        const activeData = active.data.current;
        const overData = over.data.current;

        // Check if trying to move a node into its descendant
        if (activeData?.type === 'node' && activeData?.node && overData?.type === 'node-container') {
            const nodeId = activeData.node.id;
            const targetNodeId = overData.nodeId;

            if (nodeId && targetNodeId && isDescendant(nodeId, targetNodeId)) {
                setInvalidDropTarget(targetNodeId);
                return;
            }
        }

        setInvalidDropTarget(null);
    }, [findNode]);

    // Handle drag end
    // Utility function to check if a node is a descendant of another
    const isDescendant = useCallback((potentialParentId: string, childId: string): boolean => {
        if (potentialParentId === childId) return true;

        const checkChildren = (nodeId: string): boolean => {
            const node = findNode(nodeId);
            if (!node || !node.children) return false;

            for (const child of node.children) {
                if (child.id === childId) return true;
                if (checkChildren(child.id)) return true;
            }
            return false;
        };

        return checkChildren(potentialParentId);
    }, [findNode]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveComponent(null);
            return;
        }

        const activeData = active.data.current;
        const overData = over.data.current;

        // Case 1: Dragging a new component from ComponentLibrary
        if (activeData?.source === 'library' && activeData?.type) {
            const componentType = activeData.type;

            // Find the Body component (root) to ensure all components go inside it
            const activePage = project?.pages.find((p: any) => p.id === activePageId);
            if (!activePage || !activePage.tree || activePage.tree.length === 0) {
                toast.error('No active page or Body component found');
                setActiveComponent(null);
                return;
            }

            // Get Body component (should be first in tree)
            const bodyNode = activePage.tree[0];
            if (bodyNode.type !== 'Body') {
                toast.error('Body component must be the root element');
                setActiveComponent(null);
                return;
            }

            // Determine where to drop
            let targetParentId = bodyNode.id; // Default to Body

            if (overData?.type === 'node-container' && overData.nodeId) {
                // Drop into a specific container
                targetParentId = overData.nodeId;
            } else if (overData?.type === 'node' && overData.node) {
                // Dropped near a node, find its parent or use Body
                const droppedNode = overData.node;
                if (droppedNode.type === 'Body') {
                    targetParentId = bodyNode.id;
                } else {
                    // For now, drop into Body (can be enhanced with spatial detection)
                    targetParentId = bodyNode.id;
                }
            }

            // Add the component
            addNode(targetParentId, componentType);
            toast.success(`${componentType} added to page`);
        }

        // Case 2: Moving an existing node
        else if (activeData?.type === 'node' && activeData?.node) {
            const nodeId = activeData.node.id;
            const node = activeData.node;

            // Prevent moving Body component
            if (node.type === 'Body') {
                toast.error('Cannot move Body component - it must remain as root');
                setActiveComponent(null);
                return;
            }

            if (overData?.type === 'canvas-root') {
                // Cannot drop outside Body - prevent this
                toast.error('Components must be inside Body container');
            } else if (overData?.type === 'node-container' && overData.nodeId !== nodeId) {
                const targetNodeId = overData.nodeId;

                // HIERARCHY CHECK: Prevent dropping into self or descendant
                if (isDescendant(nodeId, targetNodeId)) {
                    toast.error('Cannot move a component into itself or its descendants');
                    setActiveComponent(null);
                    return;
                }

                // Move into another container (don't allow dropping into self)
                const targetNode = findNode(targetNodeId);

                // Prevent dropping into Body's siblings or outside Body tree
                if (targetNode && targetNode.type !== 'Body') {
                    moveNode(nodeId, targetNodeId, 0);
                    toast.success('Component moved');
                } else if (targetNode && targetNode.type === 'Body') {
                    // Allow dropping into Body
                    moveNode(nodeId, targetNodeId, 0);
                    toast.success('Component moved to Body');
                }
            } else if (overData?.type === 'node-drop' && overData.nodeId) {
                // Drop near a node (from PageTree drag)
                moveNode(nodeId, null, 0); // This needs parent context
                toast.success('Component reordered');
            }
        }

        setActiveComponent(null);
    }, [addNode, moveNode, project, activePageId, findNode]);


    // Save project to server
    const handleSave = useCallback(async () => {
        if (!project) return;

        const loadingToast = toast.loading('Saving project...');
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(project),
            });

            if (response.ok) {
                toast.success('Project saved successfully!', { id: loadingToast });
            } else {
                toast.error('Failed to save project', { id: loadingToast });
            }
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error('Error saving project', { id: loadingToast });
        }
    }, [project]);

    // Export project as JSON
    const handleExport = useCallback(() => {
        if (!project) return;
        downloadProjectJSON(project);
        toast.success('Project exported successfully!');
    }, [project]);

    // Import project from JSON
    const handleImport = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const loadingToast = toast.loading('Importing project...');
            try {
                const text = await file.text();
                const importedProject = importProject(text);
                setProject(importedProject);
                toast.success('Project imported successfully!', { id: loadingToast });
            } catch (error) {
                console.error('Error importing project:', error);
                toast.error('Failed to import project: ' + (error as Error).message, { id: loadingToast });
            }
        };
        input.click();
    }, [setProject]);

    // Generate and download Next.js code
    const handleGenerateCode = useCallback(() => {
        if (!project) return;
        const loadingToast = toast.loading('Generating code...');
        try {
            downloadGeneratedCode(project);
            toast.success('Code generated successfully!', { id: loadingToast });
        } catch (error) {
            toast.error('Failed to generate code', { id: loadingToast });
        }
    }, [project]);

    // Load sample template
    const handleLoadSample = useCallback(() => {
        setProject(sampleTemplate);
        toast.success('Sample template loaded');
    }, [setProject]);

    // Add component from toolbar
    const handleAddComponent = useCallback((componentType: string) => {
        addNode(null, componentType);
        setShowComponentMenu(false);
    }, [addNode]);

    const availableComponents = getAvailableComponents();

    if (!project) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-gray-500">Loading builder...</p>
                </div>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            {/* Toast Notifications */}
            <Toaster position="top-right" />

            <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                {/* Top Bar with Deploy and Actions */}
                <BuilderTopBar
                    projectId={project?.id || 'default'}
                    projectName={project?.name || 'Untitled Project'}
                />

                {/* Old Toolbar - Keep for backward compatibility with file menu */}
                <div className="hidden items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">{project.name}</h1>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Website Builder</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* File Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFileMenu(!showFileMenu)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-150"
                            >
                                <Folder className="w-4 h-4" />
                                File
                                <ChevronDown className="w-3 h-3" />
                            </button>

                            {showFileMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowFileMenu(false)}
                                    />
                                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20 min-w-[200px] animate-fade-in">
                                        <button
                                            onClick={() => {
                                                handleLoadSample();
                                                setShowFileMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <FileJson className="w-4 h-4" />
                                            New from Template
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleImport();
                                                setShowFileMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Import JSON
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleExport();
                                                setShowFileMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            Export JSON
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Add Component Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowComponentMenu(!showComponentMenu)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-150 shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Component
                                <ChevronDown className="w-3 h-3" />
                            </button>

                            {showComponentMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowComponentMenu(false)}
                                    />
                                    <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20 min-w-[200px] animate-fade-in">
                                        {availableComponents.map((componentType) => (
                                            <button
                                                key={componentType}
                                                onClick={() => handleAddComponent(componentType)}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                {componentType}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            ) : (
                                <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            )}
                        </button>

                        {/* Grid Toggle */}
                        <button
                            onClick={toggleGrid}
                            className={`p-2 rounded-lg transition-colors ${showGrid
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                            title="Toggle Grid (Ctrl+G)"
                        >
                            <Grid3x3 className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

                        {/* Undo/Redo Buttons */}
                        <button
                            onClick={() => {
                                undo();
                                toast.success('Undone');
                            }}
                            disabled={!canUndo()}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                            onClick={() => {
                                redo();
                                toast.success('Redone');
                            }}
                            disabled={!canRedo()}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Redo (Ctrl+Y)"
                        >
                            <Redo className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>

                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

                        {/* Action Buttons */}
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg transition-all duration-150 shadow-sm"
                            title="Save Project (Ctrl+S)"
                        >
                            <Save className="w-4 h-4" />
                            Save
                        </button>

                        <button
                            onClick={handleGenerateCode}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg transition-all duration-150 shadow-sm"
                            title="Generate Next.js Code"
                        >
                            <Code className="w-4 h-4" />
                            Generate Code
                        </button>
                    </div>
                </div>

                {/* Main Layout */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Unified Sidebar with Tabs */}
                    <UnifiedSidebar />

                    {/* Center - Canvas */}
                    <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
                        <Canvas invalidDropTarget={invalidDropTarget} />
                    </div>

                    {/* Right Sidebar - Inspector */}
                    <div className="w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto transition-colors duration-200">
                        <Inspector />
                    </div>
                </div>
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeComponent && (
                    <div className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg text-sm font-medium animate-bounce-subtle">
                        {activeComponent}
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}