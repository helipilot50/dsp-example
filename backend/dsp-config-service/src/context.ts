import { BaseContext } from "@apollo/server/dist/esm/externalTypes/context";
import { User } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import { PubSub, PubSubEngine } from "graphql-subscriptions";
import { logger, Logger } from "./logger";
import { userById } from "./clerk";
import { KafkaPubSub } from "graphql-kafka-subscriptions";

export const prisma = new PrismaClient();

let pubsubEngine: PubSubEngine;
if (process.env.KAFKA_HOST) {
  const options = {
    topic: process.env.KAFKA_TOPIC_SUBSCRIPTIONS || 'not-dsp-subscriptions',
    host: process.env.KAFKA_HOST,
    port: process.env.KAFKA_PORT || '9092',
    globalConfig: {} // options passed directly to the consumer and producer
  };
  logger.info(`[context] using KafkaPubSub ${JSON.stringify(options, undefined, 2)}`);
  pubsubEngine = new KafkaPubSub(options);
} else {
  pubsubEngine = new PubSub();
}


export interface DspContext {
  prisma: PrismaClient;
  pubsub: PubSubEngine;
  token?: string;
  user?: User;
  logger: Logger;
};


export async function makeRequestContext({ req, res }: any): Promise<DspContext> {
  let newContext: DspContext = {
    prisma,
    pubsub: pubsubEngine,
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
    pubsub: pubsubEngine,
    logger: logger,
  };
  return newContext;
}