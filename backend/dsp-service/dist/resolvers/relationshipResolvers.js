"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationshipResolvers = void 0;
const MoneyResolver_1 = require("../MoneyResolver");
const brandsResolvers_1 = require("./brandsResolvers");
const accountsResolvers_1 = require("./accountsResolvers");
const campaignsResolvers_1 = require("./campaignsResolvers");
const commonResolvers_1 = require("./commonResolvers");
const retailerResolvers_1 = require("./retailerResolvers");
const clerk_1 = require("../clerk");
exports.relationshipResolvers /*: Resolvers*/ = {
    Money: MoneyResolver_1.scalarMoney,
    Lineitem: {
        campaign(parent, args, context, info) {
            return campaignsResolvers_1.campaignsResolvers.Query.campaign(parent, args, context, info);
        },
        retailer(parent, args, context, info) {
            const retailerArgs = {
                id: parent.retailerId
            };
            return retailerResolvers_1.retailerResolvers.Query.retailer(parent, retailerArgs, context, info);
        }
    },
    Campaign: {
        lineitems(parent, args, context, info) {
            const lineitemsArgs = {
                campaignId: parent.id
            };
            return campaignsResolvers_1.campaignsResolvers.Query.lineitems(parent, lineitemsArgs, context, info);
        },
        account(parent, args, context, info) {
            return accountsResolvers_1.accountResolvers.Query.account(parent, args, context);
        },
    },
    Account: {
        campaigns(parent, args, context, info) {
            const campaignArgs = {
                accountId: parent.id,
                retailerId: null
            };
            return campaignsResolvers_1.campaignsResolvers.Query.campaigns(parent, campaignArgs, context, info);
        },
        brands(parent, args, context, info) {
            const brandsArgs = {
                brandIds: parent.brandIds
            };
            return brandsResolvers_1.brandResolvers.Query.brands(parent, brandsArgs, context, info);
        },
        async retailers(parent, args, context, info) {
            const retailersArgs = {
                retailerIds: parent.retailerIds
            };
            const retailers = await (await retailerResolvers_1.retailerResolvers.Query.retailers(parent, retailersArgs, context, info)).retailers;
            return retailers;
        },
        countries(parent, args, context, info) {
            context.logger.debug(`[Account] countryIds ${parent.countryIds}`);
            const countriesQueryArgs = {
                countryCodes: parent.countryIds
            };
            return commonResolvers_1.commonResolvers.Query.countries(null, countriesQueryArgs, context, info);
        },
        currency(parent, args, context, info) {
            if (parent.currency)
                return commonResolvers_1.commonResolvers.Query.currency(parent, {
                    code: parent.currency
                }, context, info);
            return null;
        },
    },
    Retailer: {
        campaigns(parent, args, context, info) {
            const campaignArgs = {
                accountId: null,
                retailerId: parent.id
            };
            return campaignsResolvers_1.campaignsResolvers.Query.campaigns(parent, campaignArgs, context, info);
        },
    },
    Portfolio: {
        async users(parent, args, context, info) {
            try {
                context.logger.debug(`[relationshipResolvers.Portfolio.userIds] args ${JSON.stringify(parent.userIds, undefined, 2)}`);
                return Promise.all(parent.userIds.map((userId) => (0, clerk_1.userById)(userId)));
            }
            catch (err) {
                context.logger.error(`[relationshipResolvers.Portfolio.users] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async accounts(parent, args, context, info) {
            try {
                context.logger.debug(`[relationshipResolvers.Portfolio.accounts] accountIds ${JSON.stringify(parent.accountIds, undefined, 2)}`);
                const accountsArgs = {
                    accountIds: parent.accountIds
                };
                return accountsResolvers_1.accountResolvers.Query.accounts(null, accountsArgs, context, info);
            }
            catch (err) {
                context.logger.error(`[relationshipResolvers.Portfolio.accounts] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        }
    },
};
