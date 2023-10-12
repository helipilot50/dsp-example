import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: "../../schema/**/*.graphql",
  documents: './src/graphql/*.graphql.ts',
  generates: {
    'src/graphql/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        scalars: {
          DateTime: 'Date',
          Money: 'number',
          EmailAddress: 'string',
          GTIN: 'string',
        },
      }
    }
  }
};

export default config;