
import { createServer } from 'http';
import express from 'express';
import { logger } from './logger';

import pkg from 'body-parser';
const { json } = pkg;
import cors from 'cors';
import { pubsubEngine } from './kafka';

logger.level = process.env.LOG_LEVEL || 'debug';
const servicePort = (process.env.PORT) ? Number.parseInt(process.env.PORT) : 5000;

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
  dummy();

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
  const LINEITEM_ACTIVATED_EVENT = 'LineitemActivated';
  // const iter = pubsubEngine.asyncIterator(LINEITEM_ACTIVATED_EVENT);
  var i: number;
  const rep = 10;

  const cats = await pubsubEngine.subscribe(LINEITEM_ACTIVATED_EVENT, onMessage);
  console.log(`[bidder] sunscribed with ${cats}`);
  for (i = 0; i < rep; i++) {
    const inputPayload = { id: "iter-" + i };
    logger.info(`[bidder] dummy inputPayload: ${JSON.stringify(inputPayload)}`);

    try {
      await pubsubEngine.publish(LINEITEM_ACTIVATED_EVENT, inputPayload);
      logger.info(`[bidder] dummy published: ${JSON.stringify(inputPayload)}`);
    } catch (error) {
      logger.error(`[bidder] dummy error: ${JSON.stringify(error)}`);
    }

  }
}



process.on("SIGTERM", gracefulshutdown);
process.on("SIGINT", gracefulshutdown);
