// lib/graphql-client.ts
import { GraphQLClient } from 'graphql-request';

const getEndpoint = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin + '/api/graphql/proxy';
  }
  return '/api/graphql/proxy';
};

export const graphqlClient = new GraphQLClient(getEndpoint(), {
  // No auth headers needed anymore!
});