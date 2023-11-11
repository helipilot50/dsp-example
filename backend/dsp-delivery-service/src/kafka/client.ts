import { Kafka, LogEntry, logLevel } from "kafkajs";
import { logger } from "../logger";

const kafkaHost = (process.env.KAFKA_HOST) ? process.env.KAFKA_HOST : "localhost";
const kafkaPort = (process.env.KAFKA_PORT) ? Number.parseInt(process.env.KAFKA_PORT) : 9094;


// the client ID lets kafka know who's producing the messages
const groupId = process.env.KAFKA_CONSUMER_GROUP || 'not-dsp-bidder';
logger.info(`[kafka] consumer group ${groupId}`);
// we can define the list of brokers in the cluster
const brokers = [`${kafkaHost}:${kafkaPort}`];
logger.info(`[kafka] brokers ${brokers}`);

const logLevelToString = {
  [logLevel.ERROR]: 'error',
  [logLevel.WARN]: 'warn',
  [logLevel.INFO]: 'info',
  [logLevel.DEBUG]: 'debug',
  [logLevel.NOTHING]: 'nothing',
};

const logCreator = (level: logLevel) => {
  return ({ namespace, level, label, log }: LogEntry) => {
    logger.log({
      level: logLevelToString[level],
      message: `${label}: ${log}`
    });
  };
};

export const kafka = new Kafka({
  clientId: groupId,
  brokers,
  // TODO logCreator
});

export const producer = kafka.producer();

export const consumer = kafka.consumer({ groupId: groupId });