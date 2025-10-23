/**
 * DeploymentModal Component
 * 
 * Shows deployment progress, logs, and results.
 * Displays staging URL and copy/open actions.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Copy, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface DeploymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    projectName: string;
    pages: any[];
    assets?: any[];
}

type DeploymentStatus = 'idle' | 'deploying' | 'success' | 'error';

interface DeploymentResult {
    deploymentId?: string;
    stagingUrl?: string;
    logs?: string[];
    error?: string;
}

export function DeploymentModal({
    isOpen,
    onClose,
    projectId,
    projectName,
    pages,
    assets = [],
}: DeploymentModalProps) {
    const [status, setStatus] = useState<DeploymentStatus>('idle');
    const [result, setResult] = useState<DeploymentResult>({});
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isOpen && status === 'idle') {
            handleDeploy();
        }
    }, [isOpen, status]);

    const handleDeploy = async () => {
        setStatus('deploying');
        setProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 500);

        try {
            const response = await fetch('/api/deploy/staging', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId,
                    projectName,
                    pages,
                    assets,
                }),
            });

            clearInterval(progressInterval);
            setProgress(100);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Deployment failed');
            }

            const data = await response.json();
            setResult({
                deploymentId: data.deploymentId,
                stagingUrl: data.stagingUrl,
                logs: data.logs || [],
            });
            setStatus('success');
            toast.success('Deployment successful!');
        } catch (error) {
            clearInterval(progressInterval);
            console.error('Deployment error:', error);
            setResult({
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            setStatus('error');
            toast.error('Deployment failed');
        }
    };

    const handleCopyUrl = () => {
        if (result.stagingUrl) {
            navigator.clipboard.writeText(result.stagingUrl);
            toast.success('URL copied to clipboard');
        }
    };

    const handleOpenUrl = () => {
        if (result.stagingUrl) {
            window.open(result.stagingUrl, '_blank');
        }
    };

    const handleClose = () => {
        setStatus('idle');
        setProgress(0);
        setResult({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        {status === 'deploying' && (
                            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                        )}
                        {status === 'success' && (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                        {status === 'error' && (
                            <XCircle className="w-6 h-6 text-red-600" />
                        )}
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {status === 'deploying' && 'Deploying to Staging...'}
                            {status === 'success' && 'Deployment Successful!'}
                            {status === 'error' && 'Deployment Failed'}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        disabled={status === 'deploying'}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Progress Bar */}
                    {status === 'deploying' && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Building and deploying...
                                </span>
                                <span className="text-sm text-gray-500">{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Success Result */}
                    {status === 'success' && result.stagingUrl && (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <p className="text-sm text-green-800 dark:text-green-300 mb-2">
                                    Your site has been deployed successfully!
                                </p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={result.stagingUrl}
                                        readOnly
                                        className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                                    />
                                    <button
                                        onClick={handleCopyUrl}
                                        className="p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                        title="Copy URL"
                                    >
                                        <Copy className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                    </button>
                                    <button
                                        onClick={handleOpenUrl}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Open Site
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Result */}
                    {status === 'error' && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                                        Deployment Error
                                    </p>
                                    <p className="text-sm text-red-700 dark:text-red-400">
                                        {result.error || 'An unknown error occurred'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Deployment Logs */}
                    {result.logs && result.logs.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Deployment Logs
                            </h3>
                            <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                                <pre className="text-xs font-mono text-green-400">
                                    {result.logs.map((log, index) => (
                                        <div key={index}>{log}</div>
                                    ))}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    {status === 'error' && (
                        <button
                            onClick={handleDeploy}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Retry
                        </button>
                    )}
                    <button
                        onClick={handleClose}
                        disabled={status === 'deploying'}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
