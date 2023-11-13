import Kafka from 'node-rdkafka';

export const consumer = new Kafka.KafkaConsumer({
  'group.id': process.env.KAFKA_CONSUMER_GROUP || 'not-dsp-group',
  'metadata.broker.list': process.env.KAFKA_HOST || 'localhost',
  'security.protocol': 'sasl_ssl',
  'sasl.mechanism': 'SCRAM-SHA-512',
  'sasl.username': process.env.KAFKA_USER || 'my-username',
  'sasl.password': process.env.KAFKA_PASSWORD || 'my-password',
}, {});