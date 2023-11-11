
import gql from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';

const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

  type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: ID!
    username: String 
    name: String 
    emailAddress: String 
    imageUrl: String 
  }
`;
console.log(typeDefs);
const schema = buildSubgraphSchema({ typeDefs });



