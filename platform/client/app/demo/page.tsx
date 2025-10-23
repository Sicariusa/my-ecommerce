import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="bg-gray-50 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                                Try Our Platform
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Experience the power of our platform with this interactive demo.
                                See how easy it is to build and manage your online store.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Demo Content */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Demo Description */}
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Interactive Demo
                                </h2>
                                <p className="text-lg text-gray-600 mb-6">
                                    This demo showcases our page builder, product management, and store customization tools.
                                    Try building a page, adding products, and customizing your store's appearance.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Drag and drop page builder</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Product catalog management</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Real-time customization</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Mobile responsive preview</span>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <a
                                        href="/auth/signup"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Start Building Your Store
                                    </a>
                                </div>
                            </div>

                            {/* Demo Placeholder */}
                            <div className="relative">
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg">
                                    <div className="bg-white rounded-xl p-6 shadow-sm">
                                        <div className="space-y-4">
                                            {/* Mock demo interface */}
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-lg font-semibold text-gray-900">Demo Store</h3>
                                                <div className="flex space-x-2">
                                                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                                </div>
                                            </div>

                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>

                                            <div className="grid grid-cols-2 gap-4 mt-6">
                                                <div className="h-20 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-indigo-600 text-sm font-medium">Product 1</span>
                                                </div>
                                                <div className="h-20 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-green-600 text-sm font-medium">Product 2</span>
                                                </div>
                                            </div>

                                            <div className="h-32 bg-gray-100 rounded-lg mt-4 flex items-center justify-center">
                                                <span className="text-gray-500 text-sm">Page Builder Canvas</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating elements */}
                                <div className="absolute -top-4 -right-4 w-8 h-8 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-500 rounded-full shadow-lg"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-indigo-600 py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Ready to build your store?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-8">
                            Join thousands of businesses already using our platform to grow their online presence.
                        </p>
                        <a
                            href="/auth/signup"
                            className="bg-white hover:bg-gray-50 text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                        >
                            Get Started Free
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
