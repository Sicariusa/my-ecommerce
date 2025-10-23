'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ComponentNode } from '@/lib/schema';

/**
 * DroppableNode - Wraps rendered components to make them droppable containers
 * 
 * Features:
 * - Shows drop zone indicator when dragging over
 * - Handles container detection
 * - Provides visual feedback
 */

interface DroppableNodeProps {
    node: ComponentNode;
    children: React.ReactNode;
    isContainer?: boolean;
    isInvalidDrop?: boolean;
}

export function DroppableNode({ node, children, isContainer = false, isInvalidDrop = false }: DroppableNodeProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: `drop-zone-${node.id}`,
        data: {
            type: 'node-container',
            nodeId: node.id,
            nodeType: node.type,
            accepts: ['component', 'node'],
        },
        disabled: !isContainer && node.type !== 'Body' && node.type !== 'Section' && node.type !== 'Div' && node.type !== 'Container',
    });

    // Only container types should show drop indicators
    const containerTypes = ['Body', 'Section', 'Div', 'Container', 'FlexRow', 'Grid', 'Form'];
    const showDropIndicator = containerTypes.includes(node.type);

    return (
        <div
            ref={showDropIndicator ? setNodeRef : undefined}
            className="relative"
            style={{ position: 'relative' }}
        >
            {children}

            {/* Drop zone indicator */}
            {isOver && showDropIndicator && !isInvalidDrop && (
                <div className="absolute inset-0 pointer-events-none z-50">
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded animate-pulse">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                            Drop here
                        </div>
                    </div>
                </div>
            )}

            {/* Invalid drop indicator */}
            {isOver && showDropIndicator && isInvalidDrop && (
                <div className="absolute inset-0 pointer-events-none z-50">
                    <div className="absolute inset-0 bg-red-500 bg-opacity-10 border-2 border-red-500 border-dashed rounded animate-pulse">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg whitespace-nowrap">
                            ⚠️ Invalid drop
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
