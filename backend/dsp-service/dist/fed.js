"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const subgraph_1 = require("@apollo/subgraph");
const typeDefs = (0, graphql_tag_1.default) `
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
const schema = (0, subgraph_1.buildSubgraphSchema)({ typeDefs });
