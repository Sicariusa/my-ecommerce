/**
 * ListEditorConnector Component
 * 
 * Wrapper component that connects ListEditor to the builder store.
 * Handles saving list changes and exiting edit mode.
 */

'use client';

import React from 'react';
import { ComponentNode } from '@/lib/schema';
import { useBuilderStore } from '@/lib/stores/useBuilderStore';
import { ListEditor } from './ListEditor';

interface ListEditorConnectorProps {
    node: ComponentNode;
}

export function ListEditorConnector({ node }: ListEditorConnectorProps) {
    const updateNodeProps = useBuilderStore((state) => state.updateNodeProps);
    const updateNodeMetadata = useBuilderStore((state) => state.updateNodeMetadata);

    const handleUpdateList = (items: any[]) => {
        // Update the node's listConfig with new items
        updateNodeProps(node.id, {
            listConfig: {
                ...node.props.listConfig,
                items,
            },
        });
    };

    const handleSave = () => {
        // Exit edit mode
        updateNodeMetadata(node.id, {
            editMode: false,
        });
    };

    return (
        <ListEditor
            node={node}
            onUpdateList={handleUpdateList}
            onSave={handleSave}
        />
    );
}
