/**
 * EnhancedDeploymentModal Component
 * 
 * Allows deploying to staging or production environments.
 * Shows deployment history and confirmation dialogs.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Rocket, AlertTriangle, CheckCircle, XCircle, Loader2, History, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBuilderStore } from '@/lib/stores/useBuilderStore';
import { DeploymentLog } from '@/lib/schema';

interface EnhancedDeploymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type DeploymentEnvironment = 'staging' | 'production';
type DeploymentStep = 'select' | 'confirm' | 'deploying' | 'success' | 'error';

export function EnhancedDeploymentModal({
    isOpen,
    onClose,
}: EnhancedDeploymentModalProps) {
    const project = useBuilderStore((state) => state.project);
    const [step, setStep] = useState<DeploymentStep>('select');
    const [selectedEnv, setSelectedEnv] = useState<DeploymentEnvironment>('staging');
    const [deploymentHistory, setDeploymentHistory] = useState<DeploymentLog[]>([]);
    const [lastDeployment, setLastDeployment] = useState<any>({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (isOpen && project) {
            fetchDeploymentHistory();
        }
    }, [isOpen, project]);

    const fetchDeploymentHistory = async () => {
        if (!project) return;

        try {
            const response = await fetch(`/api/projects/deploy?id=${project.id}`);
            if (response.ok) {
                const data = await response.json();
                setDeploymentHistory(data.deploymentHistory || []);
                setLastDeployment(data.lastDeployment || {});
            }
        } catch (error) {
            console.error('Failed to fetch deployment history:', error);
        }
    };

    const handleDeploy = async () => {
        if (!project) {
            toast.error('No project to deploy');
            return;
        }

        // Validation
        if (!project.pages || project.pages.length === 0) {
            setErrorMessage('Project must have at least one page');
            setStep('error');
            return;
        }

        setStep('deploying');

        try {
            const response = await fetch('/api/projects/deploy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: project.id,
                    targetEnvironment: selectedEnv,
                    message: `Deployed ${project.name} to ${selectedEnv}`,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Deployment failed');
            }

            const result = await response.json();
            setStep('success');
            toast.success(result.message);

            // Refresh deployment history
            fetchDeploymentHistory();
        } catch (error) {
            console.error('Deployment error:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
            setStep('error');
            toast.error('Deployment failed');
        }
    };

    const handleClose = () => {
        setStep('select');
        setSelectedEnv('staging');
        setErrorMessage('');
        onClose();
    };

    if (!isOpen || !project) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <Rocket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Deploy Project
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Select Environment */}
                    {step === 'select' && (
                        <div className="space-y-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Choose the environment to deploy <strong>{project.name}</strong>
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Staging Option */}
                                <button
                                    onClick={() => setSelectedEnv('staging')}
                                    className={`p-6 rounded-lg border-2 transition-all ${selectedEnv === 'staging'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex flex-col items-start gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${selectedEnv === 'staging' ? 'bg-blue-500' : 'bg-gray-300'
                                                }`} />
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                Staging
                                            </span>
                                        </div>
                                        <p className="text-xs text-left text-gray-600 dark:text-gray-400">
                                            Test environment for preview before going live
                                        </p>
                                        {lastDeployment.staging && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                Last: {new Date(lastDeployment.staging).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </button>

                                {/* Production Option */}
                                <button
                                    onClick={() => setSelectedEnv('production')}
                                    className={`p-6 rounded-lg border-2 transition-all ${selectedEnv === 'production'
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex flex-col items-start gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${selectedEnv === 'production' ? 'bg-green-500' : 'bg-gray-300'
                                                }`} />
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                Production
                                            </span>
                                        </div>
                                        <p className="text-xs text-left text-gray-600 dark:text-gray-400">
                                            Live environment accessible to all users
                                        </p>
                                        {lastDeployment.production && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                Last: {new Date(lastDeployment.production).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            </div>

                            {/* Deployment History */}
                            {deploymentHistory.length > 0 && (
                                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <History className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Recent Deployments
                                        </span>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {deploymentHistory.slice(0, 5).map((log) => (
                                            <div
                                                key={log.id}
                                                className="flex items-center justify-between text-xs p-2 bg-white dark:bg-gray-800 rounded"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${log.environment === 'production' ? 'bg-green-500' : 'bg-blue-500'
                                                        }`} />
                                                    <span className="font-medium capitalize">{log.environment}</span>
                                                </div>
                                                <span className="text-gray-500">
                                                    {new Date(log.deployedAt).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setStep('confirm')}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Confirm Deployment */}
                    {step === 'confirm' && (
                        <div className="space-y-6">
                            <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                                        Confirm Deployment
                                    </p>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                        You are about to deploy <strong>{project.name}</strong> to <strong className="capitalize">{selectedEnv}</strong> environment.
                                        {selectedEnv === 'production' && ' This will update your live website.'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Project:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{project.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Pages:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{project.pages.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Environment:</span>
                                    <span className={`font-medium capitalize ${selectedEnv === 'production' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                                        }`}>
                                        {selectedEnv}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setStep('select')}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleDeploy}
                                    className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${selectedEnv === 'production'
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    Deploy Now
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Deploying */}
                    {step === 'deploying' && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
                            <p className="text-lg font-medium text-gray-900 dark:text-white">
                                Deploying to {selectedEnv}...
                            </p>
                            <p className="text-sm text-gray-500">
                                This may take a few moments
                            </p>
                        </div>
                    )}

                    {/* Success */}
                    {step === 'success' && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
                                <p className="text-lg font-medium text-gray-900 dark:text-white">
                                    Deployment Successful!
                                </p>
                                <p className="text-sm text-gray-500 text-center">
                                    Your project has been deployed to <span className="capitalize font-medium">{selectedEnv}</span>
                                </p>
                            </div>

                            <button
                                onClick={handleClose}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    )}

                    {/* Error */}
                    {step === 'error' && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                <XCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
                                <p className="text-lg font-medium text-gray-900 dark:text-white">
                                    Deployment Failed
                                </p>
                                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                                    {errorMessage}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => setStep('select')}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
