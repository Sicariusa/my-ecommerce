'use client';

import React, { useState } from 'react';
import { useBuilderStore } from '@/lib/stores/useBuilderStore';
import { ChevronDown, ChevronRight, Plus, MoreVertical, FileText, Trash2, Copy, Edit2, GripVertical, Settings } from 'lucide-react';
import { ContextMenu, ContextMenuItem } from './ContextMenu';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * SortablePageItem - Individual draggable page item
 */
interface SortablePageItemProps {
    pageId: string;
    pageName: string;
    pageSlug: string;
    isActive: boolean;
    isEditing: boolean;
    editingName: string;
    editingSlug: string;
    onPageClick: (pageId: string) => void;
    onContextMenu: (e: React.MouseEvent, pageId: string) => void;
    onEditNameChange: (value: string) => void;
    onEditSlugChange: (value: string) => void;
    onRenameSubmit: () => void;
    onRenameCancel: () => void;
}

function SortablePageItem({
    pageId,
    pageName,
    pageSlug,
    isActive,
    isEditing,
    editingName,
    editingSlug,
    onPageClick,
    onContextMenu,
    onEditNameChange,
    onEditSlugChange,
    onRenameSubmit,
    onRenameCancel,
}: SortablePageItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: pageId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="group">
            <div
                className={`
                    flex items-center gap-2 px-3 py-2 cursor-pointer
                    ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                `}
                onClick={() => onPageClick(pageId)}
                onContextMenu={(e) => onContextMenu(e, pageId)}
            >
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <GripVertical size={14} className="text-gray-400 dark:text-gray-500" />
                </div>

                <FileText
                    size={16}
                    className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}
                />

                {isEditing ? (
                    <div className="flex-1 flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="text"
                            value={editingName}
                            onChange={(e) => onEditNameChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') onRenameSubmit();
                                if (e.key === 'Escape') onRenameCancel();
                            }}
                            onBlur={onRenameSubmit}
                            autoFocus
                            className="px-1 py-0.5 text-xs border border-blue-500 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Page name"
                        />
                        <input
                            type="text"
                            value={editingSlug}
                            onChange={(e) => onEditSlugChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') onRenameSubmit();
                                if (e.key === 'Escape') onRenameCancel();
                            }}
                            className="px-1 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            placeholder="Slug (e.g., /about)"
                        />
                    </div>
                ) : (
                    <div className="flex-1 min-w-0">
                        <div className={`text-sm truncate ${isActive ? 'text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                            {pageName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {pageSlug}
                        </div>
                    </div>
                )}

                {!isEditing && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onContextMenu(e, pageId);
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <MoreVertical size={14} className="text-gray-500 dark:text-gray-400" />
                    </button>
                )}
            </div>
        </div>
    );
}

/**
 * PagesPanel Component
 * 
 * Displays a list of all pages in the project with management capabilities:
 * - Switch between pages
 * - Create new pages
 * - Duplicate pages
 * - Rename pages
 * - Delete pages
 * - Reorder pages (drag and drop)
 */
export function PagesPanel() {
    const { project, activePageId, setActivePage, addPage, deletePage, renamePage, duplicatePage, reorderPages } = useBuilderStore();
    const [isExpanded, setIsExpanded] = useState(true);
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        pageId: string;
    } | null>(null);
    const [editingPageId, setEditingPageId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [editingSlug, setEditingSlug] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPageName, setNewPageName] = useState('');
    const [newPageSlug, setNewPageSlug] = useState('');

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement required to start drag
            },
        })
    );

    if (!project) return null;

    const handlePageClick = (pageId: string) => {
        if (editingPageId !== pageId) {
            setActivePage(pageId);
        }
    };

    const handlePageContextMenu = (e: React.MouseEvent, pageId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY, pageId });
    };

    const handleContextMenuAction = (action: string) => {
        if (!contextMenu) return;
        const { pageId } = contextMenu;
        const page = project.pages.find(p => p.id === pageId);
        if (!page) return;

        switch (action) {
            case 'rename':
                setEditingPageId(pageId);
                setEditingName(page.name);
                setEditingSlug(page.slug);
                break;
            case 'duplicate':
                duplicatePage(pageId);
                break;
            case 'delete':
                if (project.pages.length > 1) {
                    if (confirm(`Delete page "${page.name}"?`)) {
                        deletePage(pageId);
                    }
                } else {
                    alert('Cannot delete the last page');
                }
                break;
        }
        setContextMenu(null);
    };

    const handleRenameSubmit = () => {
        if (editingPageId && editingName.trim()) {
            renamePage(editingPageId, editingName.trim(), editingSlug.trim());
            setEditingPageId(null);
        }
    };

    const handleCreatePage = () => {
        if (newPageName.trim()) {
            addPage(newPageName.trim(), newPageSlug.trim() || undefined);
            setShowCreateModal(false);
            setNewPageName('');
            setNewPageSlug('');
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = project.pages.findIndex((p) => p.id === active.id);
            const newIndex = project.pages.findIndex((p) => p.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderPages(oldIndex, newIndex);
            }
        }
    };

    const contextMenuItems: ContextMenuItem[] = [
        {
            id: 'rename',
            label: 'Rename',
            onClick: () => handleContextMenuAction('rename'),
            icon: <Edit2 size={16} />
        },
        {
            id: 'duplicate',
            label: 'Duplicate',
            onClick: () => handleContextMenuAction('duplicate'),
            icon: <Copy size={16} />
        },
        {
            id: 'delete',
            label: 'Delete',
            onClick: () => handleContextMenuAction('delete'),
            icon: <Trash2 size={16} />,
            variant: 'danger' as const
        },
    ];

    const pageIds = project.pages.map(p => p.id);

    return (
        <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    Pages ({project.pages.length})
                </button>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Add new page"
                >
                    <Plus size={16} className="text-gray-600 dark:text-gray-400" />
                </button>
            </div>

            {/* Page List */}
            {isExpanded && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={pageIds} strategy={verticalListSortingStrategy}>
                        <div className="flex-1 overflow-y-auto">
                            {project.pages.map((page) => {
                                const isActive = page.id === activePageId;
                                const isEditing = editingPageId === page.id;

                                return (
                                    <SortablePageItem
                                        key={page.id}
                                        pageId={page.id}
                                        pageName={page.name}
                                        pageSlug={page.slug}
                                        isActive={isActive}
                                        isEditing={isEditing}
                                        editingName={editingName}
                                        editingSlug={editingSlug}
                                        onPageClick={handlePageClick}
                                        onContextMenu={handlePageContextMenu}
                                        onEditNameChange={setEditingName}
                                        onEditSlugChange={setEditingSlug}
                                        onRenameSubmit={handleRenameSubmit}
                                        onRenameCancel={() => setEditingPageId(null)}
                                    />
                                );
                            })}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    items={contextMenuItems}
                    onClose={() => setContextMenu(null)}
                />
            )}

            {/* Create Page Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Page</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Page Name
                                </label>
                                <input
                                    type="text"
                                    value={newPageName}
                                    onChange={(e) => setNewPageName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleCreatePage();
                                        if (e.key === 'Escape') setShowCreateModal(false);
                                    }}
                                    placeholder="e.g., About Us"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    URL Slug (optional)
                                </label>
                                <input
                                    type="text"
                                    value={newPageSlug}
                                    onChange={(e) => setNewPageSlug(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleCreatePage();
                                        if (e.key === 'Escape') setShowCreateModal(false);
                                    }}
                                    placeholder="e.g., /about-us"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Leave empty to auto-generate from name
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePage}
                                disabled={!newPageName.trim()}
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Create Page
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
