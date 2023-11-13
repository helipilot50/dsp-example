import { logger, Logger } from "../logger";
import { KafkaPubSub } from "graphql-kafka-subscriptions";
export * from "graphql-subscriptions";

const options = {
  topic: process.env.KAFKA_TOPIC_SUBSCRIPTIONS || 'not-dsp-subscriptions',
  host: process.env.KAFKA_HOST || 'localhost',
  port: process.env.KAFKA_PORT || '9092',
  groupId: process.env.KAFKA_CONSUMER_GROUP || 'not-dsp-group',
  globalConfig: {
    'security.protocol': 'sasl_ssl',
    'sasl.mechanism': 'SCRAM-SHA-512',
    'sasl.username': process.env.KAFKA_USER || 'my-username',
    'sasl.password': process.env.KAFKA_PASSWORD || 'my-password',
  }
};
logger.info(`[pubsub] using KafkaPubSub ${JSON.stringify(options, undefined, 2)}`);
export const pubsubEngine = new KafkaPubSub(options);

