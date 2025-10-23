'use client';

import React, { useState } from 'react';
import {
    Box,
    Type,
    Image as ImageIcon,
    MousePointer,
    Square,
    Columns,
    Grid3x3,
    Menu,
    LayoutGrid,
    Circle,
    Minus,
    Link as LinkIcon,
    List,
    CheckSquare,
    Radio,
    FileText,
    Video,
    Code,
    Layers
} from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';

/**
 * ComponentLibrary - Iconic component palette with drag support
 * 
 * Features:
 * - Icon-based component selector
 * - Drag to canvas functionality
 * - Hover tooltips with descriptions
 * - Categorized components
 */

interface ComponentDefinition {
    type: string;
    label: string;
    icon: React.ReactNode;
    description: string;
    category: 'layout' | 'content' | 'form' | 'media';
}

const COMPONENTS: ComponentDefinition[] = [
    // Layout Components
    {
        type: 'Body',
        label: 'Body',
        icon: <Layers size={20} />,
        description: 'Root container for the page',
        category: 'layout',
    },
    {
        type: 'Section',
        label: 'Section',
        icon: <Box size={20} />,
        description: 'Semantic section container',
        category: 'layout',
    },
    {
        type: 'Div',
        label: 'Div',
        icon: <Square size={20} />,
        description: 'Generic container block',
        category: 'layout',
    },
    {
        type: 'Container',
        label: 'Container',
        icon: <LayoutGrid size={20} />,
        description: 'Centered max-width container',
        category: 'layout',
    },
    {
        type: 'Grid',
        label: 'Grid',
        icon: <Grid3x3 size={20} />,
        description: 'CSS Grid layout',
        category: 'layout',
    },
    {
        type: 'FlexRow',
        label: 'Flex Row',
        icon: <Columns size={20} />,
        description: 'Horizontal flex container',
        category: 'layout',
    },

    // Content Components
    {
        type: 'Text',
        label: 'Text',
        icon: <Type size={20} />,
        description: 'Text paragraph',
        category: 'content',
    },
    {
        type: 'Heading',
        label: 'Heading',
        icon: <FileText size={20} />,
        description: 'Heading text (H1-H6)',
        category: 'content',
    },
    {
        type: 'Link',
        label: 'Link',
        icon: <LinkIcon size={20} />,
        description: 'Hyperlink element',
        category: 'content',
    },
    {
        type: 'Button',
        label: 'Button',
        icon: <MousePointer size={20} />,
        description: 'Interactive button',
        category: 'content',
    },
    {
        type: 'List',
        label: 'List',
        icon: <List size={20} />,
        description: 'Ordered or unordered list',
        category: 'content',
    },

    // Media Components
    {
        type: 'Image',
        label: 'Image',
        icon: <ImageIcon size={20} />,
        description: 'Image element',
        category: 'media',
    },
    {
        type: 'Video',
        label: 'Video',
        icon: <Video size={20} />,
        description: 'Video player',
        category: 'media',
    },

    // Form Components
    {
        type: 'Form',
        label: 'Form',
        icon: <Code size={20} />,
        description: 'Form container',
        category: 'form',
    },
    {
        type: 'Checkbox',
        label: 'Checkbox',
        icon: <CheckSquare size={20} />,
        description: 'Checkbox input',
        category: 'form',
    },
    {
        type: 'Radio',
        label: 'Radio',
        icon: <Radio size={20} />,
        description: 'Radio button input',
        category: 'form',
    },
];

interface DraggableComponentProps {
    component: ComponentDefinition;
}

function DraggableComponent({ component }: DraggableComponentProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `component-${component.type}`,
        data: { type: component.type, source: 'library' },
    });

    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative">
            <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`
                    flex flex-col items-center justify-center p-3 rounded-lg cursor-grab
                    bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                    hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md
                    transition-all duration-150
                    ${isDragging ? 'opacity-50 cursor-grabbing' : ''}
                `}
            >
                <div className="text-gray-700 dark:text-gray-300 mb-1">
                    {component.icon}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                    {component.label}
                </span>
            </div>

            {/* Tooltip */}
            {showTooltip && !isDragging && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                    <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap">
                        <div className="font-semibold mb-0.5">{component.label}</div>
                        <div className="text-gray-300 dark:text-gray-400">{component.description}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function ComponentLibrary() {
    const categories = [
        { key: 'layout', label: 'Layout' },
        { key: 'content', label: 'Content' },
        { key: 'media', label: 'Media' },
        { key: 'form', label: 'Forms' },
    ] as const;

    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
            <div className="space-y-6">
                {categories.map((category) => {
                    const categoryComponents = COMPONENTS.filter(
                        (c) => c.category === category.key
                    );

                    return (
                        <div key={category.key}>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                                {category.label}
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {categoryComponents.map((component) => (
                                    <DraggableComponent
                                        key={component.type}
                                        component={component}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Help Text */}
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-300">
                    💡 <strong>Tip:</strong> Drag components onto the canvas to add them to your page.
                    The component will snap to the nearest valid container.
                </p>
            </div>
        </div>
    );
}
