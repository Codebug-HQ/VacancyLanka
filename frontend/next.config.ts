/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow ANY HTTPS domain (stock photos, etc.)
      {
        protocol: 'https',
        hostname: '**',
      },
      // Allow HTTP from your WordPress backend (free hosting, no SSL)
      {
        protocol: 'http',
        hostname: 'vacaylanka.atwebpages.com',
        port: '', // default 80
        pathname: '/wp-content/uploads/**', // Restrict to uploads folder for security
      },
      // Optional: also allow HTTPS version if some URLs use it
      {
        protocol: 'https',
        hostname: 'vacaylanka.atwebpages.com',
        pathname: '/wp-content/uploads/**',
      },
      // Keep localhost for development
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/wp/wordpress/wp-content/uploads/**',
      },
    ],
    // Optional: disable optimization temporarily to test
    // unoptimized: true,
  },
};

export default nextConfig;