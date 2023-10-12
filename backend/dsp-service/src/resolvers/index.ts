import lodash from 'lodash';
import { accountResolvers } from './accountsResolvers';
import { relationshipResolvers } from "./relationshipResolvers";
import { campaignsResolvers } from './campaignsResolvers';
import { brandResolvers } from './brandsResolvers';
import { commonResolvers } from './commonResolvers';
import { skuResolvers } from './skuResolvers';
import { retailerResolvers } from './retailerResolvers';

export const resolvers: any = lodash.merge(
  accountResolvers,
  relationshipResolvers,
  campaignsResolvers,
  brandResolvers,
  commonResolvers,
  skuResolvers,
  retailerResolvers
);

// console.debug(`[resolvers]`, resolvers);