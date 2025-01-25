/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
            source: '/api/:path*',
            destination: 'http://127.0.0.1:8000/api/:path*'  // Local development
            }
        ]
    }
};

export default nextConfig;
