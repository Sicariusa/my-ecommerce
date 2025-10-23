/**
 * Tooltip.tsx
 * 
 * Simple tooltip component for showing helpful hints.
 * 
 * @module components/builder/Tooltip
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    className?: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export function Tooltip({
    content,
    children,
    className = '',
    side = 'top',
    delay = 300,
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const sideClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {isVisible && (
                <div
                    className={`
                        absolute z-50 px-3 py-1.5 text-xs font-medium text-white 
                        bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg
                        whitespace-nowrap pointer-events-none
                        animate-fade-in
                        ${sideClasses[side]}
                    `}
                >
                    {content}
                    {/* Arrow */}
                    <div
                        className={`
                            absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45
                            ${side === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
                            ${side === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
                            ${side === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
                            ${side === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
                        `}
                    />
                </div>
            )}
        </div>
    );
}
