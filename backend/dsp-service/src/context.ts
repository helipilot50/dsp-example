import { BaseContext } from "@apollo/server/dist/esm/externalTypes/context";
import { User } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Logger } from "winston";

export const prisma = new PrismaClient();
export const pubsub = new PubSub();

export interface DspContext {
  prisma: PrismaClient;
  pubsub: PubSub;
  token?: string;
  user?: User;
  logger: Logger;
};