import { GraphQLResolveInfo } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { DspContext } from "../context";
import { topLevelFieldsFromQuery } from "./resolverTools";
import { MutationMapAccountsToPortfolioArgs, MutationMapBrandsToPortfolioArgs, MutationMapUsersToPortfolioArgs, MutationNewPortfolioArgs, QueryPortfolioArgs, QueryUserArgs, QueryUsersArgs } from "../resolver-types";

import { User, userById, userByToken, userList } from '../clerk';

function clerkUserToUser(clerkUser: User) {
  return {
    ...clerkUser,
    createdAt: new Date(clerkUser.createdAt),
    updatedAt: new Date(clerkUser.updatedAt),
  };
}

export const PORTFOLIO_USERS_UPDATED = 'PORTFOLIO_USERS_UPDATED';
export const PORTFOLIO_CREATED = 'PORTFOLIO_CREATED';
export const PORTFOLIO_ACCOUNTS_UPDATED = 'PORTFOLIO_ACCOUNTS_UPDATED';
export const PORTFOLIO_BRANDS_UPDATED = 'PORTFOLIO_BRANDS_UPDATED';

export const usersResolvers/*: Resolvers*/ = {

  Query: {

    async user(_: any, args: QueryUserArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[usersResolvers.user] args ${JSON.stringify(args, undefined, 2)}`);
        const foundUser: User = await userById(args.userId);
        context.logger.debug(`[usersResolvers.user] foundUser ${foundUser}`);
        return clerkUserToUser(foundUser);
      } catch (err) {
        context.logger.error(`[usersResolvers.user] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },

    async users(_: any, args: QueryUsersArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[usersResolvers.users] args ${JSON.stringify(args, undefined, 2)}`);
        const users: User[] = await userList();
        context.logger.debug(`[usersResolvers.users] user list ${users}`);
        return users.map((user: User) => clerkUserToUser(user));
      } catch (err) {
        context.logger.error(`[usersResolvers.users] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },

    async me(_: any, args: any, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[usersResolvers.me] args ${JSON.stringify(args, undefined, 2)}`);
        const itsMe: User = await userByToken(context.token as string);
        context.logger.debug(`[usersResolvers.me] itsMe ${itsMe}`);
        return clerkUserToUser(itsMe);
      } catch (err) {
        context.logger.error(`[usersResolvers.me] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },

    async myPortfolio(_: any, args: any, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[usersResolvers.myPortfolio] args ${JSON.stringify(args, undefined, 2)}`);
        if (!context.user) {
          throw new Error('No user found');
        }
        const itsMe: User = context.user as User;
        context.logger.debug(`[usersResolvers.myPortfolio] itsMe ${itsMe.username}`);
        const dbresult = context.prisma.portfolio.findFirst(
          {
            where: {
              userIds: {
                has: itsMe.id
              }
            }
          }
        );
        return dbresult;
      } catch (err) {
        context.logger.error(`[usersResolvers.myPortfolio] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },

    async portfolio(_: any, args: QueryPortfolioArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[usersResolvers.portfolio] args ${JSON.stringify(args, undefined, 2)}`);
        const dbresult = context.prisma.portfolio.findUnique(
          { where: { id: args.portfolioId } }
        );

        return dbresult;
      } catch (err) {
        context.logger.error(`[usersResolvers.portfolio] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },

    async portfolios(_: any, args: any, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug(`[usersResolvers.portfolios] args ${JSON.stringify(args, undefined, 2)}`);
        const dbresult = context.prisma.portfolio.findMany();
        return dbresult;
      } catch (err) {
        context.logger.error(`[usersResolvers.portfolios] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    }
  },

  Mutation: {
    async newPortfolio(_: any, args: MutationNewPortfolioArgs, context: DspContext, info: GraphQLResolveInfo) {
      context.logger.debug(`[usersResolvers.newPortfolio] args ${JSON.stringify(args, undefined, 2)}`);
      try {
        const dbresult = await context.prisma.portfolio.create({
          data: {
            name: args.name as string,
            description: args.description as string || '',
            userIds: [],
            accountIds: [],
          }
        });
        context.pubsub.publish(PORTFOLIO_CREATED, { portfolioCreated: dbresult });
        return dbresult;

      } catch (err) {
        context.logger.error(`[usersResolvers.newPortfolio] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },
    async mapUsersToPortfolio(_: any, args: MutationMapUsersToPortfolioArgs, context: DspContext, info: GraphQLResolveInfo) {
      context.logger.debug(`[usersResolvers.mapUsersToPortfolio] args ${JSON.stringify(args, undefined, 2)}`);
      try {
        const userIds: string[] = (args.userIds.length > 0) ? args.userIds as string[] : [];
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
        context.pubsub.publish(PORTFOLIO_USERS_UPDATED, { portfolioUpdated: dbResult });
        return dbResult;

      } catch (err) {
        context.logger.error(`[usersResolvers.mapUsersToPortfolio] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },

    async mapAccountsToPortfolio(_: any, args: MutationMapAccountsToPortfolioArgs, context: DspContext, info: GraphQLResolveInfo) {
      context.logger.debug(`[usersResolvers.mapAccountsToPortfolio] args ${JSON.stringify(args, undefined, 2)}`);
      try {
        const accountIds: string[] = (args.accountIds.length > 0) ? args.accountIds as string[] : [];
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
        context.pubsub.publish(PORTFOLIO_ACCOUNTS_UPDATED, { portfolioUpdated: dbResult });
      } catch (err) {
        context.logger.error(`[usersResolvers.mapAccountsToPortfolio] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    },
    async mapBrandsToPortfolio(_: any, args: MutationMapBrandsToPortfolioArgs, context: DspContext, info: GraphQLResolveInfo) {
      context.logger.debug(`[usersResolvers.mapBrandsToPortfolio] args ${JSON.stringify(args, undefined, 2)}`);
      try {
        const brandIds: string[] = (args.brandIds.length > 0) ? args.brandIds as string[] : [];
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
        context.pubsub.publish(PORTFOLIO_BRANDS_UPDATED, { portfolioUpdated: dbResult });
      } catch (err) {
        context.logger.error(`[usersResolvers.mapBrandsToPortfolio] error ${JSON.stringify(err, undefined, 2)}`);
        throw err;
      }
    }

  }
};