/**
 * GET /api/projects
 * List all projects
 */

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'projects');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating data directory:', error);
    }
}

export async function GET() {
    try {
        await ensureDataDir();

        const files = await fs.readdir(DATA_DIR);
        const jsonFiles = files.filter((file) => file.endsWith('.json'));

        const projects = await Promise.all(
            jsonFiles.map(async (file) => {
                const filePath = path.join(DATA_DIR, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const project = JSON.parse(content);
                return {
                    id: project.id,
                    name: project.name,
                    metadata: project.metadata,
                };
            })
        );

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Error listing projects:', error);
        return NextResponse.json(
            { error: 'Failed to list projects' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/projects
 * Create or update a project
 */
export async function POST(request: Request) {
    try {
        await ensureDataDir();

        const project = await request.json();

        // Validate project structure
        if (!project.id || !project.name) {
            return NextResponse.json(
                { error: 'Invalid project: missing id or name' },
                { status: 400 }
            );
        }

        // Update metadata
        const now = new Date().toISOString();
        if (!project.metadata) {
            project.metadata = {};
        }
        if (!project.metadata.createdAt) {
            project.metadata.createdAt = now;
        }
        project.metadata.updatedAt = now;

        // Save to file
        const filename = `${project.id}.json`;
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(project, null, 2), 'utf-8');

        return NextResponse.json({ success: true, project });
    } catch (error) {
        console.error('Error saving project:', error);
        return NextResponse.json(
            { error: 'Failed to save project' },
            { status: 500 }
        );
    }
}
