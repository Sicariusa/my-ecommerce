/**
 * ListEditor Component
 * 
 * Hierarchical list builder with up to 3-level nesting.
 * Supports ordered, unordered, and plain lists.
 */

'use client';

import React from 'react';
import { Plus, Minus, ChevronRight, Save } from 'lucide-react';
import { ComponentNode } from '@/lib/schema';

interface ListItem {
    id: string;
    text: string;
    children?: ListItem[];
}

interface ListEditorProps {
    node: ComponentNode;
    onUpdateList: (items: ListItem[]) => void;
    onSave?: () => void;
}

export function ListEditor({ node, onUpdateList, onSave }: ListEditorProps) {
    const listConfig = node.props.listConfig || {
        type: 'unordered',
        items: [
            { id: '1', text: 'List item 1' },
            { id: '2', text: 'List item 2' },
        ],
    };

    const [items, setItems] = React.useState<ListItem[]>(listConfig.items);
    const [hasChanges, setHasChanges] = React.useState(false);

    const handleAddItem = (parentId?: string) => {
        const newItem: ListItem = {
            id: `item-${Date.now()}`,
            text: 'New item',
            children: [],
        };

        if (!parentId) {
            // Add to root level
            const newItems = [...items, newItem];
            setItems(newItems);
            setHasChanges(true);
        } else {
            // Add to specific parent (nested)
            const addToParent = (itemsList: ListItem[]): ListItem[] => {
                return itemsList.map((item) => {
                    if (item.id === parentId) {
                        return {
                            ...item,
                            children: [...(item.children || []), newItem],
                        };
                    }
                    if (item.children) {
                        return {
                            ...item,
                            children: addToParent(item.children),
                        };
                    }
                    return item;
                });
            };

            const newItems = addToParent(items);
            setItems(newItems);
            setHasChanges(true);
        }
    };

    const handleRemoveItem = (itemId: string) => {
        const removeFromList = (itemsList: ListItem[]): ListItem[] => {
            return itemsList
                .filter((item) => item.id !== itemId)
                .map((item) => ({
                    ...item,
                    children: item.children ? removeFromList(item.children) : undefined,
                }));
        };

        const newItems = removeFromList(items);
        setItems(newItems);
        setHasChanges(true);
    };

    const handleUpdateText = (itemId: string, text: string) => {
        const updateText = (itemsList: ListItem[]): ListItem[] => {
            return itemsList.map((item) => {
                if (item.id === itemId) {
                    return { ...item, text };
                }
                if (item.children) {
                    return { ...item, children: updateText(item.children) };
                }
                return item;
            });
        };

        const newItems = updateText(items);
        setItems(newItems);
        setHasChanges(true);
    };

    const handleSave = () => {
        onUpdateList(items);
        setHasChanges(false);
        if (onSave) {
            onSave();
        }
    };

    const renderListItems = (itemsList: ListItem[], level: number = 0) => {
        if (level >= 3) return null; // Max 3 levels

        return itemsList.map((item) => (
            <li key={item.id} className="relative group">
                <div className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <input
                        type="text"
                        value={item.text}
                        onChange={(e) => handleUpdateText(item.id, e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {level < 2 && (
                            <button
                                onClick={() => handleAddItem(item.id)}
                                className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                                title="Add nested item"
                            >
                                <ChevronRight className="w-3 h-3 text-green-600" />
                            </button>
                        )}
                        <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                            title="Remove item"
                        >
                            <Minus className="w-3 h-3 text-red-600" />
                        </button>
                    </div>
                </div>

                {item.children && item.children.length > 0 && (
                    <ul className={`ml-6 mt-1 border-l-2 border-gray-300 dark:border-gray-600 pl-2 ${listConfig.type === 'ordered' ? 'list-decimal' : 'list-disc'
                        }`}>
                        {renderListItems(item.children, level + 1)}
                    </ul>
                )}
            </li>
        ));
    };

    return (
        <div className="border-2 border-dashed border-blue-400 bg-blue-50/10 dark:bg-blue-900/10 rounded p-4">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Edit List ({listConfig.type})
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleAddItem()}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        <Plus className="w-3 h-3" />
                        Add Item
                    </button>
                    {hasChanges && (
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            <Save className="w-3 h-3" />
                            Save Changes
                        </button>
                    )}
                </div>
            </div>

            <ul className={listConfig.type === 'ordered' ? 'list-decimal ml-5' : 'list-disc ml-5'}>
                {renderListItems(items)}
            </ul>
        </div>
    );
}
