import { BaseContext } from "@apollo/server/dist/esm/externalTypes/context";
import { User } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { logger, Logger } from "./logger";
import { userByToken } from "./clerk";
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";

export const prisma = new PrismaClient();
export const pubsub = new PubSub();


export interface DspContext {
  prisma: PrismaClient;
  pubsub: PubSub;
  token?: string;
  user?: User;
  logger: Logger;
};


export async function makeRequestContext({ req, res }: ExpressContextFunctionArgument): Promise<DspContext> {

  let newContext: DspContext = {
    prisma,
    pubsub,
    logger: logger,
  };

  try {

    const headers = req.headers;

    if (headers && headers.authorization) {

      logger.info('[server.makeRequestContext] has authoriztion header');
      logger.debug(`[server.makeRequestContext] req.headers.authorization ${JSON.stringify(headers.authorization, undefined, 2)}`);
      const token = headers.authorization.split(' ')[1];
      const userProfile: User = await userByToken(token);
      logger.debug(`[server.makeRequestContext] userProfile ${JSON.stringify(userProfile, undefined, 2)}`);
      newContext = {
        ...newContext,
        user: userProfile,
        token: token,
      };

    }
  } catch (error) {
    logger.error(`[server.makeRequestContext] 💀 Error creating context ${JSON.stringify(error, undefined, 2)}`);
  }
  return newContext;
}

export async function makeWebSocketContext(args: ExpressContextFunctionArgument): Promise<DspContext> {

  let newContext: DspContext = {
    prisma,
    pubsub,
    logger: logger,
  };
  return newContext;
}