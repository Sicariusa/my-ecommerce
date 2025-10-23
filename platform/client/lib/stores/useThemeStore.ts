/**
 * Theme Store
 * 
 * Manages theme state (light/dark mode) and UI preferences for the builder.
 * Persists theme selection to localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';
export type DevicePreset = 'desktop' | 'tablet' | 'mobile';

export const DEVICE_PRESETS = {
    desktop: { width: '100%', height: '100%', label: 'Desktop' },
    tablet: { width: '768px', height: '1024px', label: 'Tablet' },
    mobile: { width: '375px', height: '667px', label: 'Mobile' },
} as const;

interface ThemeState {
    theme: Theme;
    showGrid: boolean;
    zoomLevel: number;
    devicePreset: DevicePreset;

    // Actions
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    setShowGrid: (show: boolean) => void;
    toggleGrid: () => void;
    setZoomLevel: (level: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
    setDevicePreset: (preset: DevicePreset) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'light',
            showGrid: false,
            zoomLevel: 100,
            devicePreset: 'desktop',

            setTheme: (theme) => {
                set({ theme });
                // Update document class for Tailwind dark mode
                if (typeof document !== 'undefined') {
                    if (theme === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                }
            },

            toggleTheme: () => {
                set((state) => {
                    const newTheme = state.theme === 'light' ? 'dark' : 'light';
                    // Update document class
                    if (typeof document !== 'undefined') {
                        if (newTheme === 'dark') {
                            document.documentElement.classList.add('dark');
                        } else {
                            document.documentElement.classList.remove('dark');
                        }
                    }
                    return { theme: newTheme };
                });
            },

            setShowGrid: (show) => set({ showGrid: show }),

            toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

            setZoomLevel: (level) => {
                const clampedLevel = Math.max(25, Math.min(200, level));
                set({ zoomLevel: clampedLevel });
            },

            zoomIn: () => {
                set((state) => ({
                    zoomLevel: Math.min(200, state.zoomLevel + 10),
                }));
            },

            zoomOut: () => {
                set((state) => ({
                    zoomLevel: Math.max(25, state.zoomLevel - 10),
                }));
            },

            resetZoom: () => set({ zoomLevel: 100 }),

            setDevicePreset: (preset) => set({ devicePreset: preset }),
        }),
        {
            name: 'theme-store',
        }
    )
);
