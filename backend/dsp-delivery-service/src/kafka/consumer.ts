
import { consumer } from './client';
import { logger } from '../logger';
import { EachMessagePayload } from 'kafkajs';


/** 
 * Consume lineitem-activated events
*/
export const consumeLineitemActivated = async () => {
  // first, we wait for the client to connect and subscribe to the given topic

  const topic = process.env.KAFKA_TOPIC_LINEITEM_ACTIVATED || 'LineitemActivated';
  logger.info(`[kafka] consuming topic ${topic}`);

  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      logger.info(`[kafka.consumeLineitemActivated] received event: ${message.value}`);
    },
  });
};


/** 
 * Consume lineitem-paused events
*/
export const consumeLineitemPaused = async () => {


  const topic = process.env.KAFKA_TOPIC_LINEITEM_PAUSED || 'LineitemPaused';
  logger.info(`[kafka] consuming topic ${topic}`);

  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      logger.info(`[kafka.consumeLineitemPaused] received event: ${message.value}`);
    },
  });
};
