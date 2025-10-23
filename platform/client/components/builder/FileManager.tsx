/**
 * FileManager Component
 * 
 * Manages file uploads, displays assets, and allows insertion into pages.
 * Supports drag-and-drop and file browsing.
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, Video, FileText, Trash2, ExternalLink, Copy, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBuilderStore } from '@/lib/stores/useBuilderStore';

interface UploadedFile {
    id: string;
    name: string;
    filename: string;
    size: number;
    type: string;
    url: string;
    uploadedAt: string;
}

interface FileManagerProps {
    projectId: string;
    onClose?: () => void;
}

export function FileManager({ projectId, onClose }: FileManagerProps) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const addNode = useBuilderStore((state) => state.addNode);
    const selectedNodeId = useBuilderStore((state) => state.selectedNodeId);

    const handleFileUpload = useCallback(async (fileList: FileList) => {
        if (!fileList || fileList.length === 0) return;

        setIsUploading(true);
        const uploadPromises = Array.from(fileList).map(async (file) => {
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('projectId', projectId);

                const response = await fetch('/api/files/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Upload failed');
                }

                const data = await response.json();
                return data.file as UploadedFile;
            } catch (error) {
                console.error('Upload error:', error);
                toast.error(`Failed to upload ${file.name}`);
                return null;
            }
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        const successfulUploads = uploadedFiles.filter((f): f is UploadedFile => f !== null);

        if (successfulUploads.length > 0) {
            setFiles((prev) => [...successfulUploads, ...prev]);
            toast.success(`Uploaded ${successfulUploads.length} file(s)`);
        }

        setIsUploading(false);
    }, [projectId]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files);
    }, [handleFileUpload]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFileUpload(e.target.files);
        }
    }, [handleFileUpload]);

    const handleDeleteFile = useCallback(async (fileId: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            const response = await fetch(`/api/files/upload?fileId=${fileId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Delete failed');

            setFiles((prev) => prev.filter((f) => f.id !== fileId));
            toast.success('File deleted');
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete file');
        }
    }, []);

    const handleCopyUrl = useCallback((url: string) => {
        navigator.clipboard.writeText(url);
        toast.success('URL copied to clipboard');
    }, []);

    const updateNodeProps = useBuilderStore((state) => state.updateNodeProps);

    const handleInsertImage = useCallback((file: UploadedFile) => {
        if (!selectedNodeId) {
            toast.error('Please select a container to insert the image');
            return;
        }

        // Add an Image component
        addNode(selectedNodeId, 'Image');

        // The new node will be added as last child, so we need to update its props
        // This is a workaround - in production you'd want addNode to support initial props
        setTimeout(() => {
            const activePage = useBuilderStore.getState().getActivePage();
            if (activePage) {
                const findNewImageNode = (nodes: any[]): any => {
                    for (const node of nodes) {
                        if (node.type === 'Image' && !node.props?.src) {
                            return node;
                        }
                        if (node.children) {
                            const found = findNewImageNode(node.children);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const newNode = findNewImageNode(activePage.tree);
                if (newNode) {
                    updateNodeProps(newNode.id, {
                        src: file.url,
                        alt: file.name,
                    });
                }
            }
        }, 100);

        toast.success('Image inserted into page');
    }, [selectedNodeId, addNode, updateNodeProps]);

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
        if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
        return <FileText className="w-5 h-5" />;
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">File Manager</h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                )}
            </div>

            {/* Upload Area */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Drag and drop files here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                        Images and videos up to 10MB
                    </p>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isUploading ? 'Uploading...' : 'Choose Files'}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Files Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No files uploaded yet
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Upload images and videos to use in your pages
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="group relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
                            >
                                {/* Preview */}
                                {file.type.startsWith('image/') ? (
                                    <img
                                        src={file.url}
                                        alt={file.name}
                                        className="w-full h-32 object-cover"
                                    />
                                ) : file.type.startsWith('video/') ? (
                                    <video
                                        src={file.url}
                                        className="w-full h-32 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-32 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                        {getFileIcon(file.type)}
                                    </div>
                                )}

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    {file.type.startsWith('image/') && (
                                        <button
                                            onClick={() => handleInsertImage(file)}
                                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            title="Insert into page"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleCopyUrl(file.url)}
                                        className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                        title="Copy URL"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteFile(file.id)}
                                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* File Info */}
                                <div className="p-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
