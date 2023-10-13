import { GraphQLResolveInfo } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { DspContext } from "../context";
import { Country } from "@prisma/client";
import { QueryCountriesArgs, CountryCode, CurrencyCode, QueryCountryArgs, QueryCurrenciesArgs, QueryCurrencyArgs } from "../resolver-types";

export const commonResolvers/*: Resolvers*/ = {
  Query: {
    async countries(parent: any, args: QueryCountriesArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug('[commonResolvers.countries] args', args);


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
        context.logger.debug('[commonResolvers.countries] where ', where);
        const dbResult = await context.prisma.country.findMany({
          where,
          select: {

            code: true,
            currency: true,
            isActiveForAccount: true,
            name: true,
          }
        });
        context.logger.debug('[commonResolvers.countries] dbResult', dbResult);
        return dbResult;
        // return dbResult.map((row: any): CountryCode => {
        //   let country: Country = {
        //     name: row.name,
        //     isActiveForAccount: row.isActiveForAccount,
        //     code: row.countryCode as CountryCode,
        //     currency: row.currency as CurrencyCode,
        //   };
        //   // context.logger.debug('country', country);
        //   return country;
        // });
      } catch (err) {
        context.logger.error('[commonResolvers.countries] error', err);
        // TODO retry
        //nInvalid `prisma.country.findMany()` invocation in\n/Users/peter/git/criteo/not-cmax/mock/src/resolvers.ts:427:47\n\n  424 //   return [];\n  425 \n  426 \n→ 427 const dbResult = await context.prisma.country.findMany(\nCan't reach database server at `aws.connect.psdb.cloud`:`3306`\n\nPlease make sure your database server is running at `aws.connect.psdb.cloud`:`3306`.
        throw err;
      }
    },
    async country(parent: any, args: QueryCountryArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug('[commonResolvers.country] args', args);
        context.logger.debug('[commonResolvers.country] parent', parent);
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

        context.logger.debug('foundCountry', foundCountry);
        return (foundCountry) ? foundCountry : null;
      } catch (err) {
        context.logger.error('country error', err);
        throw err;
      }
    },
    async currencies(_: any, args: QueryCurrenciesArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug('[commonResolvers.currencies] args', args);
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
        context.logger.debug('[commonResolvers.currencies] dbResult', dbResult);
        return dbResult;
      } catch (err) {
        context.logger.error('[commonResolvers.currencies] error', err);
        throw err;
      }
    },
    async currency(parent: any, args: QueryCurrencyArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug('[commonResolvers.currency] args', args);
        context.logger.debug('[commonResolvers.currency] parent', parent);
        let currencyCode = args.code;

        if (parent && parent.currencyCode) {
          currencyCode = parent.currencyCode;
        }
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

        context.logger.debug('[commonResolvers.currency] foundCurrency', foundCurrency);
        return (foundCurrency) ? foundCurrency : null;
      } catch (err) {
        context.logger.error('[commonResolvers.currency] currency error', err);
        throw err;
      }
    },
  }
};