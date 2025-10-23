/**
 * Builder Routes
 * 
 * API endpoints for website builder project management.
 * Handles saving, loading, and managing builder projects.
 */

import express from 'express';

const router = express.Router();

// In-memory storage for development
// TODO: Replace with database in production
const projects = new Map();

/**
 * GET /api/builder/projects
 * Get all projects for current user/tenant
 */
router.get('/projects', (req, res) => {
    try {
        const tenantId = req.tenant?.id || 'default';
        const projectList = Array.from(projects.values())
            .filter(p => p.tenantId === tenantId)
            .map(p => ({
                id: p.id,
                name: p.name,
                metadata: p.metadata,
            }));

        res.json({
            success: true,
            data: projectList,
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch projects',
        });
    }
});

/**
 * GET /api/builder/projects/:id
 * Get a specific project by ID
 */
router.get('/projects/:id', (req, res) => {
    try {
        const { id } = req.params;
        const tenantId = req.tenant?.id || 'default';
        const project = projects.get(id);

        if (!project || project.tenantId !== tenantId) {
            return res.status(404).json({
                success: false,
                error: 'Project not found',
            });
        }

        res.json({
            success: true,
            data: project,
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch project',
        });
    }
});

/**
 * POST /api/builder/projects
 * Create or update a project
 */
router.post('/projects', (req, res) => {
    try {
        const tenantId = req.tenant?.id || 'default';
        const project = req.body;

        // Validate project
        if (!project || !project.id || !project.name) {
            return res.status(400).json({
                success: false,
                error: 'Invalid project data',
            });
        }

        // Add tenant info
        const projectData = {
            ...project,
            tenantId,
            metadata: {
                ...project.metadata,
                updatedAt: new Date().toISOString(),
            },
        };

        // Check if project exists
        const existing = projects.get(project.id);
        if (!existing) {
            projectData.metadata.createdAt = new Date().toISOString();
        }

        // Save project
        projects.set(project.id, projectData);

        res.json({
            success: true,
            data: projectData,
            message: existing ? 'Project updated' : 'Project created',
        });
    } catch (error) {
        console.error('Error saving project:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save project',
        });
    }
});

/**
 * PUT /api/builder/projects/:id
 * Update an existing project
 */
router.put('/projects/:id', (req, res) => {
    try {
        const { id } = req.params;
        const tenantId = req.tenant?.id || 'default';
        const updates = req.body;

        const project = projects.get(id);

        if (!project || project.tenantId !== tenantId) {
            return res.status(404).json({
                success: false,
                error: 'Project not found',
            });
        }

        const updatedProject = {
            ...project,
            ...updates,
            id, // Ensure ID doesn't change
            tenantId, // Ensure tenant doesn't change
            metadata: {
                ...project.metadata,
                ...updates.metadata,
                updatedAt: new Date().toISOString(),
            },
        };

        projects.set(id, updatedProject);

        res.json({
            success: true,
            data: updatedProject,
            message: 'Project updated',
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update project',
        });
    }
});

/**
 * DELETE /api/builder/projects/:id
 * Delete a project
 */
router.delete('/projects/:id', (req, res) => {
    try {
        const { id } = req.params;
        const tenantId = req.tenant?.id || 'default';
        const project = projects.get(id);

        if (!project || project.tenantId !== tenantId) {
            return res.status(404).json({
                success: false,
                error: 'Project not found',
            });
        }

        projects.delete(id);

        res.json({
            success: true,
            message: 'Project deleted',
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete project',
        });
    }
});

/**
 * POST /api/builder/projects/:id/duplicate
 * Duplicate a project
 */
router.post('/projects/:id/duplicate', (req, res) => {
    try {
        const { id } = req.params;
        const tenantId = req.tenant?.id || 'default';
        const project = projects.get(id);

        if (!project || project.tenantId !== tenantId) {
            return res.status(404).json({
                success: false,
                error: 'Project not found',
            });
        }

        // Create new project with duplicated data
        const newId = `${project.id}-copy-${Date.now()}`;
        const duplicatedProject = {
            ...JSON.parse(JSON.stringify(project)), // Deep clone
            id: newId,
            name: `${project.name} (Copy)`,
            metadata: {
                ...project.metadata,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };

        projects.set(newId, duplicatedProject);

        res.json({
            success: true,
            data: duplicatedProject,
            message: 'Project duplicated',
        });
    } catch (error) {
        console.error('Error duplicating project:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to duplicate project',
        });
    }
});

export default router;
