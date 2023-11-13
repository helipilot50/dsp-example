"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scalarMoney = void 0;
const graphql_1 = require("graphql");
exports.scalarMoney = new graphql_1.GraphQLScalarType({
    name: 'Money',
    description: 'Money custom scalar type',
    serialize(value) {
        // logger.debug('Money Scalar serialize', typeof value);
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'string') {
            return parseFloat(value);
        }
        if (typeof value === 'object') {
            return parseFloat(value.toFixed(2));
        }
        throw Error('GraphQL Money Scalar serializer expected a `Number` object');
    },
    parseValue(value) {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'string') {
            return parseFloat(value);
        }
        throw new Error('GraphQL Money Scalar parser expected a `number`');
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.FLOAT) {
            // Convert hard-coded AST string to integer and then to Date
            return parseFloat(ast.value);
        }
        return null;
    },
});
