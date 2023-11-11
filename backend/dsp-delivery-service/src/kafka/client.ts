import { Kafka } from "kafkajs";

const kafkaHost = (process.env.KAFKA_HOST) ? process.env.KAFKA_HOST : "localhost";
const kafkaPort = (process.env.KAFKA_PORT) ? Number.parseInt(process.env.KAFKA_PORT) : 9094;


// the client ID lets kafka know who's producing the messages
const clientId = "not-dsp-bidder";
// we can define the list of brokers in the cluster
const brokers = [`${kafkaHost}:${kafkaPort}`];

export const kafka = new Kafka({ clientId, brokers });

export const producer = kafka.producer();

export const consumer = kafka.consumer({ groupId: clientId });