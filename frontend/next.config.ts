/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Temporarily disable optimization to bypass cert issues
    unoptimized: true,

    // Keep your existing patterns (they won't hurt)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'vacaylanka.atwebpages.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'vacaylanka.atwebpages.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/wp/wordpress/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;