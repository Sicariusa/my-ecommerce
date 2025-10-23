/**
 * GridEditor Component
 * 
 * Advanced grid editing interface with visual cell manipulation.
 * Allows adding/removing rows and columns with live preview.
 */

'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { ComponentNode } from '@/lib/schema';

interface GridEditorProps {
    node: ComponentNode;
    onUpdateGrid: (rows: number, cols: number) => void;
    children: React.ReactNode;
}

export function GridEditor({ node, onUpdateGrid, children }: GridEditorProps) {
    const gridConfig = node.props.gridConfig || { rows: 2, cols: 2, gap: 16 };
    const [rows, setRows] = useState(gridConfig.rows);
    const [cols, setCols] = useState(gridConfig.cols);

    const handleAddRow = () => {
        const newRows = rows + 1;
        setRows(newRows);
        onUpdateGrid(newRows, cols);
    };

    const handleRemoveRow = () => {
        if (rows > 1) {
            const newRows = rows - 1;
            setRows(newRows);
            onUpdateGrid(newRows, cols);
        }
    };

    const handleAddCol = () => {
        const newCols = cols + 1;
        setCols(newCols);
        onUpdateGrid(rows, newCols);
    };

    const handleRemoveCol = () => {
        if (cols > 1) {
            const newCols = cols - 1;
            setCols(newCols);
            onUpdateGrid(rows, newCols);
        }
    };

    return (
        <div className="relative">
            {/* Grid Controls Overlay */}
            <div className="absolute -top-10 left-0 flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 shadow-lg z-50">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Rows:</span>
                <button
                    onClick={handleRemoveRow}
                    disabled={rows <= 1}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove Row"
                >
                    <Minus className="w-3 h-3 text-red-600" />
                </button>
                <span className="text-sm font-mono text-gray-900 dark:text-white">{rows}</span>
                <button
                    onClick={handleAddRow}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Add Row"
                >
                    <Plus className="w-3 h-3 text-green-600" />
                </button>

                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-2" />

                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Cols:</span>
                <button
                    onClick={handleRemoveCol}
                    disabled={cols <= 1}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove Column"
                >
                    <Minus className="w-3 h-3 text-red-600" />
                </button>
                <span className="text-sm font-mono text-gray-900 dark:text-white">{cols}</span>
                <button
                    onClick={handleAddCol}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Add Column"
                >
                    <Plus className="w-3 h-3 text-green-600" />
                </button>
            </div>

            {/* Grid Content with Visual Guides */}
            <div className="relative">
                {children}

                {/* Grid Cell Outlines */}
                <div
                    className="absolute inset-0 pointer-events-none grid"
                    style={{
                        gridTemplateRows: `repeat(${rows}, 1fr)`,
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gap: `${gridConfig.gap}px`,
                    }}
                >
                    {Array.from({ length: rows * cols }).map((_, index) => (
                        <div
                            key={index}
                            className="border-2 border-dashed border-blue-400 bg-blue-50/10 dark:bg-blue-900/10 rounded"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
