import { GraphQLResolveInfo } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { DspContext } from "../context";
import { Retailer, RetailerStatus } from "@prisma/client";
import { QueryRetailersArgs, RetailerList, QueryRetailerArgs } from "../resolver-types";
import { topLevelFieldsFromQuery } from "./resolverTools";
export const retailerResolvers/*: Resolvers*/ = {
  Query: {

    async retailers(parent: any, args: QueryRetailersArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[retailerResolvers.retailers] args ${JSON.stringify(args, undefined, 2)}`);
        const topLevelFields = topLevelFieldsFromQuery(info);
        const offset = args.offset || 0;
        const limit = args.limit || 100;
        let totalCount: number = 0;

        // row count
        if (topLevelFields?.includes('totalCount')) {
          totalCount = await context.prisma.retailer.count({});
        }
        const where: any = {};
        if (args.retailerIds) {
          where.id = {
            in: args.retailerIds
          };
        }
        const dbResult = await context.prisma.retailer.findMany({
          where,

          skip: offset,
          take: limit
        });
        context.logger.debug(`[retailerResolvers.retailers] dbResult ${JSON.stringify(dbResult, undefined, 2)} `);
        return {
          retailers: dbResult as Retailer[],
          offset,
          limit,
          totalCount
        };
      } catch (err) {
        context.logger.error(`[retailerResolvers.retailers] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },
    retailer(parent: any, args: QueryRetailerArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[retailerResolvers.retailer] args ${JSON.stringify(args, undefined, 2)}`);
        let retailerId = args.id;
        if (parent && parent.retailerId) {
          retailerId = parent.retailerId;
        }

        const topLevelFields = topLevelFieldsFromQuery(info);
        // select from fields in the query
        const select: any = {};
        topLevelFields?.forEach((field: string) => {
          select[field] = true;
        });

        return context.prisma.retailer.findUnique(
          {
            where: {
              id: retailerId
            },
            select: select
          }
        );
      } catch (err) {
        context.logger.error(`[retailerResolvers.retailer] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }

    },
  }
};