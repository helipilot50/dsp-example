import { GraphQLResolveInfo } from "graphql";
import { QueryAccountsArgs, QueryAccountArgs, MutationNewAccountArgs, MutationMapAccountRetailersArgs, InputMaybe, SubscriptionAccountBrandedKeywordsDisabledArgs, SubscriptionAccountBrandedKeywordsEnabledArgs, SubscriptionAccountBrandsUpatedArgs, SubscriptionAccountCountryAddedArgs, SubscriptionAccountCurrencyDataChangedArgs, SubscriptionAccountFeesModifiedArgs, SubscriptionAccountInitializedArgs, SubscriptionAccountReportingLabelModifiedArgs, SubscriptionAccountRetailerConnectedArgs, SubscriptionAccountRetailersUpdatedArgs, SubscriptionAccountSalesforceDataModifiedArgs, SubscriptionAccountSellerModifiedArgs, SubscriptionAccountWhileLabelSettingsCreatedArgs, SubscriptionAccountWhileLabelSettingsUpdatedArgs } from "../resolver-types";
import { withFilter } from "graphql-subscriptions";
import { DspContext } from "../context";

const ACCOUNT_CREATED = 'ACCOUNT_CREATED';
const ACCOUNT_BRANTED_KEYWORDS_DISABLED = 'ACCOUNT_BRANTED_KEYWORDS_DISABLED';
const ACCOUNT_BRANTED_KEYWORDS_ENABLED = 'ACCOUNT_BRANTED_KEYWORDS_ENABLED';
const ACCOUNT_BRANDS_UPATED = 'ACCOUNT_BRANDS_UPATED';
const ACCOUNT_COUNTRY_ADDED = 'ACCOUNT_COUNTRY_ADDED';
const ACCOUNT_CURRENCY_DATA_CHANGED = 'ACCOUNT_CURRENCY_DATA_CHANGED';
const ACCOUNT_FEES_MODIFIED = 'ACCOUNT_FEES_MODIFIED';
const ACCOUNT_INITIALIZED = 'ACCOUNT_INITIALIZED';
const ACCOUNT_REPORTING_LABEL_MODIFIED = 'ACCOUNT_REPORTING_LABEL_MODIFIED';
const ACCOUNT_RETAILER_CONNECTED = 'ACCOUNT_RETAILER_CONNECTED';
const ACCOUNT_RETAILERS_UPDATED = 'ACCOUNT_RETAILERS_UPDATED';
const ACCOUNT_SALESFORCE_DATA_MODIFIED = 'ACCOUNT_SALESFORCE_DATA_MODIFIED';
const ACCOUNT_SELLER_MODIFIED = 'ACCOUNT_SELLER_MODIFIED';
const ACCOUNT_WHITE_LABEL_SETTINGS_CREATED = 'ACCOUNT_WHITE_LABEL_SETTINGS_CREATED';
const ACCOUNT_WHITE_LABEL_SETTINGS_UPDATED = 'ACCOUNT_WHITE_LABEL_SETTINGS_UPDATED';

export const accountResolvers/*: Resolvers*/ = {

  Query: {
    accounts(_: any, args: QueryAccountsArgs, context: DspContext, info: GraphQLResolveInfo) {

      try {
        const where = {} as any;
        if (args.retailerId) {
          where.retailerIds = {
            has: args.retailerId
          };
        } else if (args.accountIds) {
          where.id = {
            in: args.accountIds
          };
        } else if (args.searchName) {
          where.name = {
            contains: args.searchName
          };
        }
        return context.prisma.account.findMany({
          where,
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
        context.logger.error(`accounts error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },

    account(parent: any, args: QueryAccountArgs, context: DspContext) {

      let accountId = args.accountId;
      if (parent && parent.accountId) {
        accountId = parent.accountId;
      }
      context.logger.debug(`accountId ${accountId}`);
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
            fee: true,
          }
        }
      );

    },
  },
  Mutation: {
    async newAccount(_: any, args: MutationNewAccountArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[accountsResolvers.newAccount] args ${JSON.stringify(args, undefined, 2)}`);

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
        context.logger.debug(`[accountsResolvers.newAccount] dbResult ${JSON.stringify(dbResult, undefined, 2)} `);
        context.pubsub.publish(ACCOUNT_CREATED, dbResult);
        return dbResult;
      } catch (err) {
        context.logger.error(`[accountsResolvers.newAccount] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },
    async mapAccountRetailers(_: any, args: MutationMapAccountRetailersArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.info(`[accountsResolvers.mapAccountRetailers] args ${JSON.stringify(args, undefined, 2)}`);
        const connectIds = args.retailerIds.map((id: InputMaybe<string>) => {
          return {
            id: id || ''
          };
        });
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
            retailers: {
              connect: connectIds
            }

          }
        });
        context.pubsub.publish(ACCOUNT_RETAILERS_UPDATED, dbResult);
        return retailers;
      } catch (err) {
        context.logger.error(`[accountsResolvers.addAccountRetailers] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    }
  },

  Subscription: {
    accountCreated: {
      subscribe: withFilter(
        (_: any, varibles: any, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountCreated] subscribe  ${JSON.stringify(varibles, null, 2)}`);
          return context.pubsub.asyncIterator(ACCOUNT_CREATED);
        },
        (payload, variables, context: DspContext, info: any) => {
          context.logger.debug(`accountCreated variables ${JSON.stringify(variables, null, 2)}`);
          context.logger.debug(`accountCreated payload ${JSON.stringify(payload, null, 2)}`);
          return payload;
        }
      )
    },
    accountBrandedKeywordsDisabled: {
      subscribe: withFilter(
        (_: any, variables: SubscriptionAccountBrandedKeywordsDisabledArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountBrandedKeywordsDisabled] subscribe ${variables}`);
          return context.pubsub.asyncIterator(ACCOUNT_BRANTED_KEYWORDS_DISABLED);
        },
        (payload: any, variables: SubscriptionAccountBrandedKeywordsDisabledArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountBrandedKeywordsDisabled] filter ${payload}, ${variables}`);
          return (payload.accountBrandedKeywordsDisabled.id === variables.accountId);
        }
      ),
    },
    accountBrandedKeywordsEnabled: {
      subscribe: withFilter(
        (_: any, variables: SubscriptionAccountBrandedKeywordsEnabledArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountBrandedKeywordsEnabled] subscribe ${variables}`);
          return context.pubsub.asyncIterator(ACCOUNT_BRANTED_KEYWORDS_ENABLED);
        },
        (payload: any, variables: SubscriptionAccountBrandedKeywordsEnabledArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountBrandedKeywordsEnabled] filter ${payload}, ${variables}`);
          return (payload.accountBrandedKeywordsEnabled.id === variables.accountId);
        }
      ),
    },
    accountBrandsUpated: {
      subscribe: withFilter(
        (_: any, variables: SubscriptionAccountBrandsUpatedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountBrandsUpated] subscribe ${variables}`);
          return context.pubsub.asyncIterator(ACCOUNT_BRANDS_UPATED);
        },
        (payload: any, variables: SubscriptionAccountBrandsUpatedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountBrandsUpated] filter ${payload}, ${variables}`);
          return (payload.accountBrandsUpated.id === variables.accountId);
        }
      ),
    },
    accountCountryAdded: {
      subscribe: withFilter(
        (_: any, variables: SubscriptionAccountCountryAddedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountCountryAdded] subscribe ${variables}`);
          return context.pubsub.asyncIterator(ACCOUNT_COUNTRY_ADDED);
        },
        (payload: any, variables: SubscriptionAccountCountryAddedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountCountryAdded] filter ${payload}, ${variables}`);
          return (payload.accountCountryAdded.id === variables.accountId);
        }
      ),
    },
    accountCurrencyDataChanged: {
      subscribe: withFilter(
        (_: any, variables: SubscriptionAccountCurrencyDataChangedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountCurrencyDataChanged] subscribe ${variables}`);
          return context.pubsub.asyncIterator(ACCOUNT_CURRENCY_DATA_CHANGED);
        },
        (payload: any, variables: SubscriptionAccountCurrencyDataChangedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountCurrencyDataChanged] filter ${payload}, ${variables}`);
          return (payload.accountCurrencyDataChanged.id === variables.accountId);
        }
      ),
    },
    accountFeesModified: {
      subscribe: withFilter(
        (_: any, variables: SubscriptionAccountFeesModifiedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountFeesModified] subscribe ${variables}`);
          return context.pubsub.asyncIterator(ACCOUNT_FEES_MODIFIED);
        },
        (payload: any, variables: SubscriptionAccountFeesModifiedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountFeesModified] filter ${payload}, ${variables}`);
          return (payload.accountFeesModified.id === variables.accountId);
        }
      ),
    },
    accountInitialized: {
      subscribe: withFilter(
        (_: any, variables: SubscriptionAccountInitializedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountInitialized] subscribe ${variables}`);
          return context.pubsub.asyncIterator(ACCOUNT_INITIALIZED);
        },
        (payload: any, variables: SubscriptionAccountInitializedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountInitialized] filter ${payload}, ${variables}`);
          return (payload.accountInitialized.id === variables.accountId);
        }
      ),
    },
    accountReportingLabelModified: {
      subscribe: withFilter(
        (_: any, variables: SubscriptionAccountReportingLabelModifiedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountReportingLabelModified] subscribe ${variables}`);
          return context.pubsub.asyncIterator(ACCOUNT_REPORTING_LABEL_MODIFIED);
        },
        (payload: any, variables: SubscriptionAccountReportingLabelModifiedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountReportingLabelModified] filter ${payload}, ${variables}`);
          return (payload.accountReportingLabelModified.id === variables.accountId);
        }
      ),
    },
    accountRetailerConnected: {
      subscribe: withFilter(
        (_: any, variables: SubscriptionAccountRetailerConnectedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountRetailerConnected] subscribe ${variables}`);
          return context.pubsub.asyncIterator(ACCOUNT_RETAILER_CONNECTED);
        },
        (payload: any, variables: SubscriptionAccountRetailerConnectedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountRetailerConnected] filter ${payload}, ${variables}`);
          return (payload.accountRetailerConnected.id === variables.accountId);
        }
      ),
    },
    accountRetailersUpdated: {
      subscribe: withFilter(
        (_: any, variables: SubscriptionAccountRetailersUpdatedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountRetailersUpdated] subscribe ${variables}`);
          return context.pubsub.asyncIterator(ACCOUNT_RETAILERS_UPDATED);
        },
        (payload: any, variables: SubscriptionAccountRetailersUpdatedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountRetailersUpdated] filter ${payload}, ${variables}`);
          return (payload.accountRetailersUpdated.id === variables.accountId);
        }
      ),
    },
    accountSalesforceDataModified: {
      subscribe: withFilter(
        (_: any, variables: SubscriptionAccountSalesforceDataModifiedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountSalesforceDataModified] subscribe ${variables}`);
          return context.pubsub.asyncIterator(ACCOUNT_SALESFORCE_DATA_MODIFIED);
        },
        (payload: any, variables: SubscriptionAccountSalesforceDataModifiedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountSalesforceDataModified] filter ${payload}, ${variables}`);
          return (payload.accountSalesforceDataModified.id === variables.accountId);
        }
      ),
    },
    accountSellerModified: {
      subscribe: withFilter(
        (_: any, variables: SubscriptionAccountSellerModifiedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountSellerModified] subscribe ${variables}`);
          return context.pubsub.asyncIterator(ACCOUNT_SELLER_MODIFIED);
        },
        (payload: any, variables: SubscriptionAccountSellerModifiedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountSellerModified] filter ${payload}, ${variables}`);
          return (payload.accountSellerModified.id === variables.accountId);
        }
      ),
    },
    accountWhileLabelSettingsCreated: {
      subscribe: withFilter(
        (_: any, variables: SubscriptionAccountWhileLabelSettingsCreatedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountWhileLabelSettingsCreated] subscribe ${variables}`);
          return context.pubsub.asyncIterator(ACCOUNT_WHITE_LABEL_SETTINGS_CREATED);
        },
        (payload: any, variables: SubscriptionAccountWhileLabelSettingsCreatedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountWhileLabelSettingsCreated] filter ${payload}, ${variables}`);
          return (payload.accountWhileLabelSettingsCreated.id === variables.accountId);
        }
      ),
    },
    accountWhileLabelSettingsUpdated: {
      subscribe: withFilter(
        (_: any, variables: SubscriptionAccountWhileLabelSettingsUpdatedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountWhileLabelSettingsUpdated] subscribe ${variables}`);
          return context.pubsub.asyncIterator(ACCOUNT_WHITE_LABEL_SETTINGS_UPDATED);
        },
        (payload: any, variables: SubscriptionAccountWhileLabelSettingsUpdatedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[accountsResolvers.accountWhileLabelSettingsUpdated] filter ${payload}, ${variables}`);
          return (payload.accountWhileLabelSettingsUpdated.id === variables.accountId);
        }
      ),
    },

  }

};