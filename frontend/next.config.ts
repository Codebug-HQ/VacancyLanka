/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow ANY https domain (your stock photos like Unsplash, Pexels, etc.)
      {
        protocol: 'https',
        hostname: '**',
      },
      // Allow local WordPress images in development (http + localhost)
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/wp/wordpress/wp-content/uploads/**', // Optional: restrict to uploads folder
      },
    ],
  },
};

export default nextConfig;