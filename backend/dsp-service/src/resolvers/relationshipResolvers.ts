// import { Lineitem, Campaign, Account } from "@prisma/client";
import { GraphQLResolveInfo } from "graphql";
import { scalarMoney } from "../MoneyResolver";
import { DspContext } from "../context";
import { brandResolvers } from "./brandsResolvers";
import { accountResolvers } from './accountsResolvers';
import { campaignsResolvers } from './campaignsResolvers';
import { commonResolvers } from './commonResolvers';
import { Account, Campaign, Lineitem, QueryBrandArgs, QueryBrandsArgs, QueryCampaignsArgs, QueryCountriesArgs, QueryLineitemsArgs, QueryRetailerArgs, QueryRetailersArgs, Retailer } from "../resolver-types";
import { retailerResolvers } from "./retailerResolvers";

export const relationshipResolvers/*: Resolvers*/ = {
  Money: scalarMoney,
  Lineitem: {
    campaign(parent: Lineitem, args: any, context: DspContext, info: GraphQLResolveInfo) {
      return campaignsResolvers.Query.campaign(parent, args, context, info);
    },
    retailer(parent: any, args: any, context: DspContext, info: GraphQLResolveInfo) {
      const retailerArgs: QueryRetailerArgs = {
        id: parent.retailerId
      };
      return retailerResolvers.Query.retailer(parent, retailerArgs, context, info);
    }
  },
  Campaign: {
    lineitems(parent: Campaign, args: any, context: DspContext, info: GraphQLResolveInfo) {
      const lineitemsArgs: QueryLineitemsArgs = {
        campaignId: parent.id
      };
      return campaignsResolvers.Query.lineitems(parent, lineitemsArgs, context, info);
    },
    account(parent: Campaign, args: any, context: DspContext, info: GraphQLResolveInfo) {
      return accountResolvers.Query.account(parent, args, context);
    },
  },
  Account: {
    campaigns(parent: Account, args: any, context: DspContext, info: GraphQLResolveInfo) {
      const campaignArgs: QueryCampaignsArgs = {
        accountId: parent.id,
        retailerId: null
      };
      return campaignsResolvers.Query.campaigns(parent, campaignArgs, context, info);
    },
    brands(parent: Account, args: any, context: DspContext, info: GraphQLResolveInfo) {
      const brandsArgs: QueryBrandsArgs = {

      };
      return brandResolvers.Query.brands(parent, brandsArgs, context, info);
    },
    async retailers(parent: any, args: any, context: DspContext, info: GraphQLResolveInfo) {
      const retailersArgs: QueryRetailersArgs = {
        retailerIds: parent.retailerIds

      };
      const retailers = await (await retailerResolvers.Query.retailers(parent, retailersArgs, context, info)).retailers;
      return retailers;
    },
    countries(parent: any, args: any, context: DspContext, info: GraphQLResolveInfo) {
      context.logger.debug('[Account] countryIds', parent.countryIds);
      const countriesQueryArgs: QueryCountriesArgs = {
        countryCodes: parent.countryIds
      };

      return commonResolvers.Query.countries(null, countriesQueryArgs, context, info);
    },
    currency(parent: any, args: any, context: DspContext, info: GraphQLResolveInfo) {
      if (parent.currency)
        return commonResolvers.Query.currency(parent, {
          code: parent.currency
        }, context, info);
      return null;
    },
  },
  Retailer: {
    campaigns(parent: Retailer, args: any, context: DspContext, info: GraphQLResolveInfo) {
      const campaignArgs: QueryCampaignsArgs = {
        accountId: null,
        retailerId: parent.id
      };
      return campaignsResolvers.Query.campaigns(parent, campaignArgs, context, info);
    },
  }
};