import Link from "next/link";

interface HeroProps {
    className?: string;
}

export default function Hero({ className = "" }: HeroProps) {
    return (
        <section className={`bg-white py-20 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Build Your Dream
                            <span className="text-indigo-600 block">E-commerce Store</span>
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                            Create stunning online stores with our low-code platform.
                            No technical skills required. Launch in minutes, not months.
                        </p>

                        {/* CTAs */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href="/auth/signup"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Start Building Free
                            </Link>
                            <Link
                                href="/demo"
                                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Watch Demo
                            </Link>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                No credit card required
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Setup in 5 minutes
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                24/7 support
                            </div>
                        </div>
                    </div>

                    {/* Illustration Placeholder */}
                    <div className="relative">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="space-y-4">
                                    {/* Mock dashboard elements */}
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                        <div className="h-20 bg-indigo-100 rounded-lg"></div>
                                        <div className="h-20 bg-green-100 rounded-lg"></div>
                                        <div className="h-20 bg-purple-100 rounded-lg"></div>
                                    </div>
                                    <div className="h-32 bg-gray-100 rounded-lg mt-4"></div>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-indigo-600 rounded-full shadow-lg"></div>
                        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-500 rounded-full shadow-lg"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
