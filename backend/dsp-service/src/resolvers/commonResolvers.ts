import { GraphQLResolveInfo } from "graphql";
import { DspContext } from "../context";
import { QueryCountriesArgs, QueryCountryArgs, QueryCurrenciesArgs, QueryCurrencyArgs } from "../resolver-types";

export const commonResolvers/*: Resolvers*/ = {
  Query: {
    async countries(parent: any, args: QueryCountriesArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[commonResolvers.countries] args ${JSON.stringify(args, undefined, 2)}`);


        const where: any = {};
        if (args.searchName) {
          where.name = { startsWith: args.searchName };
        }
        if (args.countryCodes) {
          if (args.countryCodes.length === 0) return [];
          where.code = {
            in: args.countryCodes as string[]
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
      } catch (err) {
        context.logger.error(`[commonResolvers.countries] error ${JSON.stringify(err, undefined, 2)}`);
        // TODO retry
        //nInvalid `prisma.country.findMany()` invocation in\n/Users/peter/git/criteo/not-cmax/mock/src/resolvers.ts:427:47\n\n  424 //   return [];\n  425 \n  426 \n→ 427 const dbResult = await context.prisma.country.findMany(\nCan't reach database server at `aws.connect.psdb.cloud`:`3306`\n\nPlease make sure your database server is running at `aws.connect.psdb.cloud`:`3306`.
        throw err;
      }
    },
    async country(parent: any, args: QueryCountryArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[commonResolvers.country] args ${JSON.stringify(args, undefined, 2)}`);
        context.logger.debug(`[commonResolvers.country] parent ${JSON.stringify(parent, undefined, 2)}`);
        let countryId = args.code;

        if (parent && parent.countryId) {
          countryId = parent.countryId;
        }
        const foundCountry = await context.prisma.country.findUnique(
          {
            where: {
              code: countryId
            },
            select: {
              code: true,
              currency: true,
              isActiveForAccount: true,
              name: true,
            }
          }
        );

        context.logger.debug(`foundCountry ${foundCountry}`);
        return (foundCountry) ? foundCountry : null;
      } catch (err) {
        context.logger.error(`country error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },
    async currencies(_: any, args: QueryCurrenciesArgs, context: DspContext, info: GraphQLResolveInfo) {
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
      } catch (err) {
        context.logger.error(`[commonResolvers.currencies] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },
    async currency(parent: any, args: QueryCurrencyArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.info(`[commonResolvers.currency] args ${JSON.stringify(args, undefined, 2)}`);
        let currencyCode = args.code;

        const foundCurrency = await context.prisma.currency.findUnique(
          {
            where: {
              code: currencyCode as string
            },
            select: {
              code: true,
              symbol: true,
              name: true,
            }
          }
        );
        // const foundCurrency = {
        //   code: currencyCode,
        //   name: 'Euro',
        //   symbol: '€',
        // };


        // context.logger.debug(`[commonResolvers.currency] foundCurrency ${foundCurrency}`);
        return (foundCurrency) ? foundCurrency : null;
      } catch (err) {
        context.logger.error(`[commonResolvers.currency] error ${JSON.stringify(err, undefined, 2)}`);;
        throw err;
      }
    },
  }
};