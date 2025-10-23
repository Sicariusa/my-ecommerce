/**
 * PageTree.tsx - Enhanced Version
 * 
 * Hierarchical page tree component showing pages and nested blocks.
 * Enhanced with inline renaming, better hierarchy, custom names, and improved visuals.
 * Supports drag & drop, context menu, and page management.
 * 
 * @module components/builder/PageTree
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useBuilderStore } from '@/lib/stores/useBuilderStore';
import { ComponentNode } from '@/lib/schema';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import toast from 'react-hot-toast';
import { Tooltip } from './Tooltip';
import {
    Box,
    Type,
    Image as ImageIcon,
    MousePointer,
    MousePointerClick,
    Square,
    Columns,
    Grid3x3,
    LayoutGrid,
    Link as LinkIcon,
    List,
    CheckSquare,
    Radio,
    FileText,
    Video,
    Code,
    Minus,
    Layers,
    ChevronRight,
    ChevronDown,
    Plus,
    Trash2,
    Copy,
    Edit2,
    MoreVertical,
    Lock,
    Unlock,
    Eye,
    EyeOff,
    Package,
} from 'lucide-react';

/**
 * Get appropriate icon for component type
 */
function getComponentIcon(type: string) {
    const icons: Record<string, React.ReactNode> = {
        Body: <Package className="w-4 h-4" />,
        Section: <Layers className="w-4 h-4" />,
        Div: <Square className="w-4 h-4" />,
        Container: <Package className="w-4 h-4" />,
        Text: <Type className="w-4 h-4" />,
        Image: <ImageIcon className="w-4 h-4" />,
        Button: <MousePointerClick className="w-4 h-4" />,
    };
    return icons[type] || <Layers className="w-4 h-4" />;
}

/**
 * TreeNode component for rendering individual nodes with enhanced features
 */
function TreeNode({ node, depth = 0 }: { node: ComponentNode; depth?: number }) {
    const [isExpanded, setIsExpanded] = useState(!node.metadata?.collapsed);
    const [isRenaming, setIsRenaming] = useState(false);
    const [editName, setEditName] = useState(node.metadata?.name || node.type);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedNodeId = useBuilderStore((state) => state.selectedNodeId);
    const selectNode = useBuilderStore((state) => state.selectNode);
    const deleteNode = useBuilderStore((state) => state.deleteNode);
    const duplicateNode = useBuilderStore((state) => state.duplicateNode);
    const renameNode = useBuilderStore((state) => state.renameNode);
    const lockNode = useBuilderStore((state) => state.lockNode);
    const wrapInContainer = useBuilderStore((state) => state.wrapInContainer);
    const updateNodeMetadata = useBuilderStore((state) => state.updateNodeMetadata);

    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const isLocked = node.metadata?.locked || false;
    const displayName = node.metadata?.name || node.type;

    // Setup draggable (disable for Body component)
    const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
        id: node.id,
        data: {
            type: 'node',
            node,
        },
        disabled: isLocked || node.type === 'Body', // Prevent dragging Body
    });

    // Setup droppable
    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: `node-drop-${node.id}`,
        data: {
            type: 'node-container',
            nodeId: node.id,
            accepts: ['component', 'node'],
        },
    });

    // Focus input when renaming starts
    useEffect(() => {
        if (isRenaming && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isRenaming]);

    const handleClick = useCallback(() => {
        if (!isLocked) {
            selectNode(node.id);
        }
    }, [node.id, selectNode, isLocked]);

    const handleToggle = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        const newCollapsed = !isExpanded;
        setIsExpanded(!newCollapsed);
        updateNodeMetadata(node.id, { collapsed: newCollapsed });
    }, [isExpanded, node.id, updateNodeMetadata]);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowContextMenu(true);
    }, []);

    const handleDelete = useCallback(() => {
        if (!isLocked) {
            deleteNode(node.id);
            setShowContextMenu(false);
        }
    }, [node.id, deleteNode, isLocked]);

    const handleDuplicate = useCallback(() => {
        if (!isLocked) {
            duplicateNode(node.id);
            setShowContextMenu(false);
        }
    }, [node.id, duplicateNode, isLocked]);

    const handleRename = useCallback(() => {
        if (editName.trim()) {
            renameNode(node.id, editName.trim());
        } else {
            setEditName(displayName);
        }
        setIsRenaming(false);
        setShowContextMenu(false);
    }, [node.id, editName, renameNode, displayName]);

    const handleStartRename = useCallback(() => {
        if (!isLocked) {
            setIsRenaming(true);
            setShowContextMenu(false);
        }
    }, [isLocked]);

    const handleToggleLock = useCallback(() => {
        lockNode(node.id, !isLocked);
        setShowContextMenu(false);
    }, [node.id, isLocked, lockNode]);

    const handleWrapInDiv = useCallback(() => {
        if (!isLocked && node.type !== 'Body') {
            wrapInContainer(node.id, 'Div');
            setShowContextMenu(false);
        }
    }, [node.id, node.type, isLocked, wrapInContainer]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleRename();
        } else if (e.key === 'Escape') {
            setEditName(displayName);
            setIsRenaming(false);
        }
    }, [handleRename, displayName]);

    return (
        <div className="relative group">
            <div
                ref={(el) => {
                    setDragRef(el);
                    setDropRef(el);
                }}
                {...attributes}
                {...listeners}
                className={`
          flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-all duration-150
          hover:bg-gray-100 dark:hover:bg-gray-700
          ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium ring-1 ring-blue-200 dark:ring-blue-700' : 'text-gray-700 dark:text-gray-300'}
          ${isDragging ? 'opacity-40' : ''}
          ${isOver ? 'ring-2 ring-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : ''}
          ${isLocked ? 'opacity-60' : ''}
        `}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
                onClick={handleClick}
                onContextMenu={handleContextMenu}
            >
                {/* Expand/collapse icon */}
                {hasChildren && (
                    <button
                        onClick={handleToggle}
                        className="flex-shrink-0 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                        )}
                    </button>
                )}
                {!hasChildren && <div className="w-5" />}

                {/* Component icon */}
                <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
                    {getComponentIcon(node.type)}
                </div>

                {/* Node label or input */}
                {isRenaming ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleRename}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-2 py-0.5 text-sm border border-blue-500 dark:border-blue-400 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className="flex-1 truncate" onDoubleClick={handleStartRename}>
                        {displayName}
                        {node.type !== displayName && (
                            <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500 font-normal">
                                ({node.type})
                            </span>
                        )}
                        {node.type === 'Body' && (
                            <Tooltip content="Root component - cannot be moved or deleted" side="right">
                                <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium cursor-help">
                                    ROOT
                                </span>
                            </Tooltip>
                        )}
                    </span>
                )}

                {/* Lock indicator */}
                {isLocked && (
                    <Lock className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                )}

                {/* Context menu button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowContextMenu(!showContextMenu);
                    }}
                    className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <MoreVertical className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Context menu */}
            {showContextMenu && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowContextMenu(false)}
                    />
                    <div className="absolute left-full top-0 ml-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20 min-w-[180px] animate-fade-in">
                        <button
                            onClick={handleRename}
                            disabled={isLocked || node.type === 'Body'}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            Rename {node.type === 'Body' ? '(Protected)' : ''}
                        </button>
                        <button
                            onClick={handleDuplicate}
                            disabled={isLocked}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Copy className="w-4 h-4" />
                            Duplicate
                        </button>
                        <button
                            onClick={handleToggleLock}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            {isLocked ? 'Unlock' : 'Lock'}
                        </button>
                        <button
                            onClick={handleWrapInDiv}
                            disabled={isLocked || node.type === 'Body'}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Box className="w-4 h-4" />
                            Wrap in Div {node.type === 'Body' ? '(Protected)' : ''}
                        </button>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                        <button
                            onClick={handleDelete}
                            disabled={isLocked || node.type === 'Body'}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete {node.type === 'Body' ? '(Protected)' : ''}
                        </button>
                    </div>
                </>
            )}

            {/* Children */}
            {hasChildren && isExpanded && (
                <div className="ml-0">
                    {node.children.map((child) => (
                        <TreeNode key={child.id} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * PageItem component for rendering page entries
 */
function PageItem({ pageId, name, isActive }: { pageId: string; name: string; isActive: boolean }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(name);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const setActivePage = useBuilderStore((state) => state.setActivePage);
    const renamePage = useBuilderStore((state) => state.renamePage);
    const deletePage = useBuilderStore((state) => state.deletePage);
    const project = useBuilderStore((state) => state.project);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleClick = useCallback(() => {
        setActivePage(pageId);
    }, [pageId, setActivePage]);

    const handleRename = useCallback(() => {
        if (editName.trim()) {
            renamePage(pageId, editName.trim());
        } else {
            setEditName(name);
        }
        setIsEditing(false);
        setShowContextMenu(false);
    }, [pageId, editName, renamePage, name]);

    const handleDelete = useCallback(() => {
        if (project && project.pages.length > 1) {
            deletePage(pageId);
        }
        setShowContextMenu(false);
    }, [pageId, deletePage, project]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleRename();
        } else if (e.key === 'Escape') {
            setEditName(name);
            setIsEditing(false);
        }
    }, [handleRename, name]);

    return (
        <div className="relative group">
            <div
                className={`
          flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-all duration-150
          hover:bg-gray-100 dark:hover:bg-gray-700
          ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium ring-1 ring-blue-200 dark:ring-blue-700' : 'text-gray-700 dark:text-gray-300'}
        `}
                onClick={handleClick}
            >
                <FileText className="w-4 h-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />

                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleRename}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-2 py-0.5 text-sm border border-blue-500 dark:border-blue-400 rounded bg-white dark:bg-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className="flex-1 truncate">{name}</span>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowContextMenu(!showContextMenu);
                    }}
                    className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <MoreVertical className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Context menu */}
            {showContextMenu && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowContextMenu(false)}
                    />
                    <div className="absolute left-full top-0 ml-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20 min-w-[160px] animate-fade-in">
                        <button
                            onClick={() => {
                                setIsEditing(true);
                                setShowContextMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            Rename
                        </button>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                        <button
                            onClick={handleDelete}
                            disabled={project?.pages.length === 1}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

/**
 * Main PageTree component
 */
export function PageTree({ className = '' }: { className?: string }) {
    const project = useBuilderStore((state) => state.project);
    const activePageId = useBuilderStore((state) => state.activePageId);
    const activePage = useBuilderStore((state) => state.getActivePage());
    const addPage = useBuilderStore((state) => state.addPage);
    const addNode = useBuilderStore((state) => state.addNode);
    const [showComponentDropdown, setShowComponentDropdown] = useState(false);
    const [componentSearch, setComponentSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowComponentDropdown(false);
            }
        };

        if (showComponentDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showComponentDropdown]);

    // Close dropdown on escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowComponentDropdown(false);
                setComponentSearch('');
            }
        };

        if (showComponentDropdown) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [showComponentDropdown]);

    const handleAddPage = useCallback(() => {
        const pageName = prompt('Enter page name:');
        if (pageName?.trim()) {
            addPage(pageName.trim());
        }
    }, [addPage]);

    // Get available components with matching icons from ComponentLibrary
    const availableComponents = [
        { type: 'Section', label: 'Section', icon: <Box className="w-4 h-4" /> },
        { type: 'Div', label: 'Div', icon: <Square className="w-4 h-4" /> },
        { type: 'Container', label: 'Container', icon: <LayoutGrid className="w-4 h-4" /> },
        { type: 'Text', label: 'Text', icon: <Type className="w-4 h-4" /> },
        { type: 'Image', label: 'Image', icon: <ImageIcon className="w-4 h-4" /> },
        { type: 'Button', label: 'Button', icon: <MousePointer className="w-4 h-4" /> },
        { type: 'Link', label: 'Link', icon: <LinkIcon className="w-4 h-4" /> },
        { type: 'Heading', label: 'Heading', icon: <FileText className="w-4 h-4" /> },
        { type: 'FlexRow', label: 'Flex Row', icon: <Columns className="w-4 h-4" /> },
        { type: 'Grid', label: 'Grid', icon: <Grid3x3 className="w-4 h-4" /> },
        { type: 'Form', label: 'Form', icon: <Code className="w-4 h-4" /> },
        { type: 'Input', label: 'Input', icon: <Minus className="w-4 h-4" /> },
        { type: 'Checkbox', label: 'Checkbox', icon: <CheckSquare className="w-4 h-4" /> },
        { type: 'Radio', label: 'Radio', icon: <Radio className="w-4 h-4" /> },
        { type: 'List', label: 'List', icon: <List className="w-4 h-4" /> },
        { type: 'Video', label: 'Video', icon: <Video className="w-4 h-4" /> },
    ];

    const filteredComponents = availableComponents.filter(comp =>
        comp.label.toLowerCase().includes(componentSearch.toLowerCase()) ||
        comp.type.toLowerCase().includes(componentSearch.toLowerCase())
    );

    const handleAddComponent = useCallback((componentType: string) => {
        if (!activePage || !activePage.tree || activePage.tree.length === 0) {
            toast.error('No Body component found');
            return;
        }

        const bodyNode = activePage.tree[0];
        if (bodyNode.type !== 'Body') {
            toast.error('Body component must be the root element');
            return;
        }

        addNode(bodyNode.id, componentType);
        setShowComponentDropdown(false);
        setComponentSearch('');
        toast.success(`${componentType} added to page`);
    }, [activePage, addNode]);

    if (!project) {
        return (
            <div className={`flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
                <p className="text-gray-500 dark:text-gray-400 text-sm">No project loaded</p>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-200 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Pages & Layers</h2>
                <button
                    onClick={handleAddPage}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    title="Add Page"
                >
                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
            </div>

            {/* Pages list */}
            <div className="flex-1 overflow-auto">
                <div className="p-2 space-y-1">
                    {project.pages.map((page) => (
                        <PageItem
                            key={page.id}
                            pageId={page.id}
                            name={page.name}
                            isActive={page.id === activePageId}
                        />
                    ))}
                </div>

                {/* Divider */}
                {activePage && activePage.tree.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                )}

                {/* Node tree for active page */}
                {activePage && activePage.tree.length > 0 && (
                    <div className="p-2 relative">
                        <div className="flex items-center justify-between px-2 mb-2">
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Components
                            </div>
                            <button
                                onClick={() => setShowComponentDropdown(!showComponentDropdown)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                title="Add Component"
                            >
                                <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Component Dropdown */}
                        {showComponentDropdown && (
                            <div
                                ref={dropdownRef}
                                className="absolute top-10 left-2 right-2 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 flex flex-col"
                            >
                                {/* Search Input */}
                                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                    <input
                                        type="text"
                                        placeholder="Search components..."
                                        value={componentSearch}
                                        onChange={(e) => setComponentSearch(e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                                        autoFocus
                                    />
                                </div>

                                {/* Component List */}
                                <div className="overflow-y-auto p-1">
                                    {filteredComponents.length > 0 ? (
                                        filteredComponents.map((comp) => (
                                            <button
                                                key={comp.type}
                                                onClick={() => handleAddComponent(comp.type)}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-3"
                                            >
                                                <span className="text-gray-700 dark:text-gray-300">{comp.icon}</span>
                                                <span className="text-gray-900 dark:text-gray-100">{comp.label}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                                            No components found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-0.5">
                            {activePage.tree.map((node) => (
                                <TreeNode key={node.id} node={node} depth={0} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {activePage && activePage.tree.length === 0 && (
                    <div className="p-4 text-center">
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            No components yet. Drag components to the canvas to get started.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PageTree;
