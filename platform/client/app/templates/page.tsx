import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import FeatureCard from "@/components/ui/FeatureCard";

export default function TemplatesPage() {
    const templateCategories = [
        {
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            title: "E-commerce Templates",
            description: "Professional store templates designed for maximum conversion and user experience.",
            tags: ["High conversion", "Mobile optimized"]
        },
        {
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
            ),
            title: "Landing Pages",
            description: "High-converting landing page templates for campaigns, promotions, and product launches.",
            tags: ["A/B tested", "Conversion focused"]
        },
        {
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            title: "Blog Templates",
            description: "Content-focused templates perfect for blogs, news sites, and content marketing.",
            tags: ["SEO optimized", "Reading focused"]
        },
        {
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: "Portfolio Templates",
            description: "Showcase your work with stunning portfolio templates for creative professionals.",
            tags: ["Visual focus", "Gallery ready"]
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="bg-gray-50 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                                Professional Templates
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Choose from dozens of professionally designed templates.
                                Customize colors, fonts, and layouts to match your brand perfectly.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Template Categories */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Template Categories
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Find the perfect template for your business type and industry.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                            {templateCategories.map((category, index) => (
                                <FeatureCard
                                    key={index}
                                    icon={category.icon}
                                    title={category.title}
                                    description={category.description}
                                    tags={category.tags}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-indigo-600 py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Ready to get started?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-8">
                            Browse our template library and find the perfect design for your business.
                        </p>
                        <a
                            href="/auth/signup"
                            className="bg-white hover:bg-gray-50 text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                        >
                            Start Building
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
