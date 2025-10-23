/**
 * ContextMenu.tsx
 * 
 * Reusable context menu component for right-click interactions.
 * Supports positioning, custom menu items, and keyboard navigation.
 * 
 * @module components/builder/ContextMenu
 */

'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ContextMenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'default' | 'danger';
    divider?: boolean;
}

export interface ContextMenuProps {
    x: number;
    y: number;
    items: ContextMenuItem[];
    onClose: () => void;
}

/**
 * ContextMenu component
 * Renders a positioned context menu with custom items
 */
export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        // Small delay to prevent immediate closure from the same click that opened it
        setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 0);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Adjust position if menu would go off-screen
    useEffect(() => {
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let adjustedX = x;
            let adjustedY = y;

            if (rect.right > viewportWidth) {
                adjustedX = viewportWidth - rect.width - 10;
            }

            if (rect.bottom > viewportHeight) {
                adjustedY = viewportHeight - rect.height - 10;
            }

            menuRef.current.style.left = `${adjustedX}px`;
            menuRef.current.style.top = `${adjustedY}px`;
        }
    }, [x, y]);

    const handleItemClick = useCallback((item: ContextMenuItem) => {
        if (!item.disabled) {
            item.onClick();
            onClose();
        }
    }, [onClose]);

    const menu = (
        <div
            ref={menuRef}
            className="fixed z-[9999] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[200px] animate-fade-in"
            style={{ left: x, top: y }}
        >
            {items.map((item, index) => (
                <React.Fragment key={item.id}>
                    {item.divider && index > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                    )}
                    <button
                        onClick={() => handleItemClick(item)}
                        disabled={item.disabled}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors
                            ${item.disabled
                                ? 'opacity-50 cursor-not-allowed'
                                : item.variant === 'danger'
                                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }
                        `}
                    >
                        {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
                        <span className="flex-1 text-left">{item.label}</span>
                    </button>
                </React.Fragment>
            ))}
        </div>
    );

    return createPortal(menu, document.body);
}

export default ContextMenu;
