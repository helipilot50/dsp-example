
import { createServer } from 'http';
import express from 'express';
import { logger } from './logger';

import pkg from 'body-parser';
const { json } = pkg;
import cors from 'cors';
import { pubsubEngine } from './kafka';

logger.level = process.env.LOG_LEVEL || 'debug';
const servicePort = (process.env.PORT) ? Number.parseInt(process.env.PORT) : 5000;

let lineitemPaused: unknown;
let lineitemActivated: unknown;

const app = express();
const httpServer = createServer(app);

app.post('/bid-request', (req, res) => {
  const { body, query } = req;
  // You can now use body and query
  logger.info(`[bidder] bid-request body: ${JSON.stringify(body)}`);
});

function onMessage(payload: any) {
  logger.info(`[pubsub] onMessage payload: ${JSON.stringify(payload)}`);
}
const server = app.listen(servicePort, async () => {
  logger.info(`[bidder] listening on port ${servicePort}`);


  lineitemActivated = await pubsubEngine.subscribe('LineitemActivated', onMessage);
  logger.info(`[bidder] subscribed to LineitemActivated`);

  lineitemPaused = await pubsubEngine.subscribe('LineitemPaused', onMessage);
  logger.info(`[bidder] subscribed to LineitemPaused: ${lineitemActivated}`);
});

function gracefulshutdown() {
  logger.info("[bidder] Shutting down");
  pubsubEngine.close();
  server.close(() => {
    logger.info("[bidder] HTTP server closed.");
    process.exit(0);
  });
}

async function dummy() {
  logger.info(`[bidder] dummy`);
  const iter = pubsubEngine.asyncIterator('LineitemActivated');
  var i: number;
  const rep = 10;

  for (i = 0; i < rep; i++) {
    const inputPayload = { id: "iter-" + i };
    const promise = iter.next();
    await pubsubEngine.publish('LineitemActivated', inputPayload);
    await promise.then((payload: any) => {
      logger.info(`[bidder] dummy payload: ${JSON.stringify(payload)}`);
    },
      (error: any) => {
        logger.error(`[bidder] dummy error: ${JSON.stringify(error)}`);
      }
    );
  }
}

dummy();

process.on("SIGTERM", gracefulshutdown);
process.on("SIGINT", gracefulshutdown);
