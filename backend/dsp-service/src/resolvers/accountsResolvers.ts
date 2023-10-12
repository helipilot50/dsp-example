import { GraphQLResolveInfo } from "graphql";
import { QueryAccountsArgs, QueryAccountArgs, MutationNewAccountArgs, MutationMapAccountRetailersArgs } from "../resolver-types";
import { withFilter } from "graphql-subscriptions";
import { DspContext, pubsub } from "../context";

const ACCOUNT_CREATED = 'ACCOUNT_CREATED';

export const accountResolvers/*: Resolvers*/ = {

  Query: {
    accounts(_: any, ___: QueryAccountsArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        // console.log('[accounts] context user', context.user?.username);
        return context.prisma.account.findMany({
          select: {
            id: true,
            accountExternalId: true,
            name: true,
            salesForceAccountId: true,
            parentAccount: true,
            parentAccountLabel: true,
            type: true,
            allowBrandedKeywords: true,
            currency: true,
            currencyCode: true,
            countryIds: true,
            retailerIds: true,
          }
        });
      } catch (err) {
        console.error('accounts error', err);
        throw err;
      }
    },

    account(parent: any, args: QueryAccountArgs, context: DspContext) {

      let accountId = args.accountId;
      if (parent && parent.accountId) {
        accountId = parent.accountId;
      }
      console.log('accountId', accountId);
      return context.prisma.account.findUnique(
        {
          where: {
            id: accountId
          },
          select: {
            id: true,
            accountExternalId: true,
            name: true,
            salesForceAccountId: true,
            parentAccount: true,
            parentAccountLabel: true,
            type: true,
            allowBrandedKeywords: true,
            currency: true,
            currencyCode: true,
            countryIds: true,
            retailerIds: true,
          }
        }
      );

    },
  },
  Mutation: {
    async newAccount(_: any, args: MutationNewAccountArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        console.log('[newAccount] args', args);

        // const code = args.account.currency;
        // const currency = await prisma.currency.findFirst({
        //   where: {
        //     code
        //   }
        // });

        const c: any = {
          name: args.account.name,
          type: args.account.type.toString(),
          allowBrandedKeywords: false,
          currencyCode: args.account.currency,
          countryIds: (args.account.countries) ? args.account.countries : [],

        };

        const dbResult = await context.prisma.account.create({
          data: c
        });
        console.log('[newAccount] dbResult', dbResult);
        context.pubsub.publish(ACCOUNT_CREATED, dbResult);
        return dbResult;
      } catch (err) {
        console.error('[newAccount] error', err);
        throw err;
      }
    },
    async mapAccountRetailers(_: any, args: MutationMapAccountRetailersArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        console.log('[addAccountRetailers] args', args);
        const retailers = await context.prisma.retailer.findMany({
          where: {
            id: {
              in: args.retailerIds as string[]
            }
          }
        });

        let dbResult = await context.prisma.account.update({
          where: {
            id: args.accountId
          },
          data: {
            retailerIds: {
              push: args.retailerIds as string[]
            }
          }
        });
        return retailers;
      } catch (err) {
        console.error('[addAccountRetailers] error', err);
        throw err;
      }
    }
  },

  Subscription: {
    accountCreated: {
      subscribe: withFilter(
        (_: any, varibles: any, context: DspContext, info: any) => {
          console.log('[accountsResolvers.accountCreated] subscribe ', varibles);
          return pubsub.asyncIterator(ACCOUNT_CREATED);
        },
        (payload, variables, context: DspContext, info: any) => {
          console.log('accountCreated variables', variables);
          console.log('accountCreated payload', payload);
          return payload;
        }
      )
    }

  }

};