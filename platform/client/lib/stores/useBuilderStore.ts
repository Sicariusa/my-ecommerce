/**
 * useBuilderStore.ts
 * 
 * Zustand store for website builder state management.
 * Manages project state, active page, selected node, and all builder operations.
 * Includes localStorage persistence for development.
 * 
 * @module lib/stores/useBuilderStore
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ComponentNode, Project, Page, createNode, generateNodeId } from '../schema';

/**
 * Builder store state interface
 */
interface BuilderState {
    // Core state
    project: Project | null;
    activePageId: string | null;
    selectedNodeId: string | null;
    clipboard: ComponentNode | null;

    // History for undo/redo
    history: Project[];
    historyIndex: number;
    maxHistorySize: number;

    // Actions - Project Management
    setProject: (project: Project) => void;
    resetProject: () => void;
    updateProjectName: (name: string) => void;

    // Actions - Page Management
    setActivePage: (pageId: string) => void;
    addPage: (name: string, slug?: string) => void;
    deletePage: (pageId: string) => void;
    renamePage: (pageId: string, name: string, newSlug?: string) => void;
    duplicatePage: (pageId: string) => void;
    reorderPages: (fromIndex: number, toIndex: number) => void;
    getActivePage: () => Page | null;

    // Actions - Node Selection
    selectNode: (nodeId: string | null) => void;
    getSelectedNode: () => ComponentNode | null;

    // Actions - Node Operations
    addNode: (parentId: string | null, nodeType: string, index?: number) => void;
    deleteNode: (nodeId: string) => void;
    duplicateNode: (nodeId: string) => void;
    moveNode: (nodeId: string, newParentId: string | null, newIndex: number) => void;
    updateNodeProps: (nodeId: string, props: Record<string, any>) => void;
    updateNodeStyles: (nodeId: string, styles: Record<string, any>) => void;
    updateNodeType: (nodeId: string, newType: string) => void;
    updateNodeMetadata: (nodeId: string, metadata: Record<string, any>) => void;
    renameNode: (nodeId: string, name: string) => void;
    lockNode: (nodeId: string, locked: boolean) => void;
    wrapInContainer: (nodeId: string, containerType?: string) => void;

    // Actions - Clipboard
    copyNode: (nodeId: string) => void;
    pasteNode: (parentId: string | null) => void;

    // Actions - AI Enhancement
    enhanceWithAI: (prompt: string) => Promise<{ success: boolean; error?: string }>;

    // Actions - History
    pushHistory: () => void;
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;

    // Utilities
    findNode: (nodeId: string, nodes?: ComponentNode[]) => ComponentNode | null;
    findParentNode: (nodeId: string, nodes?: ComponentNode[]) => ComponentNode | null;
}

/**
 * Helper function to deep clone a node
 */
function cloneNode(node: ComponentNode): ComponentNode {
    return {
        ...node,
        id: generateNodeId(node.type),
        children: node.children.map(cloneNode),
    };
}

/**
 * Helper function to recursively find a node by ID
 */
function findNodeRecursive(nodeId: string, nodes: ComponentNode[]): ComponentNode | null {
    for (const node of nodes) {
        if (node.id === nodeId) return node;
        if (node.children.length > 0) {
            const found = findNodeRecursive(nodeId, node.children);
            if (found) return found;
        }
    }
    return null;
}

/**
 * Helper function to recursively find a parent node
 */
function findParentRecursive(nodeId: string, nodes: ComponentNode[], parent: ComponentNode | null = null): ComponentNode | null {
    for (const node of nodes) {
        if (node.id === nodeId) return parent;
        if (node.children.length > 0) {
            const found = findParentRecursive(nodeId, node.children, node);
            if (found !== null) return found;
        }
    }
    return null;
}

/**
 * Helper function to deep clone a project for history
 */
function cloneProject(project: Project): Project {
    return JSON.parse(JSON.stringify(project));
}

/**
 * Helper function to remove a node from the tree
 */
function removeNodeFromTree(nodeId: string, nodes: ComponentNode[]): ComponentNode[] {
    return nodes
        .filter((node) => node.id !== nodeId)
        .map((node) => ({
            ...node,
            children: removeNodeFromTree(nodeId, node.children),
        }));
}

/**
 * Main builder store
 */
export const useBuilderStore = create<BuilderState>()(
    persist(
        (set, get) => ({
            // Initial state
            project: null,
            activePageId: null,
            selectedNodeId: null,
            clipboard: null,
            history: [],
            historyIndex: -1,
            maxHistorySize: 50,

            // Project Management
            setProject: (project: Project) => {
                set({
                    project,
                    activePageId: project.pages[0]?.id || null,
                    selectedNodeId: null,
                    history: [cloneProject(project)],
                    historyIndex: 0,
                });
            },

            // Helper to push project state to history
            pushHistory: () => {
                const { project, history, historyIndex, maxHistorySize } = get();
                if (!project) return;

                // Remove any history after current index (for redo)
                const newHistory = history.slice(0, historyIndex + 1);

                // Add current state
                newHistory.push(cloneProject(project));

                // Limit history size
                if (newHistory.length > maxHistorySize) {
                    newHistory.shift();
                } else {
                    set({ historyIndex: historyIndex + 1 });
                }

                set({ history: newHistory });
            },

            resetProject: () => {
                set({
                    project: null,
                    activePageId: null,
                    selectedNodeId: null,
                    clipboard: null,
                    history: [],
                    historyIndex: -1,
                });
            },

            updateProjectName: (name: string) => {
                const { project } = get();
                if (!project) return;

                const updatedProject = { ...project, name };
                set({ project: updatedProject });
            },

            // Page Management
            setActivePage: (pageId: string) => {
                set({ activePageId: pageId, selectedNodeId: null });
            },

            addPage: (name: string, slug?: string) => {
                const { project } = get();
                if (!project) return;

                // Generate slug from name if not provided
                const pageSlug = slug || '/' + name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

                // Ensure unique slug
                let uniqueSlug = pageSlug;
                let counter = 1;
                while (project.pages.some(p => p.slug === uniqueSlug)) {
                    uniqueSlug = `${pageSlug}-${counter}`;
                    counter++;
                }

                const newPage: Page = {
                    id: `page-${Date.now()}`,
                    name,
                    slug: uniqueSlug,
                    tree: [],
                    metadata: {
                        order: project.pages.length,
                    },
                };

                const updatedProject = {
                    ...project,
                    pages: [...project.pages, newPage],
                };

                set({ project: updatedProject, activePageId: newPage.id });
            },

            deletePage: (pageId: string) => {
                const { project, activePageId } = get();
                if (!project || project.pages.length <= 1) return;

                const updatedPages = project.pages.filter((p) => p.id !== pageId);
                const newActivePageId = activePageId === pageId ? updatedPages[0].id : activePageId;

                set({
                    project: { ...project, pages: updatedPages },
                    activePageId: newActivePageId,
                });
            },

            renamePage: (pageId: string, name: string, newSlug?: string) => {
                const { project } = get();
                if (!project) return;

                const updatedPages = project.pages.map((p) => {
                    if (p.id === pageId) {
                        // Update slug if provided and different
                        if (newSlug && newSlug !== p.slug) {
                            // Ensure unique slug
                            let uniqueSlug = newSlug;
                            let counter = 1;
                            while (project.pages.some(page => page.id !== pageId && page.slug === uniqueSlug)) {
                                uniqueSlug = `${newSlug}-${counter}`;
                                counter++;
                            }
                            return { ...p, name, slug: uniqueSlug };
                        }
                        return { ...p, name };
                    }
                    return p;
                });

                set({ project: { ...project, pages: updatedPages } });
            },

            duplicatePage: (pageId: string) => {
                const { project } = get();
                if (!project) return;

                const pageToDuplicate = project.pages.find((p) => p.id === pageId);
                if (!pageToDuplicate) return;

                // Deep clone the page tree
                const cloneTree = (nodes: ComponentNode[]): ComponentNode[] => {
                    return nodes.map((node) => ({
                        ...node,
                        id: `${node.type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        children: node.children ? cloneTree(node.children) : [],
                    }));
                };

                const newPage: Page = {
                    id: `page-${Date.now()}`,
                    name: `${pageToDuplicate.name} (Copy)`,
                    slug: `${pageToDuplicate.slug}-copy`,
                    tree: cloneTree(pageToDuplicate.tree),
                    metadata: {
                        order: project.pages.length,
                    },
                };

                // Ensure unique slug
                let uniqueSlug = newPage.slug;
                let counter = 1;
                while (project.pages.some(p => p.slug === uniqueSlug)) {
                    uniqueSlug = `${pageToDuplicate.slug}-copy-${counter}`;
                    counter++;
                }
                newPage.slug = uniqueSlug;

                const updatedProject = {
                    ...project,
                    pages: [...project.pages, newPage],
                };

                set({ project: updatedProject, activePageId: newPage.id });
            },

            reorderPages: (fromIndex: number, toIndex: number) => {
                const { project } = get();
                if (!project) return;

                const pages = [...project.pages];
                const [movedPage] = pages.splice(fromIndex, 1);
                pages.splice(toIndex, 0, movedPage);

                // Update order metadata
                const updatedPages = pages.map((page, index) => ({
                    ...page,
                    metadata: {
                        ...page.metadata,
                        order: index,
                    },
                }));

                set({ project: { ...project, pages: updatedPages } });
            },

            getActivePage: () => {
                const { project, activePageId } = get();
                if (!project || !activePageId) return null;
                return project.pages.find((p) => p.id === activePageId) || null;
            },

            // Node Selection
            selectNode: (nodeId: string | null) => {
                set({ selectedNodeId: nodeId });
            },

            getSelectedNode: () => {
                const { selectedNodeId } = get();
                if (!selectedNodeId) return null;
                return get().findNode(selectedNodeId);
            },

            // Node Operations
            addNode: (parentId: string | null, nodeType: string, index?: number) => {
                const { project, activePageId } = get();
                if (!project || !activePageId) return;

                const page = project.pages.find((p) => p.id === activePageId);
                if (!page) return;

                // Enforce Body root: if tree is empty, force first component to be Body
                if (page.tree.length === 0 && nodeType !== 'Body') {
                    console.warn('First component must be Body. Creating Body first.');
                    // Create Body first
                    const bodyNode = createNode('Body');
                    const { getComponentDefaults } = require('../componentRegistry');
                    const bodyDefaults = getComponentDefaults('Body');
                    bodyNode.props = { ...bodyDefaults.props };
                    bodyNode.styles = { ...bodyDefaults.styles };
                    bodyNode.metadata = { name: 'Body' };

                    // Then add the requested component as child
                    const newNode = createNode(nodeType);
                    const defaults = getComponentDefaults(nodeType);
                    newNode.props = { ...defaults.props };
                    newNode.styles = { ...defaults.styles };
                    newNode.metadata = { name: nodeType };

                    bodyNode.children = [newNode];

                    const updatedPages = project.pages.map((p) =>
                        p.id === activePageId ? { ...p, tree: [bodyNode] } : p
                    );

                    set({
                        project: { ...project, pages: updatedPages },
                        selectedNodeId: newNode.id,
                    });
                    return;
                }

                // Prevent adding Body after tree is initialized
                if (nodeType === 'Body' && page.tree.length > 0) {
                    console.warn('Body component already exists. Adding inside Body instead.');
                    // Add inside the existing Body
                    const bodyNode = page.tree[0];
                    if (bodyNode) {
                        get().addNode(bodyNode.id, 'Div', index);
                        return;
                    }
                }

                // Prevent adding at root level if Body exists
                if (parentId === null && page.tree.length > 0 && page.tree[0]?.type === 'Body') {
                    console.warn('Cannot add components outside Body root. Adding inside Body.');
                    get().addNode(page.tree[0].id, nodeType, index);
                    return;
                }

                const newNode = createNode(nodeType);

                // Import defaults from componentRegistry
                const { getComponentDefaults } = require('../componentRegistry');
                const defaults = getComponentDefaults(nodeType);
                newNode.props = { ...defaults.props };
                newNode.styles = { ...defaults.styles };
                newNode.metadata = { name: nodeType };

                let updatedTree: ComponentNode[];

                if (parentId === null) {
                    // Add to root level
                    if (index !== undefined) {
                        updatedTree = [...page.tree];
                        updatedTree.splice(index, 0, newNode);
                    } else {
                        updatedTree = [...page.tree, newNode];
                    }
                } else {
                    // Add to parent's children
                    updatedTree = page.tree.map(function addToParent(node): ComponentNode {
                        if (node.id === parentId) {
                            const newChildren = [...node.children];
                            if (index !== undefined) {
                                newChildren.splice(index, 0, newNode);
                            } else {
                                newChildren.push(newNode);
                            }
                            return { ...node, children: newChildren };
                        }
                        return { ...node, children: node.children.map(addToParent) };
                    });
                }

                const updatedPages = project.pages.map((p) =>
                    p.id === activePageId ? { ...p, tree: updatedTree } : p
                );

                set({
                    project: { ...project, pages: updatedPages },
                    selectedNodeId: newNode.id,
                });

                // Push to history
                get().pushHistory();
            },

            deleteNode: (nodeId: string) => {
                const { project, activePageId, selectedNodeId } = get();
                if (!project || !activePageId) return;

                const page = project.pages.find((p) => p.id === activePageId);
                if (!page) return;

                // Protect Body root component from deletion
                const nodeToDelete = findNodeRecursive(nodeId, page.tree);
                if (nodeToDelete && nodeToDelete.type === 'Body') {
                    console.warn('Cannot delete Body root component');
                    return;
                }

                const updatedTree = removeNodeFromTree(nodeId, page.tree);
                const updatedPages = project.pages.map((p) =>
                    p.id === activePageId ? { ...p, tree: updatedTree } : p
                );

                set({
                    project: { ...project, pages: updatedPages },
                    selectedNodeId: selectedNodeId === nodeId ? null : selectedNodeId,
                });

                // Push to history
                get().pushHistory();
            },

            duplicateNode: (nodeId: string) => {
                const { project, activePageId } = get();
                if (!project || !activePageId) return;

                const page = project.pages.find((p) => p.id === activePageId);
                if (!page) return;

                const node = findNodeRecursive(nodeId, page.tree);
                if (!node) return;

                const clonedNode = cloneNode(node);

                // Find parent and insert after the original node
                const parent = findParentRecursive(nodeId, page.tree);
                const siblings = parent ? parent.children : page.tree;
                const index = siblings.findIndex((n) => n.id === nodeId);

                if (parent) {
                    const updatedTree = page.tree.map(function insertClone(n): ComponentNode {
                        if (n.id === parent.id) {
                            const newChildren = [...n.children];
                            newChildren.splice(index + 1, 0, clonedNode);
                            return { ...n, children: newChildren };
                        }
                        return { ...n, children: n.children.map(insertClone) };
                    });

                    const updatedPages = project.pages.map((p) =>
                        p.id === activePageId ? { ...p, tree: updatedTree } : p
                    );

                    set({ project: { ...project, pages: updatedPages } });
                    get().pushHistory();
                } else {
                    // Node is at root level
                    const updatedTree = [...page.tree];
                    updatedTree.splice(index + 1, 0, clonedNode);

                    const updatedPages = project.pages.map((p) =>
                        p.id === activePageId ? { ...p, tree: updatedTree } : p
                    );

                    set({ project: { ...project, pages: updatedPages } });
                    get().pushHistory();
                }
            },

            moveNode: (nodeId: string, newParentId: string | null, newIndex: number) => {
                const { project, activePageId } = get();
                if (!project || !activePageId) return;

                const page = project.pages.find((p) => p.id === activePageId);
                if (!page) return;

                const node = findNodeRecursive(nodeId, page.tree);
                if (!node) return;

                // Remove from current position
                let updatedTree = removeNodeFromTree(nodeId, page.tree);

                // Add to new position
                if (newParentId === null) {
                    updatedTree.splice(newIndex, 0, node);
                } else {
                    updatedTree = updatedTree.map(function addToNewParent(n): ComponentNode {
                        if (n.id === newParentId) {
                            const newChildren = [...n.children];
                            newChildren.splice(newIndex, 0, node);
                            return { ...n, children: newChildren };
                        }
                        return { ...n, children: n.children.map(addToNewParent) };
                    });
                }

                const updatedPages = project.pages.map((p) =>
                    p.id === activePageId ? { ...p, tree: updatedTree } : p
                );

                set({ project: { ...project, pages: updatedPages } });
            },

            updateNodeProps: (nodeId: string, props: Record<string, any>) => {
                const { project, activePageId } = get();
                if (!project || !activePageId) return;

                const page = project.pages.find((p) => p.id === activePageId);
                if (!page) return;

                const updatedTree = page.tree.map(function updateProps(node): ComponentNode {
                    if (node.id === nodeId) {
                        return { ...node, props: { ...node.props, ...props } };
                    }
                    return { ...node, children: node.children.map(updateProps) };
                });

                const updatedPages = project.pages.map((p) =>
                    p.id === activePageId ? { ...p, tree: updatedTree } : p
                );

                set({ project: { ...project, pages: updatedPages } });
                get().pushHistory();
            },

            updateNodeStyles: (nodeId: string, styles: Record<string, any>) => {
                const { project, activePageId } = get();
                if (!project || !activePageId) return;

                const page = project.pages.find((p) => p.id === activePageId);
                if (!page) return;

                const updatedTree = page.tree.map(function updateStyles(node): ComponentNode {
                    if (node.id === nodeId) {
                        return { ...node, styles: { ...node.styles, ...styles } };
                    }
                    return { ...node, children: node.children.map(updateStyles) };
                });

                const updatedPages = project.pages.map((p) =>
                    p.id === activePageId ? { ...p, tree: updatedTree } : p
                );

                set({ project: { ...project, pages: updatedPages } });
                get().pushHistory();
            },

            updateNodeType: (nodeId: string, newType: string) => {
                const { project, activePageId } = get();
                if (!project || !activePageId) return;

                const page = project.pages.find((p) => p.id === activePageId);
                if (!page) return;

                const updatedTree = page.tree.map(function updateType(node): ComponentNode {
                    if (node.id === nodeId) {
                        return { ...node, type: newType };
                    }
                    return { ...node, children: node.children.map(updateType) };
                });

                const updatedPages = project.pages.map((p) =>
                    p.id === activePageId ? { ...p, tree: updatedTree } : p
                );

                set({ project: { ...project, pages: updatedPages } });
                get().pushHistory();
            },

            updateNodeMetadata: (nodeId: string, metadata: Record<string, any>) => {
                const { project, activePageId } = get();
                if (!project || !activePageId) return;

                const page = project.pages.find((p) => p.id === activePageId);
                if (!page) return;

                const updatedTree = page.tree.map(function updateMeta(node): ComponentNode {
                    if (node.id === nodeId) {
                        return { ...node, metadata: { ...node.metadata, ...metadata } };
                    }
                    return { ...node, children: node.children.map(updateMeta) };
                });

                const updatedPages = project.pages.map((p) =>
                    p.id === activePageId ? { ...p, tree: updatedTree } : p
                );

                set({ project: { ...project, pages: updatedPages } });
                // Note: Don't push history for metadata changes like collapse state
                // Only push for rename and lock operations
                if (metadata.name || metadata.locked !== undefined) {
                    get().pushHistory();
                }
            },

            renameNode: (nodeId: string, name: string) => {
                // Protect Body root component from renaming
                const node = get().findNode(nodeId);
                if (node && node.type === 'Body') {
                    console.warn('Cannot rename Body root component');
                    return;
                }
                get().updateNodeMetadata(nodeId, { name });
            },

            lockNode: (nodeId: string, locked: boolean) => {
                get().updateNodeMetadata(nodeId, { locked });
            },

            wrapInContainer: (nodeId: string, containerType: string = 'Div') => {
                const { project, activePageId } = get();
                if (!project || !activePageId) return;

                const page = project.pages.find((p) => p.id === activePageId);
                if (!page) return;

                // Find the node and its parent
                const node = findNodeRecursive(nodeId, page.tree);
                const parent = findParentRecursive(nodeId, page.tree);

                if (!node) return;

                // Cannot wrap Body component
                if (node.type === 'Body') {
                    console.warn('Cannot wrap Body root component');
                    return;
                }

                // Create wrapper container
                const { getComponentDefaults } = require('../componentRegistry');
                const wrapperNode = createNode(containerType);
                const defaults = getComponentDefaults(containerType);
                wrapperNode.props = { ...defaults.props };
                wrapperNode.styles = { ...defaults.styles };
                wrapperNode.metadata = { name: containerType };
                wrapperNode.children = [node];

                // Replace node with wrapper in tree
                const replaceNode = (nodes: ComponentNode[]): ComponentNode[] => {
                    return nodes.map((n) => {
                        if (n.id === nodeId) {
                            return wrapperNode;
                        }
                        if (n.children && n.children.length > 0) {
                            return { ...n, children: replaceNode(n.children) };
                        }
                        return n;
                    });
                };

                const updatedTree = replaceNode(page.tree);
                const updatedPages = project.pages.map((p) =>
                    p.id === activePageId ? { ...p, tree: updatedTree } : p
                );

                set({
                    project: { ...project, pages: updatedPages },
                    selectedNodeId: wrapperNode.id,
                });

                // Push to history
                get().pushHistory();
            },

            // Clipboard operations
            copyNode: (nodeId: string) => {
                const node = get().findNode(nodeId);
                if (node) {
                    set({ clipboard: node });
                }
            },

            pasteNode: (parentId: string | null) => {
                const { clipboard } = get();
                if (!clipboard) return;

                const clonedNode = cloneNode(clipboard);
                get().addNode(parentId, clonedNode.type);
            },

            // AI Enhancement
            enhanceWithAI: async (prompt: string) => {
                const { project } = get();
                if (!project) {
                    return { success: false, error: 'No project to enhance' };
                }

                try {
                    const response = await fetch('/api/builder/enhance', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            project,
                            enhancementPrompt: prompt,
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        return { 
                            success: false, 
                            error: data.error || 'Enhancement failed' 
                        };
                    }

                    if (data.project) {
                        // Update the project with enhanced version
                        set({
                            project: data.project,
                            activePageId: data.project.pages[0]?.id || null,
                        });

                        // Push to history
                        get().pushHistory();

                        return { success: true };
                    }

                    return { success: false, error: 'No enhanced project returned' };
                } catch (error) {
                    console.error('AI enhancement error:', error);
                    return { 
                        success: false, 
                        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
                    };
                }
            },

            // History operations (simplified - full implementation would track each change)
            undo: () => {
                const { history, historyIndex } = get();
                if (historyIndex > 0) {
                    set({
                        project: history[historyIndex - 1],
                        historyIndex: historyIndex - 1,
                    });
                }
            },

            redo: () => {
                const { history, historyIndex } = get();
                if (historyIndex < history.length - 1) {
                    set({
                        project: history[historyIndex + 1],
                        historyIndex: historyIndex + 1,
                    });
                }
            },

            canUndo: () => get().historyIndex > 0,
            canRedo: () => get().historyIndex < get().history.length - 1,

            // Utilities
            findNode: (nodeId: string, nodes?: ComponentNode[]) => {
                const { project, activePageId } = get();
                if (!project || !activePageId) return null;

                const page = project.pages.find((p) => p.id === activePageId);
                if (!page) return null;

                return findNodeRecursive(nodeId, nodes || page.tree);
            },

            findParentNode: (nodeId: string, nodes?: ComponentNode[]) => {
                const { project, activePageId } = get();
                if (!project || !activePageId) return null;

                const page = project.pages.find((p) => p.id === activePageId);
                if (!page) return null;

                return findParentRecursive(nodeId, nodes || page.tree);
            },
        }),
        {
            name: 'builder-storage',
            // Only persist essential state
            partialize: (state) => ({
                project: state.project,
                activePageId: state.activePageId,
            }),
        }
    )
);
