/**
 * schema.ts
 * 
 * Core type definitions for the website builder.
 * Defines the structure of component nodes, pages, and projects.
 * Includes a sample template for demonstration and testing.
 * 
 * @module lib/schema
 */

/**
 * Represents a single component node in the builder tree.
 * Nodes can be nested and contain arbitrary props and styles.
 */
export interface ComponentNode {
    /** Unique identifier for the node */
    id: string;

    /** Component type (e.g., 'Div', 'Section', 'Text', 'Image', 'Button', 'Body') */
    type: string;

    /** Component properties (content, src, alt, etc.) */
    props: Record<string, any>;

    /** Inline styles as CSS property/value pairs */
    styles: Record<string, any>;

    /** Child nodes (for container components) */
    children: ComponentNode[];

    /** Optional metadata for organization and display */
    metadata?: {
        /** Custom display name */
        name?: string;
        /** Whether the component is locked from editing */
        locked?: boolean;
        /** Whether the component is collapsed in tree view */
        collapsed?: boolean;
        /** Z-index for layering */
        zIndex?: number;
        /** Whether the component is in edit mode (for Grid, List, Form) */
        editMode?: boolean;
    };
}

/**
 * Represents a single page in the project
 */
export interface Page {
    /** Unique page identifier */
    id: string;

    /** Display name for the page */
    name: string;

    /** URL slug for the page (e.g., '/', '/about', '/products') */
    slug: string;

    /** Root component tree for this page */
    tree: ComponentNode[];

    /** Optional page metadata */
    metadata?: {
        /** Page description/SEO */
        description?: string;
        /** Page thumbnail for templates */
        thumbnail?: string;
        /** Page order/position */
        order?: number;
    };
}

/**
 * Deployment environment types
 */
export type DeploymentEnvironment = 'builder' | 'staging' | 'production';

/**
 * Deployment history entry
 */
export interface DeploymentLog {
    /** Unique deployment identifier */
    id: string;

    /** Target environment */
    environment: DeploymentEnvironment;

    /** Timestamp of deployment */
    deployedAt: string;

    /** User who deployed (optional) */
    deployedBy?: string;

    /** Deployment status */
    status: 'success' | 'failed' | 'pending';

    /** Optional deployment message */
    message?: string;
}

/**
 * Represents a complete website project
 */
export interface Project {
    /** Unique project identifier */
    id: string;

    /** Project name */
    name: string;

    /** Array of pages in the project */
    pages: Page[];

    /** Project metadata */
    metadata?: {
        createdAt?: string;
        updatedAt?: string;
        description?: string;
        /** Current environment this project represents */
        environment?: DeploymentEnvironment;
        /** Last deployment information */
        lastDeployment?: {
            staging?: string; // ISO timestamp
            production?: string; // ISO timestamp
        };
        /** Deployment history */
        deploymentHistory?: DeploymentLog[];
    };
}

/**
 * Sample template demonstrating a simple landing page structure.
 * Includes Body root with header, hero section with text and image, and footer.
 */
export const sampleTemplate: Project = {
    id: 'sample-project-1',
    name: 'Sample Landing Page',
    pages: [
        {
            id: 'page-home',
            name: 'Home',
            slug: '/',
            tree: [
                // Body Root - wraps all page content
                {
                    id: 'body-root-1',
                    type: 'Body',
                    props: {},
                    styles: {
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        minHeight: '100vh',
                    },
                    metadata: {
                        name: 'Body',
                        locked: false,
                    },
                    children: [
                        // Header Section
                        {
                            id: 'header-1',
                            type: 'Section',
                            props: {
                                role: 'banner',
                            },
                            styles: {
                                padding: '16px 24px',
                                backgroundColor: '#ffffff',
                                borderBottom: '1px solid #e5e7eb',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            },
                            metadata: {
                                name: 'Header',
                            },
                            children: [
                                {
                                    id: 'logo-1',
                                    type: 'Text',
                                    props: {
                                        text: 'My Brand',
                                        tag: 'h1',
                                    },
                                    styles: {
                                        fontSize: '24px',
                                        fontWeight: '700',
                                        color: '#1f2937',
                                        margin: '0',
                                    },
                                    metadata: {
                                        name: 'Logo',
                                    },
                                    children: [],
                                },
                                {
                                    id: 'nav-1',
                                    type: 'Div',
                                    props: {},
                                    styles: {
                                        display: 'flex',
                                        gap: '24px',
                                    },
                                    metadata: {
                                        name: 'Navigation',
                                    },
                                    children: [
                                        {
                                            id: 'nav-link-1',
                                            type: 'Text',
                                            props: {
                                                text: 'Home',
                                                tag: 'a',
                                            },
                                            styles: {
                                                color: '#4b5563',
                                                textDecoration: 'none',
                                                cursor: 'pointer',
                                            },
                                            children: [],
                                        },
                                        {
                                            id: 'nav-link-2',
                                            type: 'Text',
                                            props: {
                                                text: 'About',
                                                tag: 'a',
                                            },
                                            styles: {
                                                color: '#4b5563',
                                                textDecoration: 'none',
                                                cursor: 'pointer',
                                            },
                                            children: [],
                                        },
                                        {
                                            id: 'nav-link-3',
                                            type: 'Text',
                                            props: {
                                                text: 'Contact',
                                                tag: 'a',
                                            },
                                            styles: {
                                                color: '#4b5563',
                                                textDecoration: 'none',
                                                cursor: 'pointer',
                                            },
                                            children: [],
                                        },
                                    ],
                                },
                            ],
                        },
                        // Hero Section
                        {
                            id: 'hero-1',
                            type: 'Section',
                            props: {},
                            styles: {
                                padding: '64px 24px',
                                backgroundColor: '#f8fafc',
                                textAlign: 'center',
                            },
                            metadata: {
                                name: 'Hero Section',
                            },
                            children: [
                                {
                                    id: 'hero-container-1',
                                    type: 'Div',
                                    props: {},
                                    styles: {
                                        maxWidth: '1200px',
                                        margin: '0 auto',
                                    },
                                    children: [
                                        {
                                            id: 'h1-1',
                                            type: 'Text',
                                            props: {
                                                text: 'Welcome to Our Platform',
                                                tag: 'h1',
                                            },
                                            styles: {
                                                fontSize: '48px',
                                                fontWeight: '700',
                                                color: '#1f2937',
                                                marginBottom: '16px',
                                            },
                                            children: [],
                                        },
                                        {
                                            id: 'subtitle-1',
                                            type: 'Text',
                                            props: {
                                                text: 'Build amazing websites with our no-code platform',
                                                tag: 'p',
                                            },
                                            styles: {
                                                fontSize: '20px',
                                                color: '#6b7280',
                                                marginBottom: '32px',
                                            },
                                            children: [],
                                        },
                                        {
                                            id: 'cta-button-1',
                                            type: 'Button',
                                            props: {
                                                text: 'Get Started',
                                            },
                                            styles: {
                                                padding: '12px 32px',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                backgroundColor: '#3b82f6',
                                                color: '#ffffff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                marginBottom: '32px',
                                            },
                                            children: [],
                                        },
                                        {
                                            id: 'hero-image-1',
                                            type: 'Image',
                                            props: {
                                                src: '/placeholder-hero.jpg',
                                                alt: 'Hero Image',
                                            },
                                            styles: {
                                                width: '100%',
                                                maxWidth: '800px',
                                                height: 'auto',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                                            },
                                            children: [],
                                        },
                                    ],
                                },
                            ],
                        },
                        // Footer Section
                        {
                            id: 'footer-1',
                            type: 'Section',
                            props: {
                                role: 'contentinfo',
                            },
                            styles: {
                                padding: '32px 24px',
                                backgroundColor: '#1f2937',
                                color: '#ffffff',
                                textAlign: 'center',
                            },
                            metadata: {
                                name: 'Footer',
                            },
                            children: [
                                {
                                    id: 'footer-text-1',
                                    type: 'Text',
                                    props: {
                                        text: '© 2025 My Brand. All rights reserved.',
                                        tag: 'p',
                                    },
                                    styles: {
                                        margin: '0',
                                        color: '#9ca3af',
                                    },
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: 'A sample landing page template with Body root, header, hero, and footer',
    },
};

/**
 * Helper function to generate a unique node ID
 */
export function generateNodeId(type: string): string {
    return `${type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Helper function to create a new empty node
 */
export function createNode(
    type: string,
    props: Record<string, any> = {},
    styles: Record<string, any> = {},
    metadata?: ComponentNode['metadata']
): ComponentNode {
    return {
        id: generateNodeId(type),
        type,
        props,
        styles,
        children: [],
        metadata: metadata || { name: type },
    };
}
