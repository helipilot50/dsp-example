import { GraphQLResolveInfo } from "graphql";
import { DspContext } from "../context";
import { Lineitem, Campaign, CampaignType, CampaignStatus, LineitemStatus } from "@prisma/client";
import { QueryLineitemsArgs, LineitemList, QueryLineitemArgs, QueryCampaignsArgs, CampaignList, QueryCampaignArgs, MutationNewCampaignArgs, MutationNewLineitemArgs, MutationActivateLineitemsArgs, SubscriptionLineitemActivatedArgs } from "../resolver-types";
import { topLevelFieldsFromQuery } from "./resolverTools";
import { withFilter } from "graphql-subscriptions";

// TODO fix context for subscriptions
import { pubsub } from "../context";
import { logger } from "../logger";


const LINEITEM_ACTIVATED_EVENT = 'LINEITEM_ACTIVATED';

const LINEITEM_PAUSED_EVENT = 'LINEITEM_PAUSED';
const LINEITEM_CREATED_EVENT = 'LINEITEM_CREATED';
export const campaignsResolvers/*: Resolvers*/ = {
  Query: {
    async lineitems(_: any, args: QueryLineitemsArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[campaignsResolvers.lineitems] args ${JSON.stringify(args, undefined, 2)}`);
        const offset = args.offset || 0;
        const limit = args.limit || 100;
        const campaignId = args.campaignId || '';
        context.logger.debug(`[campaignsResolvers.lineitems] campaignId ${campaignId}`);

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
        context.logger.debug(`[campaignsResolvers.lineitems] dbResult ${JSON.stringify(dbResult, undefined, 2)} `);
        return {
          lineitems: dbResult,
          offset,
          limit,
          totalCount: rowCount
        };
      } catch (err) {
        context.logger.error(`[campaignsResolvers.lineitems] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },
    lineitem(parent: any, args: QueryLineitemArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[campaignsResolvers.lineitem] args ${JSON.stringify(args, undefined, 2)}`);
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
        context.logger.error(`[campaignsResolvers.lineitem] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },

    async campaigns(parent: any, args: QueryCampaignsArgs, context: DspContext, info: GraphQLResolveInfo) {
      context.logger.debug(`[campaignsResolvers.campaigns] parent, args ${JSON.stringify(parent, undefined, 2)}, ${JSON.stringify(args, undefined, 2)}`);
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


        context.logger.debug(`[campaignsResolvers.campaigns] where ${where}`);
        // row count
        if (topLevelFields?.includes('totalCount')) {
          rowCount = await context.prisma.campaign.count({ where });
        }

        const dbResult = await context.prisma.campaign.findMany({
          where,

          // skip: page * size,
          // take: size
        });
        context.logger.debug(`[campaignsResolvers.campaigns] dbResult ${JSON.stringify(dbResult, undefined, 2)} `);
        return {
          campaigns: dbResult,
          page: page,
          size: size,
          totalCount: rowCount
        };
      } catch (err) {
        context.logger.error(`[campaignsResolvers.campaigns] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },
    campaign(parent: any, args: QueryCampaignArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[campaignsResolvers.campaign] args ${JSON.stringify(args, undefined, 2)}`);
        context.logger.debug(`[campaignsResolvers.campaign] parent ${JSON.stringify(parent, undefined, 2)}`);
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
        context.logger.error(`[campaignsResolvers.campaign]  error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },
  },
  Mutation: {

    async newCampaign(_: any, args: MutationNewCampaignArgs, context: DspContext, info: GraphQLResolveInfo): Promise<Campaign> {
      try {
        context.logger.debug(`newCampaign ${args.campaign}`);

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
        context.logger.debug(`newCampaign dbResult ${JSON.stringify(dbResult, undefined, 2)} `);

        const newCampaign: Campaign = {
          ...dbResult,
          id: dbResult.id.toString(),
          type: dbResult.type as CampaignType,
          status: dbResult.status as CampaignStatus,
        };

        pubsub.publish('CAMPAIGN_CREATED', newCampaign);

        return newCampaign;
      } catch (err) {
        context.logger.error(`newCampaign error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },
    async newLineitem(_: any, args: MutationNewLineitemArgs, context: DspContext, info: GraphQLResolveInfo): Promise<Lineitem> {
      try {
        context.logger.debug(`newLineitem args  ${JSON.stringify(args, undefined, 2)}`);
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
        context.logger.debug(`newLineitem dbResult ${JSON.stringify(dbResult, undefined, 2)} `);

        const newLineitem: any = {
          ...dbResult,
          id: dbResult.id.toString(),
          status: dbResult.status as LineitemStatus,
        };

        pubsub.publish(LINEITEM_CREATED_EVENT, newLineitem);

        return newLineitem;
      } catch (err) {
        context.logger.error(`newLineitem error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },
    async activateLineitems(_: any, args: MutationActivateLineitemsArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[campaignsResolvers.activateLineitems] args  ${JSON.stringify(args, undefined, 2)}`);

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
        context.logger.debug(`[campaignsResolvers.activateLineitems] writeOp ${writeOp}`);

        if (readOp) {
          readOp.forEach((li) => {
            pubsub.publish(LINEITEM_ACTIVATED_EVENT, {
              lineitemActivated: li
            });
            context.logger.debug(`[campaignsResolvers.activateLineitems] published LINEITEM_ACTIVATED_EVENT ${LINEITEM_ACTIVATED_EVENT}, ${li}`);
          });
          return readOp;
        }
        else return [];
      } catch (err) {
        context.logger.error(`[campaignsResolvers.activateLineitems] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },

    async pauseLineitems(_: any, args: MutationActivateLineitemsArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[campaignsResolvers.pauseLineitems] args  ${JSON.stringify(args, undefined, 2)}`);
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
        context.logger.debug(`[campaignsResolvers.pauseLineitems] writeOp ${writeOp}`);

        if (readOp) {
          readOp.forEach((li) => {

            pubsub.publish(LINEITEM_PAUSED_EVENT, {
              lineitemPaused: li
            });
            context.logger.debug(`[campaignsResolvers.pauseLineitems] published LINEITEM_PAUSED_EVENT ${LINEITEM_PAUSED_EVENT}, ${li}`);
          });

          return readOp;
        }
        else return [];
      } catch (err) {
        context.logger.error(`[campaignsResolvers.pauseLineitems] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },

  },
  Subscription: {
    lineitemActivated: {
      subscribe: withFilter(
        // asyncIteratorFn
        (_: any, variables: SubscriptionLineitemActivatedArgs, context: DspContext, info: any) => {
          logger.debug(`[campaignsResolvers.lineitemActivated] subscribe ${variables}`);
          return pubsub.asyncIterator(LINEITEM_ACTIVATED_EVENT);
        },
        // filterFn 
        (payload: any, variables: SubscriptionLineitemActivatedArgs, context: DspContext, info: any) => {
          logger.debug(`[campaignsResolvers.lineitemActivated] filter ${payload}, ${variables}`);
          return (payload.lineitemActivated.id === variables.lineitemId);
        }
      ),
    },

    lineitemPaused: {
      subscribe: withFilter(
        // asyncIteratorFn
        (_: any, variables: SubscriptionLineitemActivatedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[campaignsResolvers.lineitemPaused] subscribe ${variables}`);
          return context.pubsub.asyncIterator(LINEITEM_PAUSED_EVENT);
        },
        // filterFn 
        (payload: any, variables: SubscriptionLineitemActivatedArgs, context: DspContext, info: any) => {
          context.logger.debug(`[campaignsResolvers.lineitemPaused] filter ${payload}, ${variables}`);
          return (payload.lineitemPaused.id === variables.lineitemId);
        }
      ),
    },
  }
};