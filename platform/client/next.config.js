const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from parent directory (.env)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Environment variables are now loaded from ../env
    env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },

    // Multi-tenant subdomain support
    async rewrites() {
        return [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: '(?<tenant>.*)\\.localhost:3000',
                    },
                ],
                destination: '/tenant/:tenant/:path*',
            },
        ];
    },

    // API proxy to backend
    async redirects() {
        return [];
    },
};

module.exports = nextConfig;

