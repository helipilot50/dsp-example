import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: "../../schema/**/*.graphql",
  generates: {
    'src/resolver-types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: "./context#DspContext",
        scalars: {
          DateTime: 'Date',
          Money: 'number',
          GTIN: 'string',
          URL: 'string',
          ID: 'string',
        },
        allowParentTypeOverride: true,
        mapperTypeSuffix: "Model",
        showUnusedMappers: true,
        mappers: {
          Campaign: "@prisma/client/index.d#Campaign",
          Account: "@prisma/client/index.d#Account",
          Country: "@prisma/client/index.d#Country",
          Lineitem: "@prisma/client/index.d#Lineitem",
          SKU: "@prisma/client/index.d#SKU",
          Retailer: "@prisma/client/index.d#Retailer",
          Brand: "@prisma/client/index.d#Brand",
          Currency: "@prisma/client/index.d#Currency",
          Portfolio: "@prisma/client/index.d#Portfolio",
        }
      }
    }
  }
};

export default config;