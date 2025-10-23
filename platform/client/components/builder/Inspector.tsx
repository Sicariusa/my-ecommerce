/**
 * Inspector.tsx - Enhanced Version
 * 
 * Property inspector and style editor for selected components.
 * Uses Radix UI Accordion for smooth collapsible sections.
 * Provides real-time editing with color pickers and enhanced inputs.
 * 
 * @module components/builder/Inspector
 */

'use client';

import React, { useState, useCallback } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { useBuilderStore } from '@/lib/stores/useBuilderStore';
import { ComponentNode } from '@/lib/schema';
import { ChevronDown, Palette, Layout, Type, Box, Sparkles, Code2, Upload, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { EnhanceWithAI } from './EnhanceWithAI';

interface InspectorProps {
    className?: string;
}

/**
 * Input field component with enhanced styling
 */
function InputField({
    label,
    value,
    onChange,
    type = 'text',
    placeholder = '',
}: {
    label: string;
    value: any;
    onChange: (value: any) => void;
    type?: string;
    placeholder?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-150"
            />
        </div>
    );
}

/**
 * Select field component with enhanced styling
 */
function SelectField({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: any;
    onChange: (value: any) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <select
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-150"
            >
                <option value="">Default</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

/**
 * Color picker component
 */
function ColorPicker({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="flex gap-2">
                <input
                    type="color"
                    value={value || '#000000'}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-150"
                />
            </div>
        </div>
    );
}

/**
 * Box model editor with visual representation
 */
function BoxModelEditor({
    node,
    updateNodeStyles,
}: {
    node: ComponentNode;
    updateNodeStyles: (nodeId: string, styles: Record<string, any>) => void;
}) {
    const styles = node.styles || {};

    const updateSpacing = (property: string, value: string) => {
        updateNodeStyles(node.id, { [property]: value });
    };

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <InputField
                    label="Margin"
                    value={styles.margin}
                    onChange={(v) => updateSpacing('margin', v)}
                    placeholder="0px"
                />
                <InputField
                    label="Padding"
                    value={styles.padding}
                    onChange={(v) => updateSpacing('padding', v)}
                    placeholder="0px"
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <InputField
                    label="Width"
                    value={styles.width}
                    onChange={(v) => updateSpacing('width', v)}
                    placeholder="auto"
                />
                <InputField
                    label="Height"
                    value={styles.height}
                    onChange={(v) => updateSpacing('height', v)}
                    placeholder="auto"
                />
            </div>
        </div>
    );
}

/**
 * Get component-specific enhancement suggestions
 */
function getComponentSuggestions(componentType: string, metadata?: ComponentNode['metadata']): string[] {
    const componentName = metadata?.name || componentType;
    
    switch (componentType) {
        case 'Section':
            if (componentName.toLowerCase().includes('header')) {
                return [
                    'Add a navigation menu with dropdown items',
                    'Include a logo and search bar',
                    'Add social media icons',
                    'Make it sticky/fixed on scroll',
                    'Add a mobile hamburger menu'
                ];
            } else if (componentName.toLowerCase().includes('footer')) {
                return [
                    'Add multiple columns with links',
                    'Include social media links',
                    'Add newsletter signup form',
                    'Include company information and copyright',
                    'Add contact information'
                ];
            } else if (componentName.toLowerCase().includes('hero')) {
                return [
                    'Add a compelling headline and subheading',
                    'Include a call-to-action button',
                    'Add background image or video',
                    'Include trust indicators or testimonials',
                    'Add animated elements or effects'
                ];
            } else {
                return [
                    'Add more content sections',
                    'Improve spacing and layout',
                    'Add background colors or images',
                    'Include interactive elements',
                    'Add responsive design improvements'
                ];
            }
        
        case 'Text':
            return [
                'Improve typography and readability',
                'Add emphasis with bold or italic text',
                'Include relevant links or call-to-actions',
                'Optimize for mobile readability',
                'Add text animations or effects'
            ];
        
        case 'Heading':
            return [
                'Improve hierarchy and structure',
                'Add better visual styling',
                'Include relevant keywords for SEO',
                'Add hover effects or animations',
                'Optimize font size and spacing'
            ];
        
        case 'Button':
            return [
                'Improve button styling and colors',
                'Add hover and focus states',
                'Include loading states',
                'Add icons or visual elements',
                'Improve accessibility and contrast'
            ];
        
        case 'Image':
            return [
                'Add image optimization and lazy loading',
                'Include image captions or alt text',
                'Add hover effects or overlays',
                'Implement responsive image sizing',
                'Add image galleries or carousels'
            ];
        
        case 'Grid':
            return [
                'Improve grid layout and spacing',
                'Add responsive breakpoints',
                'Include grid item animations',
                'Add drag-and-drop functionality',
                'Improve visual hierarchy'
            ];
        
        case 'List':
            return [
                'Add custom list styling',
                'Include interactive list items',
                'Add list animations',
                'Improve list hierarchy',
                'Add filtering or sorting options'
            ];
        
        case 'Form':
            return [
                'Add form validation and error handling',
                'Improve form styling and UX',
                'Include progress indicators',
                'Add form field animations',
                'Implement accessibility improvements'
            ];
        
        case 'Link':
            return [
                'Add hover effects and transitions',
                'Improve link styling and colors',
                'Include external link indicators',
                'Add link previews or tooltips',
                'Improve accessibility and focus states'
            ];
        
        case 'Container':
            return [
                'Improve container responsiveness',
                'Add better spacing and padding',
                'Include container animations',
                'Add background effects',
                'Improve content organization'
            ];
        
        case 'Div':
            return [
                'Add specific styling and layout',
                'Include interactive elements',
                'Add background or border effects',
                'Improve spacing and alignment',
                'Add hover or focus states'
            ];
        
        case 'Body':
            return [
                'Improve overall page layout',
                'Add global styling and themes',
                'Include page transitions',
                'Add loading states',
                'Improve accessibility and SEO'
            ];
        
        default:
            return [
                'Improve component styling',
                'Add interactive elements',
                'Enhance user experience',
                'Add animations or effects',
                'Improve accessibility'
            ];
    }
}

/**
 * Main Inspector component
 */
export function Inspector({ className = '' }: InspectorProps) {
    const selectedNodeId = useBuilderStore((state) => state.selectedNodeId);
    const selectedNode = useBuilderStore((state) =>
        selectedNodeId ? state.findNode(selectedNodeId) : null
    );
    const updateNodeProps = useBuilderStore((state) => state.updateNodeProps);
    const updateNodeStyles = useBuilderStore((state) => state.updateNodeStyles);
    const updateNodeMetadata = useBuilderStore((state) => state.updateNodeMetadata);
    const deleteNode = useBuilderStore((state) => state.deleteNode);
    const project = useBuilderStore((state) => state.project);
    const activePage = useBuilderStore((state) => state.getActivePage());

    const [activeSection, setActiveSection] = useState<string[]>([
        'properties',
        'ai-enhancement',
        'layout',
        'spacing',
    ]);
    const [imageUploadMode, setImageUploadMode] = useState<'url' | 'upload'>(
        'url'
    );
    const [isUploading, setIsUploading] = useState(false);

    // Get all section IDs from current page for anchor links
    const getSectionIds = useCallback(() => {
        if (!activePage) return [];
        const sections: { id: string; name: string }[] = [];

        const findSections = (nodes: ComponentNode[]) => {
            nodes.forEach(node => {
                if (node.type === 'Section' && node.id) {
                    sections.push({
                        id: node.id,
                        name: node.metadata?.name || node.id
                    });
                }
                if (node.children) {
                    findSections(node.children);
                }
            });
        };

        findSections(activePage.tree);
        return sections;
    }, [activePage]);

    // Handle image upload
    const handleImageUpload = useCallback(async (file: File) => {
        if (!selectedNode) return;

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Only PNG, JPG, JPEG, and WebP are allowed.');
            return;
        }

        // Validate file size (4MB)
        const maxSize = 4 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('File size exceeds 4MB limit.');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('projectId', project?.id || 'default');

            const response = await fetch('/api/files/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            const data = await response.json();
            updateNodeProps(selectedNode.id, {
                src: data.file.url,
                alt: file.name
            });
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    }, [selectedNode, project, updateNodeProps]);

    if (!selectedNode) {
        return (
            <div className={`h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 ${className}`}>
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Box className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No component selected
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Select a component to edit its properties
                    </p>
                </div>
            </div>
        );
    }

    const props = selectedNode.props || {};
    const styles = selectedNode.styles || {};

    return (
        <div className={`h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {selectedNode.type}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
                            {selectedNode.id}
                        </p>
                    </div>
                    <button
                        onClick={() => deleteNode(selectedNode.id)}
                        className="px-3 py-1.5 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <Accordion.Root
                    type="multiple"
                    value={activeSection}
                    onValueChange={setActiveSection}
                    className="w-full"
                >
                    {/* Properties Section */}
                    <Accordion.Item value="properties" className="border-b border-gray-200 dark:border-gray-700">
                        <Accordion.Header>
                            <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        Properties
                                    </span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="px-4 py-3 space-y-3 data-[state=open]:animate-slide-in">
                            {/* Component-specific properties */}
                            {selectedNode.type === 'Text' && (
                                <>
                                    <InputField
                                        label="Content"
                                        value={props.text}
                                        onChange={(v) => updateNodeProps(selectedNode.id, { text: v })}
                                        placeholder="Enter text..."
                                    />
                                    <SelectField
                                        label="Tag"
                                        value={props.tag}
                                        onChange={(v) => updateNodeProps(selectedNode.id, { tag: v })}
                                        options={[
                                            { value: 'p', label: 'Paragraph' },
                                            { value: 'h1', label: 'Heading 1' },
                                            { value: 'h2', label: 'Heading 2' },
                                            { value: 'h3', label: 'Heading 3' },
                                            { value: 'span', label: 'Span' },
                                        ]}
                                    />
                                </>
                            )}
                            {selectedNode.type === 'Image' && (
                                <>
                                    {/* Image Source Mode Toggle */}
                                    <div className="flex gap-2 mb-3">
                                        <button
                                            onClick={() => setImageUploadMode('url')}
                                            className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${imageUploadMode === 'url'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            <LinkIcon className="w-4 h-4 mx-auto" />
                                        </button>
                                        <button
                                            onClick={() => setImageUploadMode('upload')}
                                            className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${imageUploadMode === 'upload'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            <Upload className="w-4 h-4 mx-auto" />
                                        </button>
                                    </div>

                                    {imageUploadMode === 'url' ? (
                                        <InputField
                                            label="Image URL"
                                            value={props.src}
                                            onChange={(v) => updateNodeProps(selectedNode.id, { src: v })}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    ) : (
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                Upload Image
                                            </label>
                                            <input
                                                type="file"
                                                accept=".png,.jpg,.jpeg,.webp"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleImageUpload(file);
                                                }}
                                                disabled={isUploading}
                                                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-150 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30"
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PNG, JPG, JPEG, WebP • Max 4MB
                                            </p>
                                            {isUploading && (
                                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                                    Uploading...
                                                </p>
                                            )}
                                            {props.src && (
                                                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current:</p>
                                                    <p className="text-xs text-gray-900 dark:text-white truncate">{props.src}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <InputField
                                        label="Alt Text"
                                        value={props.alt}
                                        onChange={(v) => updateNodeProps(selectedNode.id, { alt: v })}
                                        placeholder="Image description"
                                    />
                                </>
                            )}
                            {selectedNode.type === 'Button' && (
                                <>
                                    <InputField
                                        label="Button Text"
                                        value={props.text}
                                        onChange={(v) => updateNodeProps(selectedNode.id, { text: v })}
                                        placeholder="Click me"
                                    />
                                    <SelectField
                                        label="Type"
                                        value={props.buttonType || 'button'}
                                        onChange={(v) => updateNodeProps(selectedNode.id, { buttonType: v })}
                                        options={[
                                            { value: 'button', label: 'Button' },
                                            { value: 'submit', label: 'Submit' },
                                            { value: 'reset', label: 'Reset' },
                                        ]}
                                    />

                                    {/* Link Settings */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                            Link Settings
                                        </label>
                                        <SelectField
                                            label="Link Type"
                                            value={props.linkType || 'none'}
                                            onChange={(v) => {
                                                updateNodeProps(selectedNode.id, {
                                                    linkType: v,
                                                    linkTarget: ''
                                                });
                                            }}
                                            options={[
                                                { value: 'none', label: 'No Link' },
                                                { value: 'external', label: 'External URL' },
                                                { value: 'page', label: 'Internal Page' },
                                                { value: 'anchor', label: 'Section Anchor' },
                                            ]}
                                        />

                                        {props.linkType === 'external' && (
                                            <InputField
                                                label="URL"
                                                value={props.linkTarget}
                                                onChange={(v) => {
                                                    // Validate https://
                                                    if (v && !v.startsWith('http://') && !v.startsWith('https://')) {
                                                        toast.error('URL must start with https:// or http://');
                                                        return;
                                                    }
                                                    updateNodeProps(selectedNode.id, { linkTarget: v });
                                                }}
                                                placeholder="https://example.com"
                                            />
                                        )}

                                        {props.linkType === 'page' && project?.pages && (
                                            <SelectField
                                                label="Target Page"
                                                value={props.linkTarget}
                                                onChange={(v) => updateNodeProps(selectedNode.id, { linkTarget: v })}
                                                options={project.pages.map(page => ({
                                                    value: page.id,
                                                    label: page.name
                                                }))}
                                            />
                                        )}

                                        {props.linkType === 'anchor' && (
                                            <SelectField
                                                label="Target Section"
                                                value={props.linkTarget}
                                                onChange={(v) => updateNodeProps(selectedNode.id, { linkTarget: v })}
                                                options={getSectionIds().map(section => ({
                                                    value: section.id,
                                                    label: section.name
                                                }))}
                                            />
                                        )}

                                        {props.linkType === 'external' && (
                                            <div className="mt-2">
                                                <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                                                    <input
                                                        type="checkbox"
                                                        checked={props.openInNewTab || false}
                                                        onChange={(e) => updateNodeProps(selectedNode.id, {
                                                            openInNewTab: e.target.checked
                                                        })}
                                                        className="rounded"
                                                    />
                                                    Open in new tab
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                            {selectedNode.type === 'Grid' && (
                                <>
                                    {/* Edit Mode Toggle */}
                                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
                                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <input
                                                type="checkbox"
                                                checked={selectedNode.metadata?.editMode || false}
                                                onChange={(e) => {
                                                    updateNodeMetadata(selectedNode.id, {
                                                        editMode: e.target.checked
                                                    });
                                                }}
                                                className="rounded"
                                            />
                                            Edit Mode (Show Grid Editor)
                                        </label>
                                    </div>

                                    {/* Grid Configuration */}
                                    <InputField
                                        label="Rows"
                                        type="number"
                                        value={props.gridConfig?.rows || 2}
                                        onChange={(v) => updateNodeProps(selectedNode.id, {
                                            gridConfig: { ...props.gridConfig, rows: parseInt(v) || 2 }
                                        })}
                                        placeholder="2"
                                    />
                                    <InputField
                                        label="Columns"
                                        type="number"
                                        value={props.gridConfig?.cols || 2}
                                        onChange={(v) => updateNodeProps(selectedNode.id, {
                                            gridConfig: { ...props.gridConfig, cols: parseInt(v) || 2 }
                                        })}
                                        placeholder="2"
                                    />
                                    <InputField
                                        label="Gap (px)"
                                        type="number"
                                        value={props.gridConfig?.gap || 16}
                                        onChange={(v) => updateNodeProps(selectedNode.id, {
                                            gridConfig: { ...props.gridConfig, gap: parseInt(v) || 16 }
                                        })}
                                        placeholder="16"
                                    />
                                    <SelectField
                                        label="Justify Items"
                                        value={styles.justifyItems || 'stretch'}
                                        onChange={(v) => updateNodeStyles(selectedNode.id, { justifyItems: v })}
                                        options={[
                                            { value: 'stretch', label: 'Stretch' },
                                            { value: 'start', label: 'Start' },
                                            { value: 'end', label: 'End' },
                                            { value: 'center', label: 'Center' },
                                        ]}
                                    />
                                    <SelectField
                                        label="Align Items"
                                        value={styles.alignItems || 'stretch'}
                                        onChange={(v) => updateNodeStyles(selectedNode.id, { alignItems: v })}
                                        options={[
                                            { value: 'stretch', label: 'Stretch' },
                                            { value: 'start', label: 'Start' },
                                            { value: 'end', label: 'End' },
                                            { value: 'center', label: 'Center' },
                                        ]}
                                    />
                                </>
                            )}
                            {selectedNode.type === 'List' && (
                                <>
                                    {/* Edit Mode Toggle */}
                                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
                                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <input
                                                type="checkbox"
                                                checked={selectedNode.metadata?.editMode || false}
                                                onChange={(e) => {
                                                    updateNodeMetadata(selectedNode.id, {
                                                        editMode: e.target.checked
                                                    });
                                                }}
                                                className="rounded"
                                            />
                                            Edit Mode (Show List Editor)
                                        </label>
                                    </div>

                                    {/* List Configuration */}
                                    <SelectField
                                        label="List Type"
                                        value={props.listConfig?.type || 'unordered'}
                                        onChange={(v) => updateNodeProps(selectedNode.id, {
                                            listConfig: { ...props.listConfig, type: v }
                                        })}
                                        options={[
                                            { value: 'ordered', label: 'Numbered (1, 2, 3)' },
                                            { value: 'unordered', label: 'Bullets (•)' },
                                            { value: 'none', label: 'Plain (No markers)' },
                                        ]}
                                    />
                                    <InputField
                                        label="Indentation (px)"
                                        type="number"
                                        value={styles.paddingLeft || 24}
                                        onChange={(v) => updateNodeStyles(selectedNode.id, {
                                            paddingLeft: `${parseInt(v) || 24}px`
                                        })}
                                        placeholder="24"
                                    />
                                </>
                            )}
                            {selectedNode.type === 'Link' && (
                                <>
                                    <InputField
                                        label="Display Text"
                                        value={props.displayText}
                                        onChange={(v) => updateNodeProps(selectedNode.id, { displayText: v })}
                                        placeholder="Click here"
                                    />
                                    <InputField
                                        label="URL / Href"
                                        value={props.href}
                                        onChange={(v) => updateNodeProps(selectedNode.id, { href: v })}
                                        placeholder="#"
                                    />
                                    <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={props.openInNewTab || false}
                                            onChange={(e) => updateNodeProps(selectedNode.id, {
                                                openInNewTab: e.target.checked
                                            })}
                                            className="rounded"
                                        />
                                        Open in new tab
                                    </label>
                                </>
                            )}
                            {selectedNode.type === 'Form' && (
                                <>
                                    {/* Edit Mode Toggle */}
                                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
                                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <input
                                                type="checkbox"
                                                checked={selectedNode.metadata?.editMode || false}
                                                onChange={(e) => {
                                                    updateNodeMetadata(selectedNode.id, {
                                                        editMode: e.target.checked
                                                    });
                                                }}
                                                className="rounded"
                                            />
                                            Edit Mode (Show Form Builder)
                                        </label>
                                    </div>

                                    {/* Form Configuration */}
                                    <SelectField
                                        label="Submit Action"
                                        value={props.formConfig?.submitAction || 'email'}
                                        onChange={(v) => updateNodeProps(selectedNode.id, {
                                            formConfig: { ...props.formConfig, submitAction: v }
                                        })}
                                        options={[
                                            { value: 'email', label: 'Send Email' },
                                            { value: 'webhook', label: 'Webhook URL' },
                                            { value: 'custom', label: 'Custom Action' },
                                        ]}
                                    />

                                    {props.formConfig?.submitAction === 'email' && (
                                        <InputField
                                            label="Email Destination"
                                            type="email"
                                            value={props.formConfig?.emailTo || ''}
                                            onChange={(v) => updateNodeProps(selectedNode.id, {
                                                formConfig: { ...props.formConfig, emailTo: v }
                                            })}
                                            placeholder="contact@example.com"
                                        />
                                    )}

                                    {props.formConfig?.submitAction === 'webhook' && (
                                        <InputField
                                            label="Webhook URL"
                                            value={props.formConfig?.webhookUrl || ''}
                                            onChange={(v) => updateNodeProps(selectedNode.id, {
                                                formConfig: { ...props.formConfig, webhookUrl: v }
                                            })}
                                            placeholder="https://api.example.com/form"
                                        />
                                    )}

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                            Success Message
                                        </label>
                                        <textarea
                                            value={props.formConfig?.successMessage || 'Thank you! Your form has been submitted.'}
                                            onChange={(e) => updateNodeProps(selectedNode.id, {
                                                formConfig: { ...props.formConfig, successMessage: e.target.value }
                                            })}
                                            rows={2}
                                            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-150"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                            Error Message
                                        </label>
                                        <textarea
                                            value={props.formConfig?.errorMessage || 'Something went wrong. Please try again.'}
                                            onChange={(e) => updateNodeProps(selectedNode.id, {
                                                formConfig: { ...props.formConfig, errorMessage: e.target.value }
                                            })}
                                            rows={2}
                                            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-150"
                                        />
                                    </div>

                                    <InputField
                                        label="Submit Button Text"
                                        value={props.formConfig?.submitButtonText || 'Submit'}
                                        onChange={(v) => updateNodeProps(selectedNode.id, {
                                            formConfig: { ...props.formConfig, submitButtonText: v }
                                        })}
                                        placeholder="Submit"
                                    />
                                </>
                            )}
                        </Accordion.Content>
                    </Accordion.Item>

                    {/* AI Enhancement Section */}
                    <Accordion.Item value="ai-enhancement" className="border-b border-gray-200 dark:border-gray-700">
                        <Accordion.Header>
                            <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        AI Enhancement
                                    </span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="px-4 py-3 data-[state=open]:animate-slide-in">
                            <div className="space-y-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Enhance this {selectedNode.type.toLowerCase()} component with AI-powered suggestions
                                </p>
                                <EnhanceWithAI 
                                    project={project}
                                    onProjectEnhanced={(enhancedProject) => {
                                        // Update the project in the store
                                        useBuilderStore.getState().setProject(enhancedProject);
                                        toast.success('Component enhanced successfully!');
                                    }}
                                    customSuggestions={getComponentSuggestions(selectedNode.type, selectedNode.metadata)}
                                />
                            </div>
                        </Accordion.Content>
                    </Accordion.Item>

                    {/* Layout Section */}
                    <Accordion.Item value="layout" className="border-b border-gray-200 dark:border-gray-700">
                        <Accordion.Header>
                            <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group">
                                <div className="flex items-center gap-2">
                                    <Layout className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        Layout
                                    </span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="px-4 py-3 space-y-3">
                            <SelectField
                                label="Display"
                                value={styles.display}
                                onChange={(v) => updateNodeStyles(selectedNode.id, { display: v })}
                                options={[
                                    { value: 'block', label: 'Block' },
                                    { value: 'inline-block', label: 'Inline Block' },
                                    { value: 'flex', label: 'Flex' },
                                    { value: 'grid', label: 'Grid' },
                                    { value: 'none', label: 'None' },
                                ]}
                            />
                            {styles.display === 'flex' && (
                                <>
                                    <SelectField
                                        label="Flex Direction"
                                        value={styles.flexDirection}
                                        onChange={(v) => updateNodeStyles(selectedNode.id, { flexDirection: v })}
                                        options={[
                                            { value: 'row', label: 'Row' },
                                            { value: 'column', label: 'Column' },
                                            { value: 'row-reverse', label: 'Row Reverse' },
                                            { value: 'column-reverse', label: 'Column Reverse' },
                                        ]}
                                    />
                                    <SelectField
                                        label="Justify Content"
                                        value={styles.justifyContent}
                                        onChange={(v) => updateNodeStyles(selectedNode.id, { justifyContent: v })}
                                        options={[
                                            { value: 'flex-start', label: 'Start' },
                                            { value: 'center', label: 'Center' },
                                            { value: 'flex-end', label: 'End' },
                                            { value: 'space-between', label: 'Space Between' },
                                            { value: 'space-around', label: 'Space Around' },
                                        ]}
                                    />
                                    <SelectField
                                        label="Align Items"
                                        value={styles.alignItems}
                                        onChange={(v) => updateNodeStyles(selectedNode.id, { alignItems: v })}
                                        options={[
                                            { value: 'flex-start', label: 'Start' },
                                            { value: 'center', label: 'Center' },
                                            { value: 'flex-end', label: 'End' },
                                            { value: 'stretch', label: 'Stretch' },
                                        ]}
                                    />
                                    <InputField
                                        label="Gap"
                                        value={styles.gap}
                                        onChange={(v) => updateNodeStyles(selectedNode.id, { gap: v })}
                                        placeholder="8px"
                                    />
                                </>
                            )}
                        </Accordion.Content>
                    </Accordion.Item>

                    {/* Spacing Section */}
                    <Accordion.Item value="spacing" className="border-b border-gray-200 dark:border-gray-700">
                        <Accordion.Header>
                            <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group">
                                <div className="flex items-center gap-2">
                                    <Box className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        Box Model
                                    </span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="px-4 py-3">
                            <BoxModelEditor node={selectedNode} updateNodeStyles={updateNodeStyles} />
                        </Accordion.Content>
                    </Accordion.Item>

                    {/* Typography Section */}
                    <Accordion.Item value="typography" className="border-b border-gray-200 dark:border-gray-700">
                        <Accordion.Header>
                            <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group">
                                <div className="flex items-center gap-2">
                                    <Type className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        Typography
                                    </span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="px-4 py-3 space-y-3">
                            <SelectField
                                label="Font Family"
                                value={styles.fontFamily}
                                onChange={(v) => updateNodeStyles(selectedNode.id, { fontFamily: v })}
                                options={[
                                    { value: 'system-ui', label: 'System UI' },
                                    { value: 'serif', label: 'Serif' },
                                    { value: 'sans-serif', label: 'Sans Serif' },
                                    { value: 'monospace', label: 'Monospace' },
                                ]}
                            />
                            <InputField
                                label="Font Size"
                                value={styles.fontSize}
                                onChange={(v) => updateNodeStyles(selectedNode.id, { fontSize: v })}
                                placeholder="16px"
                            />
                            <SelectField
                                label="Font Weight"
                                value={styles.fontWeight}
                                onChange={(v) => updateNodeStyles(selectedNode.id, { fontWeight: v })}
                                options={[
                                    { value: '300', label: 'Light' },
                                    { value: '400', label: 'Normal' },
                                    { value: '500', label: 'Medium' },
                                    { value: '600', label: 'Semibold' },
                                    { value: '700', label: 'Bold' },
                                ]}
                            />
                            <ColorPicker
                                label="Text Color"
                                value={styles.color}
                                onChange={(v) => updateNodeStyles(selectedNode.id, { color: v })}
                            />
                            <SelectField
                                label="Text Align"
                                value={styles.textAlign}
                                onChange={(v) => updateNodeStyles(selectedNode.id, { textAlign: v })}
                                options={[
                                    { value: 'left', label: 'Left' },
                                    { value: 'center', label: 'Center' },
                                    { value: 'right', label: 'Right' },
                                    { value: 'justify', label: 'Justify' },
                                ]}
                            />
                        </Accordion.Content>
                    </Accordion.Item>

                    {/* Background Section */}
                    <Accordion.Item value="background" className="border-b border-gray-200 dark:border-gray-700">
                        <Accordion.Header>
                            <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group">
                                <div className="flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        Background & Border
                                    </span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="px-4 py-3 space-y-3">
                            <ColorPicker
                                label="Background Color"
                                value={styles.backgroundColor}
                                onChange={(v) => updateNodeStyles(selectedNode.id, { backgroundColor: v })}
                            />
                            <InputField
                                label="Border Radius"
                                value={styles.borderRadius}
                                onChange={(v) => updateNodeStyles(selectedNode.id, { borderRadius: v })}
                                placeholder="0px"
                            />
                            <InputField
                                label="Border"
                                value={styles.border}
                                onChange={(v) => updateNodeStyles(selectedNode.id, { border: v })}
                                placeholder="1px solid #ccc"
                            />
                            <InputField
                                label="Box Shadow"
                                value={styles.boxShadow}
                                onChange={(v) => updateNodeStyles(selectedNode.id, { boxShadow: v })}
                                placeholder="0 2px 4px rgba(0,0,0,0.1)"
                            />
                        </Accordion.Content>
                    </Accordion.Item>

                    {/* Advanced Section */}
                    <Accordion.Item value="advanced" className="border-b border-gray-200 dark:border-gray-700">
                        <Accordion.Header>
                            <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group">
                                <div className="flex items-center gap-2">
                                    <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        Advanced
                                    </span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="px-4 py-3 space-y-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Custom Styles (JSON)
                                </label>
                                <textarea
                                    value={JSON.stringify(styles, null, 2)}
                                    onChange={(e) => {
                                        try {
                                            const parsed = JSON.parse(e.target.value);
                                            updateNodeStyles(selectedNode.id, parsed);
                                        } catch (err) {
                                            // Invalid JSON, ignore
                                        }
                                    }}
                                    className="px-3 py-2 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white h-32 resize-none"
                                />
                            </div>
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion.Root>
            </div>
        </div>
    );
}

export default Inspector;
