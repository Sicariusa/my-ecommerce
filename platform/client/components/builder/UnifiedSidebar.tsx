'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Layers, Package, FileText, FolderOpen } from 'lucide-react';
import { PagesPanel } from './PagesPanel';
import { PageTree } from './PageTree';
import { ComponentLibrary } from './ComponentLibrary';
import { FileManager } from './FileManager';
import { useBuilderStore } from '@/lib/stores/useBuilderStore';

/**
 * UnifiedSidebar - Four-tab sidebar for Pages, Components, Structure, and Files
 * 
 * Features:
 * - Resizable width with drag handle
 * - Persists width to localStorage
 * - Four tabs: Pages, Components, Structure, Files
 * - Smooth transitions
 */

type SidebarTab = 'pages' | 'components' | 'structure' | 'files';

const MIN_WIDTH = 200;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 280;

export function UnifiedSidebar() {
    const [activeTab, setActiveTab] = useState<SidebarTab>('pages');
    const [width, setWidth] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('builder-sidebar-width');
            return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
        }
        return DEFAULT_WIDTH;
    });
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Handle resize
    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!sidebarRef.current) return;

            const newWidth = e.clientX;

            if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
                setWidth(newWidth);
                localStorage.setItem('builder-sidebar-width', newWidth.toString());
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    const handleResizeStart = () => {
        setIsResizing(true);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    return (
        <div
            ref={sidebarRef}
            style={{ width: `${width}px` }}
            className="relative bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex h-full transition-all duration-150"
        >
            {/* Vertical Tab Bar - Left Side */}
            <div className="w-16 flex flex-col items-center border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-4 gap-2">
                <button
                    onClick={() => setActiveTab('pages')}
                    className={`
                        flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-lg text-xs font-medium transition-all
                        ${activeTab === 'pages'
                            ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
                        }
                    `}
                    title="Pages"
                >
                    <FileText size={20} />
                    <span className="text-[10px]">Pages</span>
                </button>
                <button
                    onClick={() => setActiveTab('components')}
                    className={`
                        flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-lg text-xs font-medium transition-all
                        ${activeTab === 'components'
                            ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
                        }
                    `}
                    title="Components"
                >
                    <Package size={20} />
                    <span className="text-[10px]">Comp.</span>
                </button>
                <button
                    onClick={() => setActiveTab('structure')}
                    className={`
                        flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-lg text-xs font-medium transition-all
                        ${activeTab === 'structure'
                            ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
                        }
                    `}
                    title="Structure"
                >
                    <Layers size={20} />
                    <span className="text-[10px]">Tree</span>
                </button>
                <button
                    onClick={() => setActiveTab('files')}
                    className={`
                        flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-lg text-xs font-medium transition-all
                        ${activeTab === 'files'
                            ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
                        }
                    `}
                    title="Files"
                >
                    <FolderOpen size={20} />
                    <span className="text-[10px]">Files</span>
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'pages' && <PagesPanel />}
                {activeTab === 'components' && <ComponentLibrary />}
                {activeTab === 'structure' && <PageTree />}
                {activeTab === 'files' && (
                    <FileManager
                        projectId={useBuilderStore.getState().project?.id || 'default'}
                    />
                )}
            </div>

            {/* Resize Handle */}
            <div
                onMouseDown={handleResizeStart}
                className={`
                    absolute top-0 right-0 bottom-0 w-1 cursor-col-resize
                    hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors
                    ${isResizing ? 'bg-blue-500 dark:bg-blue-400' : 'bg-transparent'}
                `}
                style={{ zIndex: 10 }}
            >
                <div className="absolute top-0 right-0 bottom-0 w-4 -mr-2" />
            </div>
        </div>
    );
}
