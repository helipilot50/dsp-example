"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignsResolvers = void 0;
const client_1 = require("@prisma/client");
const resolverTools_1 = require("./resolverTools");
const graphql_subscriptions_1 = require("graphql-subscriptions");
// TODO fix context for subscriptions
const context_1 = require("../context");
const LINEITEM_ACTIVATED_EVENT = 'LINEITEM_ACTIVATED';
const LINEITEM_PAUSED_EVENT = 'LINEITEM_PAUSED';
const LINEITEM_CREATED_EVENT = 'LINEITEM_CREATED';
exports.campaignsResolvers /*: Resolvers*/ = {
    Query: {
        async lineitems(_, args, context, info) {
            try {
                context.logger.debug(`[campaignsResolvers.lineitems] args ${JSON.stringify(args, undefined, 2)}`);
                const offset = args.offset || 0;
                const limit = args.limit || 100;
                const campaignId = args.campaignId || '';
                context.logger.debug(`[campaignsResolvers.lineitems] campaignId ${campaignId}`);
                const where = {
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
            }
            catch (err) {
                context.logger.error(`[campaignsResolvers.lineitems] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        lineitem(parent, args, context, info) {
            try {
                context.logger.debug(`[campaignsResolvers.lineitem] args ${JSON.stringify(args, undefined, 2)}`);
                let lineitemId = args.id;
                if (parent && parent.lineitemId) {
                    lineitemId = parent.lineitemId;
                }
                const topLevelFields = (0, resolverTools_1.topLevelFieldsFromQuery)(info);
                return context.prisma.lineitem.findUnique({
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
                });
            }
            catch (err) {
                context.logger.error(`[campaignsResolvers.lineitem] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async campaigns(parent, args, context, info) {
            context.logger.debug(`[campaignsResolvers.campaigns] parent, args ${JSON.stringify(parent, undefined, 2)}, ${JSON.stringify(args, undefined, 2)}`);
            try {
                const topLevelFields = (0, resolverTools_1.topLevelFieldsFromQuery)(info);
                const page = args.page ? args.page : 0;
                const size = args.size ? args.size : 100;
                let rowCount = undefined;
                const where = {};
                if (args.accountId) {
                    where.accountId = args.accountId;
                }
                else if (args.retailerId) {
                    where.retailerId = args.retailerId;
                }
                else if (args.retailerId) {
                    where.brandId = args.brandId;
                }
                else
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
            }
            catch (err) {
                context.logger.error(`[campaignsResolvers.campaigns] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        campaign(parent, args, context, info) {
            try {
                context.logger.debug(`[campaignsResolvers.campaign] args ${JSON.stringify(args, undefined, 2)}`);
                context.logger.debug(`[campaignsResolvers.campaign] parent ${JSON.stringify(parent, undefined, 2)}`);
                let campaignId = args.id;
                if (parent && parent.campaignId) {
                    campaignId = parent.campaignId;
                }
                return context.prisma.campaign.findUnique({
                    where: {
                        id: campaignId
                    },
                });
            }
            catch (err) {
                context.logger.error(`[campaignsResolvers.campaign]  error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
    },
    Mutation: {
        async newCampaign(_, args, context, info) {
            try {
                context.logger.debug(`newCampaign ${args.campaign}`);
                const camp = {
                    name: args.campaign.name,
                    type: args.campaign.type?.toString(),
                    startDate: args.campaign.startDate,
                    endDate: args.campaign.endDate,
                    status: client_1.CampaignStatus.Inactive.toString(),
                    accountId: args.advertiserId,
                    advertiserId: (args.advertiserId)
                };
                const dbResult = await context.prisma.campaign.create({
                    data: camp
                });
                context.logger.debug(`newCampaign dbResult ${JSON.stringify(dbResult, undefined, 2)} `);
                const newCampaign = {
                    ...dbResult,
                    id: dbResult.id.toString(),
                    type: dbResult.type,
                    status: dbResult.status,
                };
                context_1.pubsub.publish('CAMPAIGN_CREATED', newCampaign);
                return newCampaign;
            }
            catch (err) {
                context.logger.error(`newCampaign error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async newLineitem(_, args, context, info) {
            try {
                context.logger.debug(`newLineitem args  ${JSON.stringify(args, undefined, 2)}`);
                const line = {
                    name: args.lineitem.name,
                    status: client_1.LineitemStatus.Paused,
                    campaignId: args.campaignId,
                    startDate: args.lineitem.startDate,
                    endDate: args.lineitem.endDate,
                    // budgetId: "",
                };
                const dbResult = await context.prisma.lineitem.create({
                    data: line
                });
                context.logger.debug(`newLineitem dbResult ${JSON.stringify(dbResult, undefined, 2)} `);
                const newLineitem = {
                    ...dbResult,
                    id: dbResult.id.toString(),
                    status: dbResult.status,
                };
                context_1.pubsub.publish(LINEITEM_CREATED_EVENT, newLineitem);
                return newLineitem;
            }
            catch (err) {
                context.logger.error(`newLineitem error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async activateLineitems(_, args, context, info) {
            try {
                context.logger.debug(`[campaignsResolvers.activateLineitems] args  ${JSON.stringify(args, undefined, 2)}`);
                const toUpdate = args.lineitemIds;
                if (toUpdate.length === 0) {
                    return [];
                }
                const where = {
                    id: {
                        in: toUpdate
                    }
                };
                const [writeOp, readOp] = await context.prisma.$transaction([
                    context.prisma.lineitem.updateMany({
                        where,
                        data: {
                            status: client_1.LineitemStatus.Active
                        }
                    }),
                    context.prisma.lineitem.findMany({
                        where
                    })
                ]);
                context.logger.debug(`[campaignsResolvers.activateLineitems] writeOp ${writeOp}`);
                if (readOp) {
                    readOp.forEach((li) => {
                        context_1.pubsub.publish(LINEITEM_ACTIVATED_EVENT, {
                            lineitemActivated: li
                        });
                        context.logger.debug(`[campaignsResolvers.activateLineitems] published LINEITEM_ACTIVATED_EVENT ${LINEITEM_ACTIVATED_EVENT}, ${li}`);
                    });
                    return readOp;
                }
                else
                    return [];
            }
            catch (err) {
                context.logger.error(`[campaignsResolvers.activateLineitems] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async pauseLineitems(_, args, context, info) {
            try {
                context.logger.debug(`[campaignsResolvers.pauseLineitems] args  ${JSON.stringify(args, undefined, 2)}`);
                const toUpdate = args.lineitemIds;
                if (toUpdate.length === 0) {
                    return [];
                }
                const where = {
                    id: {
                        in: toUpdate
                    }
                };
                const [writeOp, readOp] = await context.prisma.$transaction([
                    context.prisma.lineitem.updateMany({
                        where,
                        data: {
                            status: client_1.LineitemStatus.Paused
                        }
                    }),
                    context.prisma.lineitem.findMany({
                        where
                    })
                ]);
                context.logger.debug(`[campaignsResolvers.pauseLineitems] writeOp ${writeOp}`);
                if (readOp) {
                    readOp.forEach((li) => {
                        context_1.pubsub.publish(LINEITEM_PAUSED_EVENT, {
                            lineitemPaused: li
                        });
                        context.logger.debug(`[campaignsResolvers.pauseLineitems] published LINEITEM_PAUSED_EVENT ${LINEITEM_PAUSED_EVENT}, ${li}`);
                    });
                    return readOp;
                }
                else
                    return [];
            }
            catch (err) {
                context.logger.error(`[campaignsResolvers.pauseLineitems] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
    },
    Subscription: {
        lineitemActivated: {
            subscribe: (0, graphql_subscriptions_1.withFilter)(
            // asyncIteratorFn
            (_, variables, context, info) => {
                context.logger.debug(`[campaignsResolvers.lineitemActivated] subscribe ${variables}`);
                return context_1.pubsub.asyncIterator(LINEITEM_ACTIVATED_EVENT);
            }, 
            // filterFn 
            (payload, variables, context, info) => {
                context.logger.debug(`[campaignsResolvers.lineitemActivated] filter ${payload}, ${variables}`);
                return (payload.lineitemActivated.id === variables.lineitemId);
            }),
        },
        lineitemPaused: {
            subscribe: (0, graphql_subscriptions_1.withFilter)(
            // asyncIteratorFn
            (_, variables, context, info) => {
                context.logger.debug(`[campaignsResolvers.lineitemPaused] subscribe ${variables}`);
                return context.pubsub.asyncIterator(LINEITEM_PAUSED_EVENT);
            }, 
            // filterFn 
            (payload, variables, context, info) => {
                context.logger.debug(`[campaignsResolvers.lineitemPaused] filter ${payload}, ${variables}`);
                return (payload.lineitemPaused.id === variables.lineitemId);
            }),
        },
    }
};
