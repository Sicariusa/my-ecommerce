/**
 * importExport.ts
 * 
 * Utilities for importing/exporting project JSON and generating Next.js code.
 * Provides validation, serialization, and basic code generation.
 * 
 * @module lib/utils/importExport
 */

import { Project, ComponentNode, Page } from '../schema';

/**
 * Export a project to JSON string
 */
export function exportProject(project: Project): string {
    return JSON.stringify(project, null, 2);
}

/**
 * Import a project from JSON string
 * Validates the structure and returns the project
 */
export function importProject(jsonString: string): Project {
    try {
        const parsed = JSON.parse(jsonString);

        // Basic validation
        if (!parsed.id || !parsed.name || !Array.isArray(parsed.pages)) {
            throw new Error('Invalid project structure: missing required fields');
        }

        // Validate pages
        for (const page of parsed.pages) {
            if (!page.id || !page.name || !Array.isArray(page.tree)) {
                throw new Error('Invalid page structure');
            }
        }

        return parsed as Project;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Invalid JSON format');
        }
        throw error;
    }
}

/**
 * Validate a project structure
 */
export function validateProject(project: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!project.id) errors.push('Missing project ID');
    if (!project.name) errors.push('Missing project name');
    if (!Array.isArray(project.pages)) {
        errors.push('Pages must be an array');
    } else {
        project.pages.forEach((page: any, index: number) => {
            if (!page.id) errors.push(`Page ${index}: missing ID`);
            if (!page.name) errors.push(`Page ${index}: missing name`);
            if (!Array.isArray(page.tree)) errors.push(`Page ${index}: tree must be an array`);
        });
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Generate React/Next.js component code from a ComponentNode
 */
function generateComponentCode(node: ComponentNode, indent: number = 0): string {
    const indentStr = '  '.repeat(indent);
    const styleStr = Object.keys(node.styles).length > 0
        ? `style={${JSON.stringify(node.styles)}}`
        : '';

    const propsStr = Object.entries(node.props)
        .map(([key, value]) => {
            if (typeof value === 'string') {
                return `${key}="${value}"`;
            }
            return `${key}={${JSON.stringify(value)}}`;
        })
        .join(' ');

    const hasChildren = node.children && node.children.length > 0;

    switch (node.type) {
        case 'Text':
            const tag = node.props.tag || 'p';
            const text = node.props.text || '';
            return `${indentStr}<${tag} ${styleStr}>${text}</${tag}>`;

        case 'Image':
            return `${indentStr}<img src="${node.props.src || ''}" alt="${node.props.alt || ''}" ${styleStr} />`;

        case 'Button':
            return `${indentStr}<button ${styleStr}>${node.props.text || 'Button'}</button>`;

        case 'Section':
            if (hasChildren) {
                const childrenCode = node.children
                    .map((child) => generateComponentCode(child, indent + 1))
                    .join('\n');
                return `${indentStr}<section ${propsStr} ${styleStr}>\n${childrenCode}\n${indentStr}</section>`;
            }
            return `${indentStr}<section ${propsStr} ${styleStr} />`;

        case 'Div':
        case 'Container':
        default:
            if (hasChildren) {
                const childrenCode = node.children
                    .map((child) => generateComponentCode(child, indent + 1))
                    .join('\n');
                return `${indentStr}<div ${propsStr} ${styleStr}>\n${childrenCode}\n${indentStr}</div>`;
            }
            return `${indentStr}<div ${propsStr} ${styleStr} />`;
    }
}

/**
 * Generate a Next.js page file from a Page
 */
export function generateNextPage(page: Page): string {
    const componentsCode = page.tree
        .map((node) => generateComponentCode(node, 2))
        .join('\n\n');

    return `/**
 * ${page.name}
 * Auto-generated from website builder
 */

export default function ${page.name.replace(/\s+/g, '')}Page() {
  return (
    <div className="page-container">
${componentsCode}
    </div>
  );
}
`;
}

/**
 * Generate all Next.js pages from a project
 * Returns a map of filename -> code
 */
export function generateNextPages(project: Project): Record<string, string> {
    const pages: Record<string, string> = {};

    project.pages.forEach((page) => {
        // Convert page name to filename (e.g., "Home" -> "index.tsx", "About" -> "about.tsx")
        const filename = page.name.toLowerCase() === 'home'
            ? 'index.tsx'
            : `${page.name.toLowerCase().replace(/\s+/g, '-')}.tsx`;

        pages[filename] = generateNextPage(page);
    });

    return pages;
}

/**
 * Generate a complete Next.js app structure
 * Returns a map of file paths -> code
 */
export function generateNextApp(project: Project): Record<string, string> {
    const files: Record<string, string> = {};

    // Generate pages
    const pages = generateNextPages(project);
    Object.entries(pages).forEach(([filename, code]) => {
        files[`app/${filename}`] = code;
    });

    // Generate layout file
    files['app/layout.tsx'] = `/**
 * Root Layout
 * Auto-generated from website builder
 */

export const metadata = {
  title: '${project.name}',
  description: '${project.metadata?.description || 'Generated with website builder'}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;

    // Generate globals.css
    files['app/globals.css'] = `/**
 * Global Styles
 * Auto-generated from website builder
 */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.page-container {
  width: 100%;
  min-height: 100vh;
}
`;

    // Generate README
    files['README.md'] = `# ${project.name}

This Next.js application was auto-generated from the website builder.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Information

- **Generated:** ${new Date().toISOString()}
- **Pages:** ${project.pages.length}

## Pages

${project.pages.map((p) => `- ${p.name}`).join('\n')}
`;

    return files;
}

/**
 * Download a file to the user's computer
 */
export function downloadFile(filename: string, content: string) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Download project as JSON file
 */
export function downloadProjectJSON(project: Project) {
    const json = exportProject(project);
    downloadFile(`${project.name.toLowerCase().replace(/\s+/g, '-')}.json`, json);
}

/**
 * Download generated Next.js code as a zip (simplified - creates individual files)
 */
export function downloadGeneratedCode(project: Project) {
    const files = generateNextApp(project);

    // For simplicity, download as separate files
    // In a production app, you'd want to create a zip file
    Object.entries(files).forEach(([path, content]) => {
        const filename = path.replace(/\//g, '_');
        downloadFile(filename, content);
    });

    alert(`Downloaded ${Object.keys(files).length} files. In production, these would be bundled in a zip file.`);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}
