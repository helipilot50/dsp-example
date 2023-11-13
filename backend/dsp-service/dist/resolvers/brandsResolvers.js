"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandResolvers = void 0;
const resolverTools_1 = require("./resolverTools");
exports.brandResolvers /*: Resolvers*/ = {
    Query: {
        async brands(_, args, context, info) {
            try {
                context.logger.debug(`[brandResolvers.brands] args ${JSON.stringify(args, undefined, 2)}`);
                const topLevelFields = (0, resolverTools_1.topLevelFieldsFromQuery)(info);
                context.logger.debug(`[brandResolvers.brands] fields ${topLevelFields}`);
                const offset = args.offset || 0;
                const limit = args.limit || 100;
                let rowCount = undefined;
                let rows = [];
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
            }
            catch (err) {
                context.logger.error(`[brandResolvers.brands] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        brand(parent, args, context, info) {
            try {
                context.logger.debug(`[brandResolvers.brand] args ${JSON.stringify(args, undefined, 2)}`);
                let brandId = args.brandId;
                if (parent && parent.brandId) {
                    brandId = parent.brandId;
                }
                const topLevelFields = (0, resolverTools_1.topLevelFieldsFromQuery)(info);
                // select from fields in the query
                const select = {};
                topLevelFields?.forEach((field) => {
                    select[field] = true;
                });
                const queryArgs = {
                    select: select,
                    where: {
                        id: brandId
                    }
                };
                context.logger.debug(`[brandResolvers.brand] columns ${select}`);
                return context.prisma.brand.findUnique(queryArgs);
            }
            catch (err) {
                context.logger.error(`[brandResolvers.brand] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
    },
};
