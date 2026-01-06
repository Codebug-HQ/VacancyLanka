import { GraphQLClient } from 'graphql-request';

// Always use proxy - NEVER hit WordPress directly from browser
const endpoint = '/api/graphql/proxy';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// For server-side rendering
export const getGraphQLClient = () => {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    // Server-side: use full URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return new GraphQLClient(`${baseUrl}/api/graphql/proxy`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  // Client-side: use relative path
  return graphqlClient;
};

// Helper function for error handling
export const handleGraphQLError = (error: any) => {
  console.error('GraphQL Error:', error);
  
  if (error?.response?.status === 503) {
    return {
      message: 'Service temporarily unavailable. Your hosting provider is blocking requests.',
      suggestion: 'Please consider upgrading to paid hosting or contact support.',
      canRetry: false,
    };
  }
  
  if (error?.response?.status === 504) {
    return {
      message: 'Request timed out. The server took too long to respond.',
      suggestion: 'Please try again in a moment.',
      canRetry: true,
    };
  }
  
  return {
    message: error?.message || 'An unexpected error occurred',
    suggestion: 'Please try again or contact support if the issue persists.',
    canRetry: true,
  };
};