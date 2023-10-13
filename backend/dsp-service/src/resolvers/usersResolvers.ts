import { GraphQLResolveInfo } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { DspContext } from "../context";
import { topLevelFieldsFromQuery } from "./resolverTools";
import { QueryUserArgs, QueryUsersArgs } from "../resolver-types";

import { User, userById, userByToken, userList } from '../clerk';

function clerkUserToUser(clerkUser: User) {
  return {
    ...clerkUser,
    createdAt: new Date(clerkUser.createdAt),
    updatedAt: new Date(clerkUser.updatedAt),
  };
}

export const usersResolvers/*: Resolvers*/ = {
  Query: {

    async user(_: any, args: QueryUserArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug('[usersResolvers.user] args', args);
        const foundUser: User = await userById(args.userId);
        context.logger.debug('[usersResolvers.user] foundUser', foundUser);
        return clerkUserToUser(foundUser);
      } catch (err) {
        context.logger.error('[usersResolvers.user] error', err);
        throw err;
      }
    },

    async users(_: any, args: QueryUsersArgs, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug('[usersResolvers.users] args', args);
        const users: User[] = await userList();
        context.logger.debug('[usersResolvers.users] user list', users);
        return users.map((user: User) => clerkUserToUser(user));
      } catch (err) {
        context.logger.error('[usersResolvers.users] error', err);
        throw err;
      }
    },

    async me(_: any, args: any, context: DspContext, info: GraphQLResolveInfo) {
      try {
        context.logger.debug('[usersResolvers.me] args', args);
        const itsMe: User = await userByToken(context.token as string);
        context.logger.debug('[usersResolvers.me] itsMe', itsMe);
        return clerkUserToUser(itsMe);
      } catch (err) {
        context.logger.error('[usersResolvers.me] error', err);
        throw err;
      }
    }
  }
};