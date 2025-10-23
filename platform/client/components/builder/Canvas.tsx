/**
 * Canvas.tsx
 * 
 * Main canvas component for rendering the active page tree.
 * Handles node selection, rendering, and provides drop zones for DnD.
 * Enhanced with grid overlay, zoom controls, and smooth animations.
 * 
 * @module components/builder/Canvas
 */

'use client';

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useBuilderStore } from '@/lib/stores/useBuilderStore';
import { useThemeStore, DEVICE_PRESETS } from '@/lib/stores/useThemeStore';
import { renderNode } from '@/lib/componentRegistry';
import { useDroppable } from '@dnd-kit/core';
import { ZoomIn, ZoomOut, Maximize2, Edit2, Copy, Trash2, Lock, Unlock, MoveUp, MoveDown, Monitor, Tablet, Smartphone } from 'lucide-react';
import { ContextMenu, type ContextMenuItem } from './ContextMenu';
import toast from 'react-hot-toast';

interface CanvasProps {
    className?: string;
    invalidDropTarget?: string | null;
}

/**
 * Canvas component - main rendering area for the builder
 */
export function Canvas({ className = '', invalidDropTarget = null }: CanvasProps) {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    const activePage = useBuilderStore((state) => state.getActivePage());
    const selectedNodeId = useBuilderStore((state) => state.selectedNodeId);
    const selectNode = useBuilderStore((state) => state.selectNode);
    const deleteNode = useBuilderStore((state) => state.deleteNode);
    const duplicateNode = useBuilderStore((state) => state.duplicateNode);
    const renameNode = useBuilderStore((state) => state.renameNode);
    const lockNode = useBuilderStore((state) => state.lockNode);
    const findNode = useBuilderStore((state) => state.findNode);
    const updateNodeProps = useBuilderStore((state) => state.updateNodeProps);

    // Theme store for grid and zoom
    const showGrid = useThemeStore((state) => state.showGrid);
    const zoomLevel = useThemeStore((state) => state.zoomLevel);
    const zoomIn = useThemeStore((state) => state.zoomIn);
    const zoomOut = useThemeStore((state) => state.zoomOut);
    const resetZoom = useThemeStore((state) => state.resetZoom);
    const devicePreset = useThemeStore((state) => state.devicePreset);
    const setDevicePreset = useThemeStore((state) => state.setDevicePreset);

    // Setup droppable for root level drops
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-root',
        data: {
            type: 'canvas-root',
            accepts: ['component', 'node'],
        },
    });

    const handleNodeClick = useCallback(
        (nodeId: string, e: React.MouseEvent) => {
            e.stopPropagation();
            selectNode(nodeId);
        },
        [selectNode]
    );

    const handleNodeContextMenu = useCallback(
        (nodeId: string, e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            selectNode(nodeId);
            setContextMenu({ x: e.clientX, y: e.clientY, nodeId });
        },
        [selectNode]
    );

    const handleContextMenuClose = useCallback(() => {
        setContextMenu(null);
    }, []);

    const handleCanvasClick = useCallback(
        (e: React.MouseEvent) => {
            // Only deselect if clicking directly on canvas background
            if (e.target === e.currentTarget) {
                selectNode(null);
            }
        },
        [selectNode]
    );

    // Listen for text content changes from inline editing
    useEffect(() => {
        const handleTextContentChange = (e: CustomEvent) => {
            const { nodeId, text } = e.detail;
            if (nodeId && text !== undefined) {
                updateNodeProps(nodeId, { text });
            }
        };

        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('text-content-change' as any, handleTextContentChange as any);
            return () => {
                canvas.removeEventListener('text-content-change' as any, handleTextContentChange as any);
            };
        }
    }, [updateNodeProps]);

    if (!activePage) {
        return (
            <div className={`flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
                <div className="text-center animate-fade-in">
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No page selected</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">Create or select a page to get started</p>
                </div>
            </div>
        );
    }

    // Get context menu items for the selected node
    const getContextMenuItems = (): ContextMenuItem[] => {
        if (!contextMenu) return [];

        const node = findNode(contextMenu.nodeId);
        if (!node) return [];

        const isLocked = node.metadata?.locked || false;
        const isBody = node.type === 'Body';

        return [
            {
                id: 'rename',
                label: 'Rename',
                icon: <Edit2 className="w-4 h-4" />,
                onClick: () => {
                    if (isBody) {
                        toast.error('Cannot rename the root Body component');
                        return;
                    }
                    const newName = prompt('Enter new name:', node.metadata?.name || node.type);
                    if (newName?.trim()) {
                        renameNode(contextMenu.nodeId, newName.trim());
                    }
                },
                disabled: isLocked || isBody,
            },
            {
                id: 'duplicate',
                label: 'Duplicate',
                icon: <Copy className="w-4 h-4" />,
                onClick: () => {
                    if (isBody) {
                        toast.error('Cannot duplicate the root Body component');
                        return;
                    }
                    duplicateNode(contextMenu.nodeId);
                },
                disabled: isLocked || isBody,
                divider: true,
            },
            {
                id: 'lock',
                label: isLocked ? 'Unlock' : 'Lock',
                icon: isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />,
                onClick: () => lockNode(contextMenu.nodeId, !isLocked),
                disabled: isBody,
            },
            {
                id: 'delete',
                label: 'Delete',
                icon: <Trash2 className="w-4 h-4" />,
                onClick: () => {
                    if (isBody) {
                        toast.error('Cannot delete the root Body component');
                        return;
                    }
                    deleteNode(contextMenu.nodeId);
                },
                disabled: isLocked || isBody,
                variant: 'danger' as const,
                divider: true,
            },
        ];
    };

    // Grid background pattern
    const gridPattern = showGrid
        ? "repeating-linear-gradient(0deg, #e5e7eb 0px, #e5e7eb 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #e5e7eb 0px, #e5e7eb 1px, transparent 1px, transparent 20px)"
        : "none";

    const darkGridPattern = showGrid
        ? "repeating-linear-gradient(0deg, #374151 0px, #374151 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #374151 0px, #374151 1px, transparent 1px, transparent 20px)"
        : "none";

    // Get device icon
    const getDeviceIcon = () => {
        switch (devicePreset) {
            case 'mobile': return <Smartphone className="w-4 h-4" />;
            case 'tablet': return <Tablet className="w-4 h-4" />;
            case 'desktop': return <Monitor className="w-4 h-4" />;
        }
    };

    // Get device dimensions
    const deviceDimensions = DEVICE_PRESETS[devicePreset];

    return (
        <div className="relative h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Device Preset Selector */}
            <div className="absolute top-4 left-4 z-10 flex gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1">
                <button
                    onClick={() => setDevicePreset('desktop')}
                    className={`p-2 rounded transition-colors ${devicePreset === 'desktop'
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    title="Desktop View"
                >
                    <Monitor className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setDevicePreset('tablet')}
                    className={`p-2 rounded transition-colors ${devicePreset === 'tablet'
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    title="Tablet View (768px)"
                >
                    <Tablet className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setDevicePreset('mobile')}
                    className={`p-2 rounded transition-colors ${devicePreset === 'mobile'
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    title="Mobile View (375px)"
                >
                    <Smartphone className="w-4 h-4" />
                </button>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1">
                <button
                    onClick={zoomOut}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                    onClick={resetZoom}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-xs font-medium text-gray-700 dark:text-gray-300"
                    title="Reset Zoom"
                >
                    {zoomLevel}%
                </button>
                <button
                    onClick={zoomIn}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Zoom In"
                >
                    <ZoomIn className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
            </div>

            {/* Canvas Container */}
            <div
                ref={setNodeRef}
                className={`flex-1 overflow-auto ${className} ${isOver ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
                onClick={handleCanvasClick}
                style={{
                    background: showGrid ? gridPattern : '#ffffff',
                }}
            >
                <div
                    className="min-h-full transition-all duration-300 origin-top-left flex justify-center items-start p-8"
                    style={{
                        transform: `scale(${zoomLevel / 100})`,
                        transformOrigin: 'top center',
                    }}
                >
                    {/* Device Frame */}
                    <div
                        ref={canvasRef}
                        className="relative transition-all duration-300 bg-white dark:bg-gray-800"
                        style={{
                            width: deviceDimensions.width,
                            minHeight: deviceDimensions.height,
                            boxShadow: devicePreset !== 'desktop' ? '0 10px 40px rgba(0,0,0,0.1)' : 'none',
                            border: devicePreset !== 'desktop' ? '1px solid #e5e7eb' : 'none',
                            borderRadius: devicePreset === 'mobile' ? '24px' : devicePreset === 'tablet' ? '16px' : '0',
                        }}
                    >
                        {/* Canvas content */}
                        {activePage.tree.length === 0 ? (
                            <div className="flex items-center justify-center h-64 animate-fade-in">
                                <div className="text-center p-8 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                                        Drag components here or click Add Component to get started
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="canvas-content animate-fade-in">
                                {activePage.tree.map((node) =>
                                    renderNode(node, selectedNodeId, handleNodeClick, handleNodeContextMenu, invalidDropTarget)
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Drop indicator */}
                {isOver && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-5 pointer-events-none border-2 border-blue-500 border-dashed animate-pulse" />
                )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    items={getContextMenuItems()}
                    onClose={handleContextMenuClose}
                />
            )}

            {/* Selection info overlay */}
            {selectedNodeId && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50 animate-slide-in">
                    Selected: {selectedNodeId.split('-')[0]}
                </div>
            )}
        </div>
    );
}

export default Canvas;
