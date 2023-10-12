
import { GraphQLResolveInfo } from 'graphql';
import {
  QueryBrandsArgs,
  QueryBrandArgs,
} from "../resolver-types";
import { DspContext } from "../context";
import { topLevelFieldsFromQuery } from './resolverTools';

export const brandResolvers/*: Resolvers*/ = {
  Query: {

    async brands(_: any, args: QueryBrandsArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        console.debug('[brandResolvers.brands] args', args);
        const topLevelFields = topLevelFieldsFromQuery(info);
        console.debug('[brandResolvers.brands] fields', topLevelFields);
        const offset = args.offset || 0;
        const limit = args.limit || 100;
        let rowCount: Number | undefined = undefined;
        let rows: any[] = [];
        // select brands and take by offset and limit
        if (topLevelFields?.includes('brands')) {
          rows = await context.prisma.brand.findMany({
            // select: {
            //   id: true,
            //   name: true,
            // },
            skip: offset,
            take: limit
          });
        }

        // row count
        if (topLevelFields?.includes('totalCount')) {
          rowCount = await context.prisma.brand.count();
        }

        console.debug('all', rows, rowCount);
        return {
          brands: rows,
          offset,
          limit,
          totalCount: rowCount
        };
      } catch (err) {
        console.error('[brandResolvers.brands] error', err);
        throw err;
      }
    },
    brand(parent: any, args: QueryBrandArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        console.debug('[brandResolvers.brand] args', args,);
        let brandId = args.brandId;
        if (parent && parent.brandId) {
          brandId = parent.brandId;
        }
        const topLevelFields = topLevelFieldsFromQuery(info);
        // select from fields in the query
        const select: any = {};
        topLevelFields?.forEach((field: string) => {
          select[field] = true;
        });

        const queryArgs: any = {
          select: select,
          where: {
            id: brandId
          }
        };
        console.debug('[brandResolvers.brand] columns', select);
        return context.prisma.brand.findUnique(queryArgs);
      } catch (err) {
        console.error('[brandResolvers.brand] error', err);
        throw err;
      }
    },

  },


}

