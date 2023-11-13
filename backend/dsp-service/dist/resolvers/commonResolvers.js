"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonResolvers = void 0;
exports.commonResolvers /*: Resolvers*/ = {
    Query: {
        async countries(parent, args, context, info) {
            try {
                context.logger.debug(`[commonResolvers.countries] args ${JSON.stringify(args, undefined, 2)}`);
                const where = {};
                if (args.searchName) {
                    where.name = { startsWith: args.searchName };
                }
                if (args.countryCodes) {
                    if (args.countryCodes.length === 0)
                        return [];
                    where.code = {
                        in: args.countryCodes
                    };
                }
                context.logger.debug(`[commonResolvers.countries] where  ${where}`);
                const dbResult = await context.prisma.country.findMany({
                    where,
                    select: {
                        code: true,
                        currency: true,
                        isActiveForAccount: true,
                        name: true,
                    }
                });
                context.logger.debug(`[commonResolvers.countries] dbResult ${JSON.stringify(dbResult, undefined, 2)} `);
                return dbResult;
                // return dbResult.map((row: any): CountryCode => {
                //   let country: Country = {
                //     name: row.name,
                //     isActiveForAccount: row.isActiveForAccount,
                //     code: row.countryCode as CountryCode,
                //     currency: row.currency as CurrencyCode,
                //   };
                //   // context.logger.debug(`country ${country}`);
                //   return country;
                // });
            }
            catch (err) {
                context.logger.error(`[commonResolvers.countries] error ${JSON.stringify(err, undefined, 2)}`);
                // TODO retry
                //nInvalid `prisma.country.findMany()` invocation in\n/Users/peter/git/criteo/not-cmax/mock/src/resolvers.ts:427:47\n\n  424 //   return [];\n  425 \n  426 \n→ 427 const dbResult = await context.prisma.country.findMany(\nCan't reach database server at `aws.connect.psdb.cloud`:`3306`\n\nPlease make sure your database server is running at `aws.connect.psdb.cloud`:`3306`.
                throw err;
            }
        },
        async country(parent, args, context, info) {
            try {
                context.logger.debug(`[commonResolvers.country] args ${JSON.stringify(args, undefined, 2)}`);
                context.logger.debug(`[commonResolvers.country] parent ${JSON.stringify(parent, undefined, 2)}`);
                let countryId = args.code;
                if (parent && parent.countryId) {
                    countryId = parent.countryId;
                }
                const foundCountry = await context.prisma.country.findUnique({
                    where: {
                        code: countryId
                    },
                    select: {
                        code: true,
                        currency: true,
                        isActiveForAccount: true,
                        name: true,
                    }
                });
                context.logger.debug(`foundCountry ${foundCountry}`);
                return (foundCountry) ? foundCountry : null;
            }
            catch (err) {
                context.logger.error(`country error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async currencies(_, args, context, info) {
            try {
                context.logger.debug(`[commonResolvers.currencies] args ${JSON.stringify(args, undefined, 2)}`);
                const searchTarget = args.searchName ? args.searchName : '';
                const dbResult = await context.prisma.currency.findMany({
                    where: {
                        name: {
                            startsWith: searchTarget
                        }
                    },
                    select: {
                        code: true,
                        symbol: true,
                        name: true,
                    }
                });
                context.logger.debug(`[commonResolvers.currencies] dbResult ${JSON.stringify(dbResult, undefined, 2)} `);
                return dbResult;
            }
            catch (err) {
                context.logger.error(`[commonResolvers.currencies] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async currency(parent, args, context, info) {
            try {
                context.logger.debug(`[commonResolvers.currency] args ${JSON.stringify(args, undefined, 2)}`);
                context.logger.debug(`[commonResolvers.currency] parent ${JSON.stringify(parent, undefined, 2)}`);
                let currencyCode = args.code;
                if (parent && parent.currencyCode) {
                    currencyCode = parent.currencyCode;
                }
                const foundCurrency = await context.prisma.currency.findUnique({
                    where: {
                        code: currencyCode
                    },
                    select: {
                        code: true,
                        symbol: true,
                        name: true,
                    }
                });
                context.logger.debug(`[commonResolvers.currency] foundCurrency ${foundCurrency}`);
                return (foundCurrency) ? foundCurrency : null;
            }
            catch (err) {
                context.logger.error(`[commonResolvers.currency] currency error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
    }
};