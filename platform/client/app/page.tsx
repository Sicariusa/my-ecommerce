import Header from "@/components/ui/Header";
import Hero from "@/components/ui/Hero";
import FeatureCard from "@/components/ui/FeatureCard";
import NewsletterCta from "@/components/ui/NewsletterCta";
import Footer from "@/components/ui/Footer";

// Meta tags for SEO (can be moved to layout.tsx or page metadata)
/*
export const metadata = {
  title: "LCNC E-commerce - Build Your Dream Store",
  description: "Create stunning online stores with our low-code platform. No technical skills required. Launch in minutes, not months.",
  keywords: "e-commerce, low-code, no-code, online store, website builder",
  openGraph: {
    title: "LCNC E-commerce - Build Your Dream Store",
    description: "Create stunning online stores with our low-code platform.",
    type: "website",
  },
};
*/

export default function HomePage(): JSX.Element {
    // Feature data - can be moved to a separate data file or CMS later
    const features = [
        {
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "Lightning Fast Setup",
            description: "Get your store up and running in minutes with our intuitive drag-and-drop builder. No coding required.",
            tags: ["5-minute setup", "No coding"]
        },
        {
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
            ),
            title: "Beautiful Templates",
            description: "Choose from dozens of professionally designed templates. Customize colors, fonts, and layouts to match your brand.",
            tags: ["50+ templates", "Customizable"]
        },
        {
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            title: "Secure & Reliable",
            description: "Enterprise-grade security with 99.9% uptime guarantee. Your data and your customers' data is always protected.",
            tags: ["SSL included", "99.9% uptime"]
        },
        {
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            title: "Payment Ready",
            description: "Accept payments instantly with Stripe integration. Support for all major credit cards and digital wallets.",
            tags: ["Stripe ready", "All cards accepted"]
        },
        {
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: "Analytics Dashboard",
            description: "Track your sales, visitors, and performance with our built-in analytics. Make data-driven decisions to grow your business.",
            tags: ["Real-time data", "Sales tracking"]
        },
        {
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
            ),
            title: "24/7 Support",
            description: "Get help when you need it with our dedicated support team. Available via chat, email, and phone.",
            tags: ["Live chat", "Phone support"]
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main>
                <Hero />

                {/* Features Section */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Everything you need to succeed
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Our platform provides all the tools and features you need to build,
                                launch, and grow your online store.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <FeatureCard
                                    key={index}
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                    tags={feature.tags}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <NewsletterCta />
            </main>

            <Footer />
        </div>
    );
}

