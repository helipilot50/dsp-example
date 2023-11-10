import { BaseContext } from "@apollo/server/dist/esm/externalTypes/context";
import { User } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { logger, Logger } from "./logger";
import { userById } from "./clerk";
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


export async function makeRequestContext({ req, res }: any): Promise<DspContext> {
  let newContext: DspContext = {
    prisma,
    pubsub,
    logger: logger,
  };
  try {

    if (req.auth && req.auth.userId) {
      const auth = req.auth;
      const user: User = await userById(auth.userId);
      const token = auth.getToken();
      newContext = {
        ...newContext,
        user,
        token,
      };
      // console.log('auth:', auth);
      // console.log('user:', user);//.username, user.emailAddresses[0].emailAddress);
    }
  } catch (error) {
    logger.error(`[server.makeRequestContext] 💀 Error creating context ${JSON.stringify(error, undefined, 2)}`);
    throw error;
  }
  return newContext;
}

export function makeWebSocketContext(args: any): DspContext {

  let newContext: DspContext = {
    prisma,
    pubsub,
    logger: logger,
  };
  return newContext;
}