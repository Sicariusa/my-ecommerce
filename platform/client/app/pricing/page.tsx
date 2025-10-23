import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function PricingPage() {
    const plans = [
        {
            name: "Starter",
            price: "Free",
            description: "Perfect for getting started",
            features: [
                "Up to 10 products",
                "1 store",
                "Basic templates",
                "Email support",
                "SSL certificate"
            ],
            cta: "Get Started",
            popular: false
        },
        {
            name: "Professional",
            price: "$29",
            period: "/month",
            description: "For growing businesses",
            features: [
                "Unlimited products",
                "5 stores",
                "All templates",
                "Priority support",
                "Custom domain",
                "Analytics dashboard",
                "Payment processing"
            ],
            cta: "Start Free Trial",
            popular: true
        },
        {
            name: "Enterprise",
            price: "$99",
            period: "/month",
            description: "For large businesses",
            features: [
                "Everything in Professional",
                "Unlimited stores",
                "White-label options",
                "Dedicated support",
                "Custom integrations",
                "Advanced analytics",
                "API access"
            ],
            cta: "Contact Sales",
            popular: false
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
                                Simple, Transparent Pricing
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Choose the plan that's right for your business.
                                Start free and upgrade as you grow.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {plans.map((plan, index) => (
                                <div
                                    key={index}
                                    className={`bg-white rounded-lg shadow-sm p-8 relative ${plan.popular ? 'ring-2 ring-indigo-600' : ''
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                        <p className="text-gray-600 mb-4">{plan.description}</p>
                                        <div className="flex items-baseline justify-center">
                                            <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                            {plan.period && (
                                                <span className="text-gray-600 ml-1">{plan.period}</span>
                                            )}
                                        </div>
                                    </div>

                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center">
                                                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${plan.popular
                                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500'
                                            }`}
                                    >
                                        {plan.cta}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="bg-gray-50 py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Frequently Asked Questions
                            </h2>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Can I change plans anytime?
                                </h3>
                                <p className="text-gray-600">
                                    Yes, you can upgrade or downgrade your plan at any time.
                                    Changes take effect immediately and we'll prorate any billing differences.
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Is there a free trial?
                                </h3>
                                <p className="text-gray-600">
                                    Yes! All paid plans come with a 14-day free trial.
                                    No credit card required to get started.
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    What payment methods do you accept?
                                </h3>
                                <p className="text-gray-600">
                                    We accept all major credit cards, PayPal, and bank transfers for annual plans.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
