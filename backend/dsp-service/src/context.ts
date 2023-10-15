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
    console.log(`[server.makeRequestContext] req ${JSON.stringify(req, undefined, 2)}`);

    //   if (req.auth && req.auth.userId) {
    //     const auth = req.auth;
    //     logger.debug(`[server.makeRequestContext] req.auth ${JSON.stringify(auth, undefined, 2)}`);
    //     newContext = {
    //       ...newContext,
    //       user: await userById(auth.userId),
    //       token: auth.getToken(),
    //     };

    //   }
  } catch (error) {
    logger.error(`[server.makeRequestContext] 💀 Error creating context ${JSON.stringify(error, undefined, 2)}`);
  }
  console.log(`[server.makeRequestContext] newContext ${JSON.stringify(newContext, undefined, 2)}`);
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