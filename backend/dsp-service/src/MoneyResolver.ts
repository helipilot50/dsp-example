import { GraphQLScalarType, Kind } from 'graphql';
import { Logger } from 'winston';
export const scalarMoney = new GraphQLScalarType({
  name: 'Money',
  description: 'Money custom scalar type',
  serialize(value: any) {
    // logger.debug('Money Scalar serialize', typeof value);
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      return parseFloat(value as string);
    }
    if (typeof value === 'object') {
      return parseFloat(value.toFixed(2));
    }
    throw Error('GraphQL Money Scalar serializer expected a `Number` object');
  },
  parseValue(value: any) {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      return parseFloat(value as string);
    }
    throw new Error('GraphQL Money Scalar parser expected a `number`');
  },
  parseLiteral(ast: any) {
    if (ast.kind === Kind.FLOAT) {
      // Convert hard-coded AST string to integer and then to Date
      return parseFloat(ast.value);
    }
    return null;
  },
});