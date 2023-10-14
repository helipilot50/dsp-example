import { GraphQLResolveInfo } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { DspContext } from "../context";
import { QuerySkuArgs, QuerySkusArgs } from "../resolver-types";
import { topLevelFieldsFromQuery } from "./resolverTools";

export const skuResolvers/*: Resolvers*/ = {
  Query: {


    async skus(_: any, args: QuerySkusArgs, context: DspContext, info: any) {
      try {
        context.logger.debug(`skus args ${JSON.stringify(args, undefined, 2)}`);
        const searchTarget = args.search ? args.search : '';
        const topLevelFields = topLevelFieldsFromQuery(info);
        context.logger.debug(`skus fields ${topLevelFields}`);
        const offset = args.offset || 0;
        const limit = args.limit || 100;
        let totalCount: Number | undefined = undefined;
        let rows: any[] = [];

        // row count
        if (topLevelFields?.includes('totalCount')) {
          totalCount = await context.prisma.sKU.count();
        }
        if (topLevelFields?.includes('skus')) {
          rows = await context.prisma.sKU.findMany({
            // TODO search }

            // where: {
            //   name: {
            //     startsWith: searchTarget 
            //   }
            // },
            select: {
              skuKey: true,
              image: true,
              name: true,
              description: true,
              // matchingSearchPhrases: true,
              price: true,
              quantity: true
            },
            skip: offset,
            take: limit
          });
        }
        context.logger.debug(`skus rows ${rows}`);
        return {
          skus: rows,
          offset,
          limit,
          totalCount
        };
      } catch (err) {
        context.logger.error(`skus error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },

    async sku(parent: any, args: QuerySkuArgs, context: DspContext) {
      try {
        context.logger.debug(`sku args ${JSON.stringify(args, undefined, 2)}`);
        context.logger.debug(`sku parent ${JSON.stringify(parent, undefined, 2)}`);
        let skuKey = args.skuKey;

        if (parent && parent.skuKey) {
          skuKey = parent.skuKey;
        }
        const foundSKU = await context.prisma.sKU.findUnique(
          {
            where: {
              skuKey: skuKey
            },
            select: {
              skuKey: true,
              name: true,
              description: true,
              price: true,
              quantity: true
            }
          }
        );

        context.logger.debug(`foundSKU ${foundSKU}`);
        return (foundSKU) ? foundSKU : null;
      } catch (err) {
        context.logger.error(`sku error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },

  }
};