"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retailerResolvers = void 0;
const resolverTools_1 = require("./resolverTools");
exports.retailerResolvers /*: Resolvers*/ = {
    Query: {
        async retailers(parent, args, context, info) {
            try {
                context.logger.debug(`[retailerResolvers.retailers] args ${JSON.stringify(args, undefined, 2)}`);
                const topLevelFields = (0, resolverTools_1.topLevelFieldsFromQuery)(info);
                const offset = args.offset || 0;
                const limit = args.limit || 100;
                let totalCount = 0;
                // row count
                if (topLevelFields?.includes('totalCount')) {
                    totalCount = await context.prisma.retailer.count({});
                }
                const where = {};
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
                    retailers: dbResult,
                    offset,
                    limit,
                    totalCount
                };
            }
            catch (err) {
                context.logger.error(`[retailerResolvers.retailers] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        retailer(parent, args, context, info) {
            try {
                context.logger.debug(`[retailerResolvers.retailer] args ${JSON.stringify(args, undefined, 2)}`);
                let retailerId = args.id;
                if (parent && parent.retailerId) {
                    retailerId = parent.retailerId;
                }
                const topLevelFields = (0, resolverTools_1.topLevelFieldsFromQuery)(info);
                // select from fields in the query
                const select = {};
                topLevelFields?.forEach((field) => {
                    select[field] = true;
                });
                return context.prisma.retailer.findUnique({
                    where: {
                        id: retailerId
                    },
                    select: select
                });
            }
            catch (err) {
                context.logger.error(`[retailerResolvers.retailer] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
    }
};
