/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      // Allow our own proxy endpoint
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/api/image-proxy/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        pathname: '/api/image-proxy/**',
      },
      // Fallback for direct access (though we're proxying)
      {
        protocol: 'http',
        hostname: 'vacaylanka.atwebpages.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;