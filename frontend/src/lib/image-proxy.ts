// src/lib/image-proxy.ts

/**
 * Converts WordPress image URLs to use the Vercel proxy
 * This bypasses SSL certificate issues from HTTP-only backend
 */
export function getProxiedImageUrl(originalUrl: string | null | undefined): string {
  if (!originalUrl) {
    return '/images/placeholder.jpg'; // Add a fallback placeholder
  }

  // If it's already a relative URL or from another domain, return as-is
  if (!originalUrl.includes('vacaylanka.atwebpages.com')) {
    return originalUrl;
  }

  // Encode the URL and route through our proxy
  return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
}