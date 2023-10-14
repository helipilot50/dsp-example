
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
        context.logger.debug(`[brandResolvers.brands] args ${JSON.stringify(args, undefined, 2)}`);
        const topLevelFields = topLevelFieldsFromQuery(info);
        context.logger.debug(`[brandResolvers.brands] fields ${topLevelFields}`);
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

        context.logger.debug(`all ${JSON.stringify(rows, undefined, 2)} , ${rowCount}`);
        return {
          brands: rows,
          offset,
          limit,
          totalCount: rowCount
        };
      } catch (err) {
        context.logger.error(`[brandResolvers.brands] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },
    brand(parent: any, args: QueryBrandArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[brandResolvers.brand] args ${JSON.stringify(args, undefined, 2)}`);
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
        context.logger.debug(`[brandResolvers.brand] columns ${select}`);
        return context.prisma.brand.findUnique(queryArgs);
      } catch (err) {
        context.logger.error(`[brandResolvers.brand] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },

  },


}

