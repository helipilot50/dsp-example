"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersResolvers = exports.PORTFOLIO_BRANDS_UPDATED = exports.PORTFOLIO_ACCOUNTS_UPDATED = exports.PORTFOLIO_CREATED = exports.PORTFOLIO_USERS_UPDATED = void 0;
const clerk_1 = require("../clerk");
function clerkUserToUser(clerkUser) {
    return {
        ...clerkUser,
        createdAt: new Date(clerkUser.createdAt),
        updatedAt: new Date(clerkUser.updatedAt),
    };
}
exports.PORTFOLIO_USERS_UPDATED = 'PORTFOLIO_USERS_UPDATED';
exports.PORTFOLIO_CREATED = 'PORTFOLIO_CREATED';
exports.PORTFOLIO_ACCOUNTS_UPDATED = 'PORTFOLIO_ACCOUNTS_UPDATED';
exports.PORTFOLIO_BRANDS_UPDATED = 'PORTFOLIO_BRANDS_UPDATED';
exports.usersResolvers /*: Resolvers*/ = {
    Query: {
        async user(_, args, context, info) {
            try {
                context.logger.debug(`[usersResolvers.user] args ${JSON.stringify(args, undefined, 2)}`);
                const foundUser = await (0, clerk_1.userById)(args.userId);
                context.logger.debug(`[usersResolvers.user] foundUser ${foundUser}`);
                return clerkUserToUser(foundUser);
            }
            catch (err) {
                context.logger.error(`[usersResolvers.user] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async users(_, args, context, info) {
            try {
                context.logger.debug(`[usersResolvers.users] args ${JSON.stringify(args, undefined, 2)}`);
                const users = await (0, clerk_1.userList)();
                context.logger.debug(`[usersResolvers.users] user list ${users}`);
                return users.map((user) => clerkUserToUser(user));
            }
            catch (err) {
                context.logger.error(`[usersResolvers.users] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async me(_, args, context, info) {
            try {
                context.logger.debug(`[usersResolvers.me] args ${JSON.stringify(args, undefined, 2)}`);
                const itsMe = await (0, clerk_1.userByToken)(context.token);
                context.logger.debug(`[usersResolvers.me] itsMe ${itsMe}`);
                return clerkUserToUser(itsMe);
            }
            catch (err) {
                context.logger.error(`[usersResolvers.me] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async myPortfolio(_, args, context, info) {
            try {
                context.logger.debug(`[usersResolvers.myPortfolio] args ${JSON.stringify(args, undefined, 2)}`);
                if (!context.user) {
                    throw new Error('No user found');
                }
                const itsMe = context.user;
                context.logger.debug(`[usersResolvers.myPortfolio] itsMe ${itsMe.username}`);
                const dbresult = context.prisma.portfolio.findFirst({
                    where: {
                        userIds: {
                            has: itsMe.id
                        }
                    }
                });
                return dbresult;
            }
            catch (err) {
                context.logger.error(`[usersResolvers.myPortfolio] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async portfolio(_, args, context, info) {
            try {
                context.logger.debug(`[usersResolvers.portfolio] args ${JSON.stringify(args, undefined, 2)}`);
                const dbresult = context.prisma.portfolio.findUnique({ where: { id: args.portfolioId } });
                return dbresult;
            }
            catch (err) {
                context.logger.error(`[usersResolvers.portfolio] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async portfolios(_, args, context, info) {
            try {
                context.logger.debug(`[usersResolvers.portfolios] args ${JSON.stringify(args, undefined, 2)}`);
                const dbresult = context.prisma.portfolio.findMany();
                return dbresult;
            }
            catch (err) {
                context.logger.error(`[usersResolvers.portfolios] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        }
    },
    Mutation: {
        async newPortfolio(_, args, context, info) {
            context.logger.debug(`[usersResolvers.newPortfolio] args ${JSON.stringify(args, undefined, 2)}`);
            try {
                const dbresult = await context.prisma.portfolio.create({
                    data: {
                        name: args.name,
                        description: args.description || '',
                        userIds: [],
                        accountIds: [],
                    }
                });
                context.pubsub.publish(exports.PORTFOLIO_CREATED, { portfolioCreated: dbresult });
                return dbresult;
            }
            catch (err) {
                context.logger.error(`[usersResolvers.newPortfolio] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async mapUsersToPortfolio(_, args, context, info) {
            context.logger.debug(`[usersResolvers.mapUsersToPortfolio] args ${JSON.stringify(args, undefined, 2)}`);
            try {
                const userIds = (args.userIds.length > 0) ? args.userIds : [];
                const dbResult = await context.prisma.portfolio.update({
                    where: {
                        id: args.portfolioId
                    },
                    data: {
                        userIds: {
                            set: userIds
                        }
                    }
                });
                context.pubsub.publish(exports.PORTFOLIO_USERS_UPDATED, { portfolioUpdated: dbResult });
                return dbResult;
            }
            catch (err) {
                context.logger.error(`[usersResolvers.mapUsersToPortfolio] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async mapAccountsToPortfolio(_, args, context, info) {
            context.logger.debug(`[usersResolvers.mapAccountsToPortfolio] args ${JSON.stringify(args, undefined, 2)}`);
            try {
                const accountIds = (args.accountIds.length > 0) ? args.accountIds : [];
                const dbResult = await context.prisma.portfolio.update({
                    where: {
                        id: args.portfolioId
                    },
                    data: {
                        accountIds: {
                            set: accountIds
                        }
                    }
                });
                context.pubsub.publish(exports.PORTFOLIO_ACCOUNTS_UPDATED, { portfolioUpdated: dbResult });
            }
            catch (err) {
                context.logger.error(`[usersResolvers.mapAccountsToPortfolio] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        },
        async mapBrandsToPortfolio(_, args, context, info) {
            context.logger.debug(`[usersResolvers.mapBrandsToPortfolio] args ${JSON.stringify(args, undefined, 2)}`);
            try {
                const brandIds = (args.brandIds.length > 0) ? args.brandIds : [];
                const dbResult = await context.prisma.portfolio.update({
                    where: {
                        id: args.portfolioId
                    },
                    data: {
                        userIds: {
                            set: brandIds
                        }
                    }
                });
                context.pubsub.publish(exports.PORTFOLIO_BRANDS_UPDATED, { portfolioUpdated: dbResult });
            }
            catch (err) {
                context.logger.error(`[usersResolvers.mapBrandsToPortfolio] error ${JSON.stringify(err, undefined, 2)}`);
                throw err;
            }
        }
    }
};
