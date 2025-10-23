/**
 * API Route: Export Project as ZIP
 * 
 * POST /api/projects/export
 * Generates a downloadable Next.js project ZIP from builder state
 */

import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import {
    generatePageCode,
    generatePackageJson,
    generateNextConfig,
    generateTailwindConfig,
    generatePostcssConfig,
    generateGlobalsCSS,
    generateReadme,
    generateTsConfig,
} from '@/lib/utils/codeGenerator';
import { Project } from '@/lib/schema';

export async function POST(request: NextRequest) {
    try {
        const { project }: { project: Project } = await request.json();

        if (!project || !project.name || !project.pages) {
            return NextResponse.json(
                { error: 'Invalid project data' },
                { status: 400 }
            );
        }

        // Create ZIP archive
        const zip = new JSZip();

        // Root files
        zip.file('package.json', generatePackageJson(project.name));
        zip.file('next.config.js', generateNextConfig());
        zip.file('tailwind.config.js', generateTailwindConfig());
        zip.file('postcss.config.js', generatePostcssConfig());
        zip.file('tsconfig.json', generateTsConfig());
        zip.file('README.md', generateReadme(project.name));
        zip.file('.gitignore', `# Dependencies
node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
`);

        // Create pages directory
        const pagesFolder = zip.folder('pages')!;

        // Generate page files
        project.pages.forEach((page) => {
            const fileName = page.slug === '/' ? 'index.tsx' : `${page.slug.replace(/^\//, '')}.tsx`;
            pagesFolder.file(fileName, generatePageCode(page));
        });

        // Create _app.tsx
        pagesFolder.file('_app.tsx', `import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
`);

        // Create _document.tsx
        pagesFolder.file('_document.tsx', `import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
`);

        // Create styles directory
        const stylesFolder = zip.folder('styles')!;
        stylesFolder.file('globals.css', generateGlobalsCSS());

        // Create public directory
        const publicFolder = zip.folder('public')!;
        publicFolder.file('placeholder.jpg', 'Placeholder for images', { base64: false });

        // Create config directory with all environment JSON files
        const configFolder = zip.folder('config')!;

        // Add builder, staging, and production JSON files
        configFolder.file('builderSite.json', JSON.stringify(
            { ...project, metadata: { ...project.metadata, environment: 'builder' } },
            null,
            2
        ));

        configFolder.file('stagingSite.json', JSON.stringify(
            { ...project, metadata: { ...project.metadata, environment: 'staging' } },
            null,
            2
        ));

        configFolder.file('productionSite.json', JSON.stringify(
            { ...project, metadata: { ...project.metadata, environment: 'production' } },
            null,
            2
        ));

        // Legacy project.json for backward compatibility
        configFolder.file('project.json', JSON.stringify(project, null, 2));

        // Generate ZIP buffer
        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 9 },
        });

        // Convert blob to buffer for NextResponse
        const arrayBuffer = await zipBlob.arrayBuffer();

        // Return ZIP file
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${project.name.replace(/\s+/g, '-').toLowerCase()}.zip"`,
            },
        });
    } catch (error) {
        console.error('Error exporting project:', error);
        return NextResponse.json(
            { error: 'Failed to export project', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
