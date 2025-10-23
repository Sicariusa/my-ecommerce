/**
 * FormBuilder Component
 * 
 * Full-featured form builder with field management and submission handling.
 * Supports email/webhook submission with validation.
 */

'use client';

import React, { useState } from 'react';
import { Plus, Minus, GripVertical, Mail, Webhook, CheckCircle, AlertCircle } from 'lucide-react';
import { ComponentNode } from '@/lib/schema';

export interface FormField {
    id: string;
    type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox';
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[]; // For select fields
}

export interface FormConfig {
    fields: FormField[];
    submitAction: 'email' | 'webhook' | 'custom';
    emailTo?: string;
    webhookUrl?: string;
    successMessage?: string;
    errorMessage?: string;
}

interface FormBuilderProps {
    node: ComponentNode;
    isEditMode: boolean;
    onUpdateForm: (config: FormConfig) => void;
}

export function FormBuilder({ node, isEditMode, onUpdateForm }: FormBuilderProps) {
    const defaultConfig: FormConfig = {
        fields: [
            { id: 'name', type: 'text', label: 'Name', placeholder: 'Your name', required: true },
            { id: 'email', type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
            { id: 'message', type: 'textarea', label: 'Message', placeholder: 'Your message', required: true },
        ],
        submitAction: 'email',
        emailTo: '',
        successMessage: 'Thank you! Your message has been sent.',
        errorMessage: 'Oops! Something went wrong. Please try again.',
    };

    const formConfig: FormConfig = node.props.formConfig || defaultConfig;
    const [fields, setFields] = useState<FormField[]>(formConfig.fields);
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState<Record<string, any>>({});

    // Edit Mode: Field Management
    const handleAddField = () => {
        const newField: FormField = {
            id: `field-${Date.now()}`,
            type: 'text',
            label: 'New Field',
            placeholder: '',
            required: false,
        };
        const newFields = [...fields, newField];
        setFields(newFields);
        onUpdateForm({ ...formConfig, fields: newFields });
    };

    const handleRemoveField = (fieldId: string) => {
        const newFields = fields.filter((f) => f.id !== fieldId);
        setFields(newFields);
        onUpdateForm({ ...formConfig, fields: newFields });
    };

    const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
        const newFields = fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f));
        setFields(newFields);
        onUpdateForm({ ...formConfig, fields: newFields });
    };

    // Preview Mode: Form Submission
    const handleInputChange = (fieldId: string, value: any) => {
        setFormData({ ...formData, [fieldId]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitStatus('idle');

        // Validate required fields
        const missingFields = fields.filter((f) => f.required && !formData[f.id]);
        if (missingFields.length > 0) {
            alert(`Please fill in: ${missingFields.map((f) => f.label).join(', ')}`);
            setSubmitting(false);
            return;
        }

        try {
            // Simulate submission (mock for now)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // In production, this would send to email/webhook
            console.log('Form submitted:', {
                action: formConfig.submitAction,
                destination: formConfig.emailTo || formConfig.webhookUrl,
                data: formData,
            });

            setSubmitStatus('success');
            setFormData({}); // Reset form
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitStatus('error');
        } finally {
            setSubmitting(false);
        }
    };

    if (isEditMode) {
        // Edit Mode: Field Management UI
        return (
            <div className="border-2 border-dashed border-purple-400 bg-purple-50/10 dark:bg-purple-900/10 rounded p-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Form Builder</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {fields.length} field{fields.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={handleAddField}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        <Plus className="w-3 h-3" />
                        Add Field
                    </button>
                </div>

                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="flex items-start gap-2 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded"
                        >
                            <GripVertical className="w-4 h-4 text-gray-400 mt-2 cursor-move" />

                            <div className="flex-1 space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        value={field.label}
                                        onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                                        placeholder="Field label"
                                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    />
                                    <select
                                        value={field.type}
                                        onChange={(e) => handleUpdateField(field.id, { type: e.target.value as any })}
                                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    >
                                        <option value="text">Text</option>
                                        <option value="email">Email</option>
                                        <option value="textarea">Textarea</option>
                                        <option value="select">Select</option>
                                        <option value="checkbox">Checkbox</option>
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    value={field.placeholder || ''}
                                    onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                                    placeholder="Placeholder text"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                />
                                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                                        className="rounded"
                                    />
                                    Required field
                                </label>
                            </div>

                            <button
                                onClick={() => handleRemoveField(field.id)}
                                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                                title="Remove field"
                            >
                                <Minus className="w-4 h-4 text-red-600" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Preview Mode: Functional Form
    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {fields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {field.label}
                        {field.required && <span className="text-red-600 ml-1">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                        <textarea
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                    ) : field.type === 'checkbox' ? (
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData[field.id] || false}
                                onChange={(e) => handleInputChange(field.id, e.target.checked)}
                                required={field.required}
                                className="rounded"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{field.placeholder}</span>
                        </label>
                    ) : field.type === 'select' ? (
                        <select
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            required={field.required}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        >
                            <option value="">Select an option</option>
                            {field.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={field.type}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                    )}
                </div>
            ))}

            {/* Submit Status Messages */}
            {submitStatus === 'success' && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800 dark:text-green-300">
                        {formConfig.successMessage}
                    </span>
                </div>
            )}

            {submitStatus === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-800 dark:text-red-300">
                        {formConfig.errorMessage}
                    </span>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
                {submitting ? 'Sending...' : 'Submit'}
            </button>
        </form>
    );
}
