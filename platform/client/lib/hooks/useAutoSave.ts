/**
 * useAutoSave Hook
 * 
 * Automatically saves project state to the server with debouncing.
 * Provides save status and manual save trigger.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useBuilderStore } from '../stores/useBuilderStore';
import toast from 'react-hot-toast';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions {
    enabled?: boolean;
    interval?: number; // milliseconds
    onSave?: (success: boolean) => void;
}

export function useAutoSave(options: UseAutoSaveOptions = {}) {
    const {
        enabled = true,
        interval = 5000, // 5 seconds default
        onSave,
    } = options;

    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const project = useBuilderStore((state) => state.project);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastProjectRef = useRef<string>('');

    // Manual save function
    const saveProject = useCallback(async () => {
        if (!project) {
            return { success: false, error: 'No project to save' };
        }

        setSaveStatus('saving');

        try {
            const response = await fetch('/api/projects/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project,
                    environment: 'builder' // Always save builder edits to builderSite.json
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save project');
            }

            const data = await response.json();
            setSaveStatus('saved');
            setLastSaved(new Date());
            onSave?.(true);

            // Reset to idle after 2 seconds
            setTimeout(() => setSaveStatus('idle'), 2000);

            return { success: true, data };
        } catch (error) {
            console.error('Save error:', error);
            setSaveStatus('error');
            onSave?.(false);

            // Reset to idle after 3 seconds
            setTimeout(() => setSaveStatus('idle'), 3000);

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }, [project, onSave]);

    // Auto-save effect
    useEffect(() => {
        if (!enabled || !project) return;

        // Serialize project for comparison
        const currentProject = JSON.stringify(project);

        // Check if project has changed
        if (currentProject === lastProjectRef.current) {
            return; // No changes, don't save
        }

        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Set new timeout for auto-save
        saveTimeoutRef.current = setTimeout(() => {
            lastProjectRef.current = currentProject;
            saveProject();
        }, interval);

        // Cleanup
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [project, enabled, interval, saveProject]);

    // Manual trigger
    const triggerSave = useCallback(async () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        return await saveProject();
    }, [saveProject]);

    return {
        saveStatus,
        lastSaved,
        triggerSave,
    };
}
