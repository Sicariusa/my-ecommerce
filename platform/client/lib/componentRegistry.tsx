/**
 * componentRegistry.tsx
 * 
 * Component registry for the website builder.
 * Maps component type strings to React components and provides rendering utilities.
 * Includes built-in components: Div, Section, Text, Image, Button, ComponentPlaceholder.
 * 
 * @module lib/componentRegistry
 */

import React, { CSSProperties } from 'react';
import { ComponentNode } from './schema';
import { DroppableNode } from '@/components/builder/DroppableNode';
import { GridEditor } from '@/components/builder/GridEditor';
import { ListEditorConnector } from '@/components/builder/ListEditorConnector';
import { FormBuilder } from '@/components/builder/FormBuilder';

/**
 * Props interface for all builder components
 */
interface BuilderComponentProps {
    node: ComponentNode;
    children?: React.ReactNode;
    isSelected?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    onContextMenu?: (e: React.MouseEvent) => void;
}

/**
 * Generic Div component
 */
export function Div({ node, children, isSelected, onClick, onContextMenu }: BuilderComponentProps) {
    return (
        <div
            data-node-id={node.id}
            data-node-type={node.type}
            style={{
                ...node.styles,
                outline: isSelected ? '2px solid #3b82f6' : undefined,
                outlineOffset: isSelected ? '2px' : undefined,
            } as CSSProperties}
            onClick={onClick}
            onContextMenu={onContextMenu}
            {...node.props}
        >
            {children}
        </div>
    );
}

/**
 * Section component (semantic HTML)
 */
export function Section({ node, children, isSelected, onClick, onContextMenu }: BuilderComponentProps) {
    return (
        <section
            data-node-id={node.id}
            data-node-type={node.type}
            style={{
                ...node.styles,
                outline: isSelected ? '2px solid #3b82f6' : undefined,
                outlineOffset: isSelected ? '2px' : undefined,
            } as CSSProperties}
            onClick={onClick}
            onContextMenu={onContextMenu}
            {...node.props}
        >
            {children}
        </section>
    );
}

/**
 * Text component (supports different HTML tags)
 */
export function Text({ node, isSelected, onClick, onContextMenu }: BuilderComponentProps) {
    const { text = 'Text', tag = 'p', ...restProps } = node.props;
    const Tag = tag as keyof JSX.IntrinsicElements;
    const textRef = React.useRef<HTMLElement>(null);
    const [isEditing, setIsEditing] = React.useState(false);

    // Handle double-click to edit
    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setTimeout(() => {
            if (textRef.current) {
                textRef.current.focus();
                // Select all text
                const range = document.createRange();
                range.selectNodeContents(textRef.current);
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(range);
            }
        }, 0);
    };

    // Handle blur to save changes
    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        setIsEditing(false);
        const newText = e.currentTarget.textContent || text;

        // Dispatch custom event to notify parent about the change
        if (newText !== text) {
            const event = new CustomEvent('text-content-change', {
                detail: { nodeId: node.id, text: newText },
                bubbles: true,
            });
            e.currentTarget.dispatchEvent(event);
        }
    };

    return React.createElement(
        Tag,
        {
            ref: textRef,
            'data-node-id': node.id,
            'data-node-type': node.type,
            contentEditable: isEditing,
            suppressContentEditableWarning: true,
            style: {
                ...node.styles,
                outline: isSelected ? '2px solid #3b82f6' : undefined,
                outlineOffset: isSelected ? '2px' : undefined,
                cursor: isSelected && !isEditing ? 'text' : 'default',
            } as CSSProperties,
            onClick,
            onContextMenu,
            onDoubleClick: isSelected ? handleDoubleClick : undefined,
            onBlur: handleBlur,
            ...restProps,
        },
        text
    );
}

/**
 * Image component with fallback handling
 */
export function Image({ node, isSelected, onClick, onContextMenu }: BuilderComponentProps) {
    const { src = '/placeholder.jpg', alt = 'Image', ...restProps } = node.props;
    const [hasError, setHasError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const handleError = () => {
        setHasError(true);
        setIsLoading(false);
    };

    const handleLoad = () => {
        setHasError(false);
        setIsLoading(false);
    };

    // Fallback placeholder
    if (hasError || !src) {
        return (
            <div
                data-node-id={node.id}
                data-node-type={node.type}
                style={{
                    ...node.styles,
                    outline: isSelected ? '2px solid #3b82f6' : undefined,
                    outlineOffset: isSelected ? '2px' : undefined,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f3f4f6',
                    color: '#9ca3af',
                    minHeight: '200px',
                    fontSize: '14px',
                } as CSSProperties}
                onClick={onClick}
                onContextMenu={onContextMenu}
            >
                <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>{hasError ? 'Failed to load image' : 'No image source'}</p>
                </div>
            </div>
        );
    }

    return (
        <img
            data-node-id={node.id}
            data-node-type={node.type}
            src={src}
            alt={alt}
            onError={handleError}
            onLoad={handleLoad}
            style={{
                ...node.styles,
                outline: isSelected ? '2px solid #3b82f6' : undefined,
                outlineOffset: isSelected ? '2px' : undefined,
                opacity: isLoading ? 0.5 : 1,
                transition: 'opacity 0.3s',
            } as CSSProperties}
            onClick={onClick}
            onContextMenu={onContextMenu}
            {...restProps}
        />
    );
}

/**
 * Button component with smart linking
 */
export function Button({ node, isSelected, onClick, onContextMenu }: BuilderComponentProps) {
    const {
        text = 'Button',
        linkType,
        linkTarget,
        openInNewTab,
        buttonType = 'button',
        ...restProps
    } = node.props;

    const handleClick = (e: React.MouseEvent) => {
        // In builder mode, always call the builder's onClick for selection
        if (onClick) {
            onClick(e);
        }

        // Handle link navigation in preview mode
        if (linkType && linkTarget) {
            if (linkType === 'external') {
                if (openInNewTab) {
                    window.open(linkTarget, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = linkTarget;
                }
            } else if (linkType === 'page') {
                // Navigate to internal page
                // In production, this would use Next.js router
                console.log('Navigate to page:', linkTarget);
            } else if (linkType === 'anchor') {
                // Scroll to section anchor
                const element = document.querySelector(`[data-node-id="${linkTarget}"]`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    };

    return (
        <button
            data-node-id={node.id}
            data-node-type={node.type}
            type={buttonType}
            style={{
                ...node.styles,
                outline: isSelected ? '2px solid #3b82f6' : undefined,
                outlineOffset: isSelected ? '2px' : undefined,
                cursor: linkType && linkTarget ? 'pointer' : 'default',
            } as CSSProperties}
            onClick={handleClick}
            onContextMenu={onContextMenu}
            {...restProps}
        >
            {text}
        </button>
    );
}

/**
 * Container component (generic wrapper with flexbox)
 */
export function Container({ node, children, isSelected, onClick, onContextMenu }: BuilderComponentProps) {
    return (
        <div
            data-node-id={node.id}
            data-node-type={node.type}
            style={{
                display: 'flex',
                flexDirection: 'column',
                ...node.styles,
                outline: isSelected ? '2px solid #3b82f6' : undefined,
                outlineOffset: isSelected ? '2px' : undefined,
            } as CSSProperties}
            onClick={onClick}
            onContextMenu={onContextMenu}
            {...node.props}
        >
            {children}
        </div>
    );
}

/**
 * Body component - mandatory root wrapper for all pages
 */
export function Body({ node, children, isSelected, onClick, onContextMenu }: BuilderComponentProps) {
    return (
        <div
            data-node-id={node.id}
            data-node-type={node.type}
            className="builder-body-root"
            style={{
                minHeight: '100vh',
                width: '100%',
                ...node.styles,
                outline: isSelected ? '2px solid #3b82f6' : undefined,
                outlineOffset: isSelected ? '2px' : undefined,
            } as CSSProperties}
            onClick={onClick}
            onContextMenu={onContextMenu}
            {...node.props}
        >
            {children}
        </div>
    );
}

/**
 * Placeholder component for unknown or custom components
 */
export function ComponentPlaceholder({ node, children, isSelected, onClick, onContextMenu }: BuilderComponentProps) {
    return (
        <div
            data-node-id={node.id}
            data-node-type={node.type}
            style={{
                padding: '16px',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                minHeight: '60px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                ...node.styles,
                outline: isSelected ? '2px solid #3b82f6' : undefined,
                outlineOffset: isSelected ? '2px' : undefined,
            } as CSSProperties}
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                {node.type || 'Unknown Component'}
            </div>
            {children}
        </div>
    );
}

/**
 * Grid component with visual editing mode
 */
export function Grid({ node, children, isSelected, onClick, onContextMenu }: BuilderComponentProps) {
    const gridConfig = node.props.gridConfig || { rows: 2, cols: 2, gap: 16 };
    const isEditMode = node.metadata?.editMode || false;

    const handleUpdateGrid = (rows: number, cols: number) => {
        // This will be handled by Inspector updating node.props.gridConfig
        console.log('Grid updated:', { rows, cols });
    };

    const gridStyle: CSSProperties = {
        display: 'grid',
        gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
        gap: `${gridConfig.gap}px`,
        minHeight: '200px',
        ...node.styles,
        outline: isSelected ? '2px solid #3b82f6' : undefined,
        outlineOffset: isSelected ? '2px' : undefined,
    };

    // Sanitize props: remove gridConfig to prevent React DOM warnings
    const { gridConfig: _, ...domProps } = node.props;

    const gridContent = (
        <div
            data-node-id={node.id}
            data-node-type={node.type}
            style={gridStyle}
            onClick={onClick}
            onContextMenu={onContextMenu}
            {...domProps}
        >
            {children}
        </div>
    );

    if (isEditMode && isSelected) {
        return (
            <GridEditor node={node} onUpdateGrid={handleUpdateGrid}>
                {gridContent}
            </GridEditor>
        );
    }

    return gridContent;
}

/**
 * List component with hierarchical editing
 */
export function List({ node, children, isSelected, onClick, onContextMenu }: BuilderComponentProps) {
    const listConfig = node.props.listConfig || {
        type: 'unordered',
        items: [
            { id: '1', text: 'List item 1' },
            { id: '2', text: 'List item 2' },
        ],
    };
    const isEditMode = node.metadata?.editMode || false;

    if (isEditMode && isSelected) {
        return (
            <div
                data-node-id={node.id}
                data-node-type={node.type}
                onClick={onClick}
                onContextMenu={onContextMenu}
            >
                <ListEditorConnector node={node} />
            </div>
        );
    }    // Preview mode: render actual list
    const ListTag = listConfig.type === 'ordered' ? 'ol' : 'ul';
    const listStyle: CSSProperties = {
        listStyleType: listConfig.type === 'none' ? 'none' : undefined,
        paddingLeft: listConfig.type === 'none' ? 0 : undefined,
        ...node.styles,
        outline: isSelected ? '2px solid #3b82f6' : undefined,
        outlineOffset: isSelected ? '2px' : undefined,
    };

    const renderItems = (items: any[]) => {
        return items.map((item: any) => (
            <li key={item.id} style={{ marginBottom: '8px' }}>
                {item.text}
                {item.children && item.children.length > 0 && (
                    <ListTag style={{ marginTop: '8px' }}>
                        {renderItems(item.children)}
                    </ListTag>
                )}
            </li>
        ));
    };

    // Sanitize props: remove listConfig to prevent React DOM warnings
    const { listConfig: _, ...domProps } = node.props;

    return (
        <ListTag
            data-node-id={node.id}
            data-node-type={node.type}
            style={listStyle}
            onClick={onClick}
            onContextMenu={onContextMenu}
            {...domProps}
        >
            {renderItems(listConfig.items)}
        </ListTag>
    );
}

/**
 * Link component with inline editing
 */
export function Link({ node, isSelected, onClick, onContextMenu }: BuilderComponentProps) {
    const { displayText = 'Link', href = '#', openInNewTab = false } = node.props;
    const [isEditing, setIsEditing] = React.useState(false);
    const [text, setText] = React.useState(displayText);

    const handleClick = (e: React.MouseEvent) => {
        onClick?.(e);

        // In preview mode, navigate
        if (!isSelected && href) {
            e.preventDefault();
            if (href.startsWith('http')) {
                if (openInNewTab) {
                    window.open(href, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = href;
                }
            } else {
                // Internal link (page or anchor)
                console.log('Navigate to:', href);
            }
        }
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSelected) {
            setIsEditing(true);
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        // Update would be handled by Inspector
        console.log('Link text updated:', text);
    };

    if (isEditing) {
        return (
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleBlur();
                }}
                autoFocus
                className="px-2 py-1 border border-blue-500 rounded"
                onClick={(e) => e.stopPropagation()}
            />
        );
    }

    // Sanitize props: remove component-specific props to prevent React DOM warnings
    const { displayText: _dt, openInNewTab: _oint, ...domProps } = node.props;

    return (
        <a
            data-node-id={node.id}
            data-node-type={node.type}
            href={href}
            target={openInNewTab ? '_blank' : undefined}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            style={{
                color: '#3b82f6',
                textDecoration: 'underline',
                cursor: 'pointer',
                ...node.styles,
                outline: isSelected ? '2px solid #3b82f6' : undefined,
                outlineOffset: isSelected ? '2px' : undefined,
            } as CSSProperties}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onContextMenu={onContextMenu}
            {...domProps}
        >
            {text}
        </a>
    );
}

/**
 * Form component with full builder functionality
 */
export function Form({ node, children, isSelected, onClick, onContextMenu }: BuilderComponentProps) {
    const isEditMode = node.metadata?.editMode || false;

    const handleUpdateForm = (config: any) => {
        // This will be handled by Inspector updating node.props.formConfig
        console.log('Form updated:', config);
    };

    return (
        <div
            data-node-id={node.id}
            data-node-type={node.type}
            style={{
                ...node.styles,
                outline: isSelected ? '2px solid #3b82f6' : undefined,
                outlineOffset: isSelected ? '2px' : undefined,
            } as CSSProperties}
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            <FormBuilder
                node={node}
                isEditMode={!!(isEditMode && isSelected)}
                onUpdateForm={handleUpdateForm}
            />
        </div>
    );
}

/**
 * Component registry mapping type strings to React components
 */
const componentRegistry: Record<string, React.ComponentType<BuilderComponentProps>> = {
    Body,
    Div,
    Section,
    Text,
    Image,
    Button,
    Container,
    Grid,
    List,
    Link,
    Form,
    ComponentPlaceholder,
};

/**
 * Register a custom component type
 */
export function registerComponent(
    name: string,
    component: React.ComponentType<BuilderComponentProps>,
    defaultProps: Record<string, any> = {},
    defaultStyles: Record<string, any> = {}
) {
    componentRegistry[name] = component;
    componentDefaults[name] = { props: defaultProps, styles: defaultStyles };
}

/**
 * Default props and styles for each component type
 */
export const componentDefaults: Record<string, { props: Record<string, any>; styles: Record<string, any> }> = {
    Body: {
        props: {},
        styles: {
            backgroundColor: '#ffffff',
            color: '#000000',
            fontFamily: 'system-ui, -apple-system, sans-serif',
        },
    },
    Div: {
        props: {},
        styles: {
            padding: '16px',
            minHeight: '40px',
        },
    },
    Section: {
        props: {},
        styles: {
            padding: '32px 16px',
            minHeight: '100px',
        },
    },
    Text: {
        props: {
            text: 'Edit this text',
            tag: 'p',
        },
        styles: {
            fontSize: '16px',
            color: '#1f2937',
        },
    },
    Image: {
        props: {
            src: '/placeholder.jpg',
            alt: 'Image',
        },
        styles: {
            width: '100%',
            maxWidth: '400px',
            height: 'auto',
        },
    },
    Button: {
        props: {
            text: 'Click me',
        },
        styles: {
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
        },
    },
    Container: {
        props: {},
        styles: {
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minHeight: '100px',
        },
    },
    Grid: {
        props: {
            gridConfig: {
                rows: 2,
                cols: 2,
                gap: 16,
            },
        },
        styles: {
            minHeight: '200px',
            backgroundColor: '#f9fafb',
        },
    },
    List: {
        props: {
            listConfig: {
                type: 'unordered',
                items: [
                    { id: '1', text: 'List item 1' },
                    { id: '2', text: 'List item 2' },
                    { id: '3', text: 'List item 3' },
                ],
            },
        },
        styles: {
            padding: '16px',
        },
    },
    Link: {
        props: {
            displayText: 'Click here',
            href: '#',
            openInNewTab: false,
        },
        styles: {
            color: '#3b82f6',
            textDecoration: 'underline',
        },
    },
    Form: {
        props: {
            formConfig: {
                fields: [
                    { id: 'name', type: 'text', label: 'Name', placeholder: 'Your name', required: true },
                    { id: 'email', type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
                    { id: 'message', type: 'textarea', label: 'Message', placeholder: 'Your message', required: true },
                ],
                submitAction: 'email',
                emailTo: '',
                successMessage: 'Thank you! Your message has been sent.',
                errorMessage: 'Oops! Something went wrong. Please try again.',
            },
        },
        styles: {
            maxWidth: '600px',
        },
    },
    ComponentPlaceholder: {
        props: {},
        styles: {},
    },
};

/**
 * Get default props and styles for a component type
 */
export function getComponentDefaults(type: string) {
    return componentDefaults[type] || { props: {}, styles: {} };
}

/**
 * Render a component node recursively
 */
export function renderNode(
    node: ComponentNode,
    selectedNodeId: string | null = null,
    onNodeClick?: (nodeId: string, e: React.MouseEvent) => void,
    onNodeContextMenu?: (nodeId: string, e: React.MouseEvent) => void,
    invalidDropTarget?: string | null
): React.ReactElement {
    const Component = componentRegistry[node.type] || ComponentPlaceholder;
    const isSelected = node.id === selectedNodeId;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent parent nodes from being selected
        onNodeClick?.(node.id, e);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onNodeContextMenu?.(node.id, e);
    };

    // If the component doesn't support children (Text, Image, Button, Link), don't render them
    const nonContainerTypes = ['Text', 'Image', 'Button', 'Link', 'Heading'];
    const hasChildren = !nonContainerTypes.includes(node.type) && node.children && node.children.length > 0;

    // Container types that should be droppable
    const containerTypes = ['Body', 'Section', 'Div', 'Container', 'Grid', 'Form'];
    const isContainer = containerTypes.includes(node.type);

    const renderedComponent = (
        <Component key={node.id} node={node} isSelected={isSelected} onClick={handleClick} onContextMenu={handleContextMenu}>
            {hasChildren && node.children.map((child) => renderNode(child, selectedNodeId, onNodeClick, onNodeContextMenu, invalidDropTarget))}
        </Component>
    );

    // Check if this node is an invalid drop target
    const isInvalidDrop = invalidDropTarget === node.id;

    // Wrap container components with DroppableNode for drop zone functionality
    if (isContainer) {
        return (
            <DroppableNode key={node.id} node={node} isContainer={true} isInvalidDrop={isInvalidDrop}>
                {renderedComponent}
            </DroppableNode>
        );
    }

    return renderedComponent;
}

/**
 * Get list of available component types
 */
export function getAvailableComponents(): string[] {
    return Object.keys(componentRegistry).filter((key) => key !== 'ComponentPlaceholder' && key !== 'Body');
}

export default componentRegistry;
