import { GraphQLResolveInfo } from "graphql";
import { DspContext } from "../context";
import { Lineitem, Campaign, CampaignType, CampaignStatus, LineitemStatus } from "@prisma/client";
import { QueryLineitemsArgs, LineitemList, QueryLineitemArgs, QueryCampaignsArgs, CampaignList, QueryCampaignArgs, MutationNewCampaignArgs, MutationNewLineitemArgs, MutationActivateLineitemsArgs, SubscriptionLineitemActivatedArgs } from "../resolver-types";
import { topLevelFieldsFromQuery } from "./resolverTools";
import { withFilter } from "graphql-subscriptions";


import { pubsub } from "../context";


const LINEITEM_ACTIVATED_EVENT = 'LINEITEM_ACTIVATED';

const LINEITEM_PAUSED_EVENT = 'LINEITEM_PAUSED';
const LINEITEM_CREATED_EVENT = 'LINEITEM_CREATED';
export const campaignsResolvers/*: Resolvers*/ = {
  Query: {
    async lineitems(_: any, args: QueryLineitemsArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        console.debug('[campaignsResolvers.lineitems] args', args);
        const offset = args.offset || 0;
        const limit = args.limit || 100;
        const campaignId = args.campaignId || '';
        console.debug('[campaignsResolvers.lineitems] campaignId', campaignId);

        const where: any = {
          campaignId: campaignId
        };
        // row count
        let rowCount = await context.prisma.lineitem.count({ where });

        const dbResult = await context.prisma.lineitem.findMany({
          where,
          skip: offset,
          take: limit
        });
        console.debug('[campaignsResolvers.lineitems] dbResult', dbResult);
        return {
          lineitems: dbResult,
          offset,
          limit,
          totalCount: rowCount
        };
      } catch (err) {
        console.error('[campaignsResolvers.lineitems] error', err);
        throw err;
      }
    },
    lineitem(parent: any, args: QueryLineitemArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        console.debug('[campaignsResolvers.lineitem] args', args);
        let lineitemId = args.id;
        if (parent && parent.lineitemId) {
          lineitemId = parent.lineitemId;
        }
        const topLevelFields = topLevelFieldsFromQuery(info);


        return context.prisma.lineitem.findUnique(
          {
            where: {
              id: lineitemId
            },
            // select: {
            //   id: true,
            //   name: true,
            //   campaignId: true,
            //   status: true,
            //   budgetId: true,
            //   startDate: true,
            //   endDate: true,
            //   retailerId: true,
            //   audienceId: true,

            // }
          }
        );
      } catch (err) {
        console.error('[campaignsResolvers.lineitem] error', err);
        throw err;
      }
    },

    async campaigns(parent: any, args: QueryCampaignsArgs, context: DspContext, info: GraphQLResolveInfo) {
      console.debug('[campaignsResolvers.campaigns] parent, args', parent, args);
      try {

        const topLevelFields = topLevelFieldsFromQuery(info);

        const page = args.page ? args.page : 0;
        const size = args.size ? args.size : 100;
        let rowCount: Number | undefined = undefined;

        const where: any = {};
        if (args.accountId) {
          where.accountId = args.accountId;
        } else if (args.retailerId) {
          where.retailerId = args.retailerId;
        } else if (args.retailerId) {
          where.brandId = args.brandId;
        } else
          return {
            campaigns: [],
            page: page,
            size: size,
            totalCount: 0
          };


        console.debug('[campaignsResolvers.campaigns] where', where);
        // row count
        if (topLevelFields?.includes('totalCount')) {
          rowCount = await context.prisma.campaign.count({ where });
        }

        const dbResult = await context.prisma.campaign.findMany({
          where,

          // skip: page * size,
          // take: size
        });
        console.debug('[campaignsResolvers.campaigns] dbResult', dbResult);
        return {
          campaigns: dbResult,
          page: page,
          size: size,
          totalCount: rowCount
        };
      } catch (err) {
        console.error('[campaignsResolvers.campaigns] error', err);
        throw err;
      }
    },
    campaign(parent: any, args: QueryCampaignArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        console.debug('[campaignsResolvers.campaign] args', args);
        console.debug('[campaignsResolvers.campaign] parent', parent);
        let campaignId = args.id;

        if (parent && parent.campaignId) {
          campaignId = parent.campaignId;
        }
        return context.prisma.campaign.findUnique(
          {
            where: {
              id: campaignId
            },
          }
        );
      } catch (err) {
        console.error('[campaignsResolvers.campaign]  error', err);
        throw err;
      }
    },
  },
  Mutation: {

    async newCampaign(_: any, args: MutationNewCampaignArgs, context: DspContext, info: GraphQLResolveInfo): Promise<Campaign> {
      try {
        console.debug('newCampaign', args.campaign);

        const camp: any = {
          name: args.campaign.name,
          type: args.campaign.type?.toString(),
          startDate: args.campaign.startDate,
          endDate: args.campaign.endDate,
          status: CampaignStatus.Inactive.toString(),
          accountId: args.advertiserId,
          advertiserId: (args.advertiserId)
        };

        const dbResult = await context.prisma.campaign.create({
          data: camp
        });
        console.debug('newCampaign dbResult', dbResult);

        const newCampaign: Campaign = {
          ...dbResult,
          id: dbResult.id.toString(),
          type: dbResult.type as CampaignType,
          status: dbResult.status as CampaignStatus,
        };

        pubsub.publish('CAMPAIGN_CREATED', newCampaign);

        return newCampaign;
      } catch (err) {
        console.error('newCampaign error', err);
        throw err;
      }
    },
    async newLineitem(_: any, args: MutationNewLineitemArgs, context: DspContext, info: GraphQLResolveInfo): Promise<Lineitem> {
      try {
        console.debug('newLineitem args ', args);
        const line: any = {
          name: args.lineitem.name,
          status: LineitemStatus.Paused,
          campaignId: args.campaignId,
          startDate: args.lineitem.startDate,
          endDate: args.lineitem.endDate,
          // budgetId: "",

        };

        const dbResult = await context.prisma.lineitem.create({
          data: line
        });
        console.debug('newLineitem dbResult', dbResult);

        const newLineitem: any = {
          ...dbResult,
          id: dbResult.id.toString(),
          status: dbResult.status as LineitemStatus,
        };

        pubsub.publish(LINEITEM_CREATED_EVENT, newLineitem);

        return newLineitem;
      } catch (err) {
        console.error('newLineitem error', err);
        throw err;
      }
    },
    async activateLineitems(_: any, args: MutationActivateLineitemsArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        console.debug('[campaignsResolvers.activateLineitems] args ', args);

        const toUpdate: string[] = args.lineitemIds as string[];
        if (toUpdate.length === 0) {
          return [];
        }
        const where: any = {
          id: {
            in: toUpdate
          }
        };

        const [writeOp, readOp] = await context.prisma.$transaction([
          context.prisma.lineitem.updateMany({
            where,
            data: {
              status: LineitemStatus.Active
            }
          }),

          context.prisma.lineitem.findMany({
            where
          })
        ]
        );
        console.debug('[campaignsResolvers.activateLineitems] writeOp', writeOp);

        if (readOp) {
          readOp.forEach((li) => {
            pubsub.publish(LINEITEM_ACTIVATED_EVENT, {
              lineitemActivated: li
            });
            console.debug('[campaignsResolvers.activateLineitems] published LINEITEM_ACTIVATED_EVENT', LINEITEM_ACTIVATED_EVENT, li);
          });
          return readOp;
        }
        else return [];
      } catch (err) {
        console.error('[campaignsResolvers.activateLineitems] error', err);
        throw err;
      }
    },

    async pauseLineitems(_: any, args: MutationActivateLineitemsArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        console.debug('[campaignsResolvers.pauseLineitems] args ', args);
        const toUpdate: string[] = args.lineitemIds as string[];
        if (toUpdate.length === 0) {
          return [];
        }

        const where: any = {
          id: {
            in: toUpdate
          }
        };
        const [writeOp, readOp] = await context.prisma.$transaction([
          context.prisma.lineitem.updateMany({
            where,
            data: {
              status: LineitemStatus.Paused
            }
          }),

          context.prisma.lineitem.findMany({
            where
          })
        ]
        );
        console.debug('[campaignsResolvers.pauseLineitems] writeOp', writeOp);

        if (readOp) {
          readOp.forEach((li) => {

            pubsub.publish(LINEITEM_PAUSED_EVENT, {
              lineitemPaused: li
            });
            console.debug('[campaignsResolvers.pauseLineitems] published LINEITEM_PAUSED_EVENT', LINEITEM_PAUSED_EVENT, li);
          });

          return readOp;
        }
        else return [];
      } catch (err) {
        console.error('[campaignsResolvers.pauseLineitems] error', err);
        throw err;
      }
    },

  },
  Subscription: {
    lineitemActivated: {
      subscribe: withFilter(
        // asyncIteratorFn
        (_: any, variables: SubscriptionLineitemActivatedArgs, context: DspContext, info: any) => {
          console.debug('[campaignsResolvers.lineitemActivated] subscribe', variables);
          return pubsub.asyncIterator(LINEITEM_ACTIVATED_EVENT);
        },
        // filterFn 
        (payload: any, variables: SubscriptionLineitemActivatedArgs, context: DspContext, info: any) => {
          console.debug('[campaignsResolvers.lineitemActivated] filter', payload, variables);
          return (payload.lineitemActivated.id === variables.lineitemId);
        }
      ),
    },

    lineitemPaused: {
      subscribe: withFilter(
        // asyncIteratorFn
        (_: any, variables: SubscriptionLineitemActivatedArgs, context: DspContext, info: any) => {
          console.debug('[campaignsResolvers.lineitemPaused] subscribe', variables);
          return pubsub.asyncIterator(LINEITEM_PAUSED_EVENT);
        },
        // filterFn 
        (payload: any, variables: SubscriptionLineitemActivatedArgs, context: DspContext, info: any) => {
          console.debug('[campaignsResolvers.lineitemPaused] filter', payload, variables);
          return (payload.lineitemPaused.id === variables.lineitemId);
        }
      ),
    },
  }
};