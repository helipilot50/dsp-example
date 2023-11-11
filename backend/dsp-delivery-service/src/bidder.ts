
import { createServer } from 'http';
import express from 'express';
import { logger } from './logger';

import pkg from 'body-parser';
const { json } = pkg;
import cors from 'cors';
import { consumeLineitemActivated, consumeLineitemPaused } from './kafka';

logger.level = process.env.LOG_LEVEL || 'debug';
const servicePort = (process.env.PORT) ? Number.parseInt(process.env.PORT) : 5000;

const app = express();
const httpServer = createServer(app);

app.post('/bid-request', (req, res) => {
  const { body, query } = req;
  // You can now use body and query
  logger.info(`[bidder] bid-request body: ${JSON.stringify(body)}`);
});

app.listen(servicePort, () => {
  logger.info(`[bidder] listening on port ${servicePort}`);
  consumeLineitemActivated();
  consumeLineitemPaused();
});
