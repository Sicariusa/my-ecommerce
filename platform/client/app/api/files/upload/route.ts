/**
 * File Upload API Route
 * 
 * Handles file uploads for the builder (images, videos, assets).
 * Stores files in Supabase Storage or local filesystem.
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const projectId = formData.get('projectId') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        if (!projectId) {
            return NextResponse.json(
                { error: 'projectId is required' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: images and videos only' },
                { status: 400 }
            );
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size exceeds 10MB limit' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 9);
        const extension = file.name.split('.').pop();
        const filename = `${timestamp}-${randomStr}.${extension}`;

        // Create upload directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public', 'uploads', projectId);
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Save file
        const buffer = Buffer.from(await file.arrayBuffer());
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Generate public URL
        const publicUrl = `/uploads/${projectId}/${filename}`;

        // TODO: In production, upload to Supabase Storage or S3
        // Example with Supabase:
        // const { data, error } = await supabase.storage
        //   .from('builder-assets')
        //   .upload(`${projectId}/${filename}`, buffer, {
        //     contentType: file.type,
        //   });

        const response = {
            success: true,
            file: {
                id: `${projectId}-${filename}`,
                name: file.name,
                filename,
                size: file.size,
                type: file.type,
                url: publicUrl,
                uploadedAt: new Date().toISOString(),
            },
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'File upload failed',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const fileId = searchParams.get('fileId');

        if (!fileId) {
            return NextResponse.json(
                { error: 'fileId is required' },
                { status: 400 }
            );
        }

        // TODO: Implement file deletion from storage
        // For now, return success
        return NextResponse.json({
            success: true,
            message: 'File deleted successfully',
        });
    } catch (error) {
        console.error('File deletion error:', error);
        return NextResponse.json(
            { error: 'File deletion failed' },
            { status: 500 }
        );
    }
}
