/**
 * API Route: Save Project
 * 
 * POST /api/projects/save
 * Saves project JSON to filesystem with environment separation
 * GET /api/projects/save?id={projectId}&env={environment}
 * Loads project JSON from specific environment
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { project, environment = 'builder' } = body;

        if (!project || !project.id || !project.name) {
            return NextResponse.json(
                { error: 'Invalid project data. Missing id or name.' },
                { status: 400 }
            );
        }

        // Validate environment
        const validEnvironments = ['builder', 'staging', 'production'];
        if (!validEnvironments.includes(environment)) {
            return NextResponse.json(
                { error: `Invalid environment. Must be one of: ${validEnvironments.join(', ')}` },
                { status: 400 }
            );
        }

        // Add environment metadata
        const projectWithEnv = {
            ...project,
            metadata: {
                ...project.metadata,
                environment,
                updatedAt: new Date().toISOString(),
            },
        };

        // Save to environment-specific file
        const projectsDir = path.join(process.cwd(), 'public', 'projects', project.id);
        const filename = `${environment}Site.json`;
        const projectFile = path.join(projectsDir, filename);

        // Ensure project directory exists
        if (!existsSync(projectsDir)) {
            await mkdir(projectsDir, { recursive: true });
        }

        // Save project JSON
        await writeFile(projectFile, JSON.stringify(projectWithEnv, null, 2), 'utf-8');

        return NextResponse.json({
            success: true,
            message: `Project saved to ${environment} environment`,
            projectId: project.id,
            environment,
            savedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error saving project:', error);
        return NextResponse.json(
            { error: 'Failed to save project', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('id');
        const environment = searchParams.get('env') || 'builder';

        if (!projectId) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        // Validate environment
        const validEnvironments = ['builder', 'staging', 'production'];
        if (!validEnvironments.includes(environment)) {
            return NextResponse.json(
                { error: `Invalid environment. Must be one of: ${validEnvironments.join(', ')}` },
                { status: 400 }
            );
        }

        const filename = `${environment}Site.json`;
        const projectFile = path.join(process.cwd(), 'public', 'projects', projectId, filename);

        // Check if file exists
        if (!existsSync(projectFile)) {
            return NextResponse.json(
                { error: `Project not found in ${environment} environment` },
                { status: 404 }
            );
        }

        // Read project file
        const projectData = await readFile(projectFile, 'utf-8');
        const project = JSON.parse(projectData);

        return NextResponse.json({
            success: true,
            project,
            environment,
        });
    } catch (error) {
        console.error('Error loading project:', error);
        return NextResponse.json(
            { error: 'Failed to load project', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
