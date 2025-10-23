/**
 * GET /api/projects/[id]
 * Get a specific project
 * 
 * DELETE /api/projects/[id]
 * Delete a specific project
 */

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'projects');

/**
 * GET /api/projects/[id]
 */
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const filePath = path.join(DATA_DIR, `${id}.json`);

        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const project = JSON.parse(content);
            return NextResponse.json({ project });
        } catch (error) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error loading project:', error);
        return NextResponse.json(
            { error: 'Failed to load project' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/projects/[id]
 */
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const filePath = path.join(DATA_DIR, `${id}.json`);

        try {
            await fs.unlink(filePath);
            return NextResponse.json({ success: true });
        } catch (error) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}
