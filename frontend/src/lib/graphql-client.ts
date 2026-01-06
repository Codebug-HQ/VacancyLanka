// lib/graphql-client.ts
import { GraphQLClient } from 'graphql-request';

// Always use relative path – works in dev and production
export const graphqlClient = new GraphQLClient('/api/graphql/proxy');