/**
 * API Route: Deploy Project
 * 
 * POST /api/projects/deploy
 * Deploys project from builder to staging or production environment
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { DeploymentLog } from '@/lib/schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { projectId, targetEnvironment, message } = body;

        if (!projectId) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        if (!targetEnvironment || !['staging', 'production'].includes(targetEnvironment)) {
            return NextResponse.json(
                { error: 'Target environment must be either "staging" or "production"' },
                { status: 400 }
            );
        }

        const projectDir = path.join(process.cwd(), 'public', 'projects', projectId);
        const builderFile = path.join(projectDir, 'builderSite.json');
        const targetFile = path.join(projectDir, `${targetEnvironment}Site.json`);

        // Check if builder file exists
        if (!existsSync(builderFile)) {
            return NextResponse.json(
                { error: 'Builder project not found. Save your project first.' },
                { status: 404 }
            );
        }

        // Ensure project directory exists
        if (!existsSync(projectDir)) {
            await mkdir(projectDir, { recursive: true });
        }

        // Read builder project
        const builderData = await readFile(builderFile, 'utf-8');
        const builderProject = JSON.parse(builderData);

        // Validate project structure
        if (!builderProject.pages || builderProject.pages.length === 0) {
            return NextResponse.json(
                { error: 'Project must have at least one page before deployment' },
                { status: 400 }
            );
        }

        const deployedAt = new Date().toISOString();

        // Create deployment log entry
        const deploymentLog: DeploymentLog = {
            id: `deploy-${Date.now()}`,
            environment: targetEnvironment,
            deployedAt,
            status: 'success',
            message: message || `Deployed to ${targetEnvironment}`,
        };

        // Update project metadata for deployment
        const deployedProject = {
            ...builderProject,
            metadata: {
                ...builderProject.metadata,
                environment: targetEnvironment,
                updatedAt: deployedAt,
                lastDeployment: {
                    ...builderProject.metadata?.lastDeployment,
                    [targetEnvironment]: deployedAt,
                },
                deploymentHistory: [
                    ...(builderProject.metadata?.deploymentHistory || []),
                    deploymentLog,
                ].slice(-50), // Keep last 50 deployments
            },
        };

        // Write to target environment
        await writeFile(targetFile, JSON.stringify(deployedProject, null, 2), 'utf-8');

        // Also update builder file with deployment history
        await writeFile(builderFile, JSON.stringify(deployedProject, null, 2), 'utf-8');

        return NextResponse.json({
            success: true,
            message: `Successfully deployed to ${targetEnvironment}`,
            projectId,
            environment: targetEnvironment,
            deployedAt,
            deploymentLog,
        });
    } catch (error) {
        console.error('Error deploying project:', error);
        return NextResponse.json(
            {
                error: 'Failed to deploy project',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/projects/deploy?id={projectId}
 * Get deployment history for a project
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('id');

        if (!projectId) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        const projectDir = path.join(process.cwd(), 'public', 'projects', projectId);
        const builderFile = path.join(projectDir, 'builderSite.json');

        // Check if builder file exists
        if (!existsSync(builderFile)) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        // Read builder project
        const builderData = await readFile(builderFile, 'utf-8');
        const builderProject = JSON.parse(builderData);

        const deploymentHistory = builderProject.metadata?.deploymentHistory || [];
        const lastDeployment = builderProject.metadata?.lastDeployment || {};

        return NextResponse.json({
            success: true,
            projectId,
            deploymentHistory,
            lastDeployment,
            staging: lastDeployment.staging ? new Date(lastDeployment.staging).toLocaleString() : 'Never',
            production: lastDeployment.production ? new Date(lastDeployment.production).toLocaleString() : 'Never',
        });
    } catch (error) {
        console.error('Error fetching deployment history:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch deployment history',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
