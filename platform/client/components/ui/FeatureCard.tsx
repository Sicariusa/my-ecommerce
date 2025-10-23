import { ReactNode } from "react";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    tags?: string[];
    className?: string;
}

export default function FeatureCard({
    icon,
    title,
    description,
    tags = [],
    className = ""
}: FeatureCardProps) {
    return (
        <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
            {/* Icon */}
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 text-indigo-600">
                    {icon}
                </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {title}
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
                {description}
            </p>

            {/* Tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
