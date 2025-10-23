"use client";

import { useState } from "react";

interface NewsletterCtaProps {
    className?: string;
}

export default function NewsletterCta({ className = "" }: NewsletterCtaProps) {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setMessage("Please enter your email address");
            return;
        }

        if (!validateEmail(email)) {
            setMessage("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage("Thank you for subscribing! Check your email for confirmation.");
            setEmail("");
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={`bg-indigo-600 py-16 ${className}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Stay Updated
                </h2>
                <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                    Get the latest updates, tips, and exclusive offers delivered to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="newsletter-email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="newsletter-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                disabled={isSubmitting}
                                aria-describedby="newsletter-message"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-white hover:bg-gray-50 text-indigo-600 px-6 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Subscribing..." : "Subscribe"}
                        </button>
                    </div>

                    {message && (
                        <p
                            id="newsletter-message"
                            className={`mt-4 text-sm ${message.includes("Thank you")
                                    ? "text-green-200"
                                    : "text-red-200"
                                }`}
                            role="alert"
                        >
                            {message}
                        </p>
                    )}
                </form>

                <p className="mt-6 text-sm text-indigo-200">
                    We respect your privacy. Unsubscribe at any time.
                </p>
            </div>
        </section>
    );
}
