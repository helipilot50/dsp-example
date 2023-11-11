import { KafkaPubSub } from 'graphql-kafka-subscriptions';

export const pubsub = new KafkaPubSub({
  topic: 'name-of-the-topic',
  host: 'INSERT_KAFKA_IP',
  port: 'INSERT_KAFKA_PORT',
  globalConfig: {} // options passed directly to the consumer and producer
});