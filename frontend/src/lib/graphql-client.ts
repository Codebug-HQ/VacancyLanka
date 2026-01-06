// lib/graphql-client.ts
import { GraphQLClient } from 'graphql-request';

// Always use the proxy endpoint - never hit WordPress directly from browser
const endpoint = '/api/graphql/proxy';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    // No authorization needed - proxy handles it
  },
});

// For server-side rendering, you might need this
export const getGraphQLClient = () => {
  const isServer = typeof window === 'undefined';
  const baseUrl = isServer 
    ? process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    : '';
  
  return new GraphQLClient(`${baseUrl}/api/graphql/proxy`);
};