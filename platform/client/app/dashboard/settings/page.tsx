import DashboardLayout from "@/components/layout/DashboardLayout";

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your store settings and preferences.</p>
                </div>

                {/* Settings Navigation */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            <button className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                General
                            </button>
                            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                Store Details
                            </button>
                            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                Payment
                            </button>
                            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                Shipping
                            </button>
                            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                Notifications
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* General Settings */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>

                                <div className="space-y-6">
                                    {/* Store Name */}
                                    <div>
                                        <label htmlFor="store-name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Store Name
                                        </label>
                                        <input
                                            type="text"
                                            id="store-name"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="My Awesome Store"
                                        />
                                    </div>

                                    {/* Store Description */}
                                    <div>
                                        <label htmlFor="store-description" className="block text-sm font-medium text-gray-700 mb-2">
                                            Store Description
                                        </label>
                                        <textarea
                                            id="store-description"
                                            rows={3}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Tell customers about your store..."
                                        />
                                    </div>

                                    {/* Store URL */}
                                    <div>
                                        <label htmlFor="store-url" className="block text-sm font-medium text-gray-700 mb-2">
                                            Store URL
                                        </label>
                                        <div className="flex rounded-lg shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                mystore.lcnc.com
                                            </span>
                                            <input
                                                type="text"
                                                id="store-url"
                                                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="your-store-name"
                                            />
                                        </div>
                                    </div>

                                    {/* Timezone */}
                                    <div>
                                        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Timezone
                                        </label>
                                        <select
                                            id="timezone"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option>UTC-08:00 Pacific Time</option>
                                            <option>UTC-05:00 Eastern Time</option>
                                            <option>UTC+00:00 UTC</option>
                                            <option>UTC+01:00 Central European Time</option>
                                        </select>
                                    </div>

                                    {/* Currency */}
                                    <div>
                                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                                            Currency
                                        </label>
                                        <select
                                            id="currency"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option>USD - US Dollar</option>
                                            <option>EUR - Euro</option>
                                            <option>GBP - British Pound</option>
                                            <option>CAD - Canadian Dollar</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Store Status */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Status</h3>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Store Visibility</h4>
                                        <p className="text-sm text-gray-500">Control whether your store is visible to customers</p>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            type="button"
                                            className="bg-indigo-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            role="switch"
                                            aria-checked="true"
                                        >
                                            <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end pt-6 border-t border-gray-200">
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-900">Delete Store</h4>
                                <p className="text-sm text-gray-500">Permanently delete your store and all associated data</p>
                            </div>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                Delete Store
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
