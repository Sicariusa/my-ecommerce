"use client";

import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
    className?: string;
}

export default function Header({ className = "" }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className={`bg-white border-b border-gray-200 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-bold text-indigo-600">
                                LCNC
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
                        <Link
                            href="/products"
                            className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Products
                        </Link>
                        <Link
                            href="/templates"
                            className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Templates
                        </Link>
                        <Link
                            href="/builder"
                            className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Builder
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Pricing
                        </Link>
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/auth/signin"
                            className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Get started
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-700 hover:text-indigo-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label="Toggle navigation menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div id="mobile-menu" className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                            <Link
                                href="/products"
                                className="text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Products
                            </Link>
                            <Link
                                href="/templates"
                                className="text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Templates
                            </Link>
                            <Link
                                href="/builder"
                                className="text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Builder
                            </Link>
                            <Link
                                href="/pricing"
                                className="text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Pricing
                            </Link>
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <Link
                                    href="/auth/signin"
                                    className="text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white block px-3 py-2 rounded-lg text-base font-medium mt-2 mx-3 text-center transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get started
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
