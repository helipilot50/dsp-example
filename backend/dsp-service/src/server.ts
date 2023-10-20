import { ApolloServer } from '@apollo/server';

import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { createServer } from 'http';
import express from 'express';
import favicon from 'serve-favicon';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { logger } from './logger';

import pkg from 'body-parser';
const { json } = pkg;
import cors from 'cors';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { schemaFromDirectory } from './fetchSchema';
import gql from 'graphql-tag';

// SSE
// import { createHandler } from 'graphql-sse/lib/use/express';

// Resolvers
import { resolvers } from './resolvers';
import { DspContext, makeRequestContext, pubsub, prisma, makeWebSocketContext } from './context';

import { corsOptions } from './cors';
import { ClerkExpressWithAuth, LooseAuthProp, WithAuthProp } from '@clerk/clerk-sdk-node';

const PORT = (process.env.PORT) ? Number.parseInt(process.env.PORT) : 4000;



async function listen() {
  logger.level = process.env.LOG_LEVEL || 'debug';
  console.log('[server] log level:', logger.level);


  // Create an Express app and HTTP server; we will attach both the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express();
  const httpServer = createServer(app);

  app.use(favicon(__dirname + '/public/favicon.ico'));


  try {
    logger.info('[server] creating apollo server');
    let defs = gql`
      extend type Query{
      _dummy: Boolean
      }
      `;
    try {
      const schemaDir = process.env.SCHEMA_DIR || './schema';
      logger.info(`[server] schema directory: ${schemaDir}`);
      defs = schemaFromDirectory(schemaDir);
    } catch (err) {
      logger.error(`[server] 💀 Error reading schema ${JSON.stringify(err, undefined, 2)}`);
      throw err;
    }



    logger.info(`[server] building schema`);

    const graphSchema = buildSubgraphSchema({
      typeDefs: defs,
      resolvers: resolvers,

    });

    //---------------------------------------------------------------------------------
    //   socket server for subscriptions
    //---------------------------------------------------------------------------------
    // Creating the WebSocket server
    const wsServer = new WebSocketServer({
      // This is the `httpServer` we created in a previous step.
      server: httpServer,
      // Pass a different path here if app.use
      // serves expressMiddleware at a different path
      path: '/subscriptions'
    });

    // Hand in the schema we just created and have the
    // WebSocketServer start listening.
    const serverCleanup = useServer({
      schema: graphSchema,
      context: async (args: any) => {
        return makeWebSocketContext(args);
      },
      onConnect: async (ctx: any) => {
        logger.info('[server] WS Connected!');
        // Check authentication every time a client connects.
        logger.info(`[server] WS Connection Params: ${JSON.stringify(ctx.connectionParams, undefined, 2)}`);
        // if (tokenIsNotValid(ctx.connectionParams)) {
        // You can return false to close the connection  or throw an explicit error
        // throw new Error('Auth token missing!');
        return ctx;

      },
      onDisconnect(ctx: any, code: number, reason: string) {
        logger.info(`[server] WS Disconnected! ${code}, ${reason}`);
      },
    }, wsServer);

    //---------------------------------------------------------------------------------
    //   Use SSE for subscriptions. experimental
    //---------------------------------------------------------------------------------
    //   const handler = createHandler({ schema: graphSchema });
    //   app.use('/subscriptions', async (req, res) => {
    //     try {
    //       await handler(req, res);
    //     } catch (err) {
    //       logger.error(err);
    //       res.writeHead(500).end();
    //     }
    //   });

    //---------------------------------------------------------------------------------
    //   apollo server for queries and mutations
    //---------------------------------------------------------------------------------

    logger.info(`INTROSPECTION ${process.env.INTROSPECTION}`);

    const server = new ApolloServer<DspContext>(
      {
        schema: graphSchema,
        cache: new InMemoryLRUCache({
          // ~100MiB
          maxSize: Math.pow(2, 20) * 100,
          // 30 seconds
          ttl: 30,
        }),
        plugins: [
          ApolloServerPluginDrainHttpServer({ httpServer }),
          {
            async serverWillStart() {
              return {
                async drainServer() {
                  await serverCleanup.dispose();
                },
              };
            },
          },
          ApolloServerPluginLandingPageLocalDefault({
            embed: {
              endpointIsEditable: true,
            }
          }),
        ],
        introspection: (process.env.INTROSPECTION) ? Boolean(process.env.INTROSPECTION) : true,
        logger: logger
      }
    );



    await server.start();

    //---------------------------------------------------------------------------------
    // express and apollo middleware
    //---------------------------------------------------------------------------------

    app.use(
      '/graphql',
      cors(corsOptions),
      json(),
      ClerkExpressWithAuth(),
      expressMiddleware(server,
        {
          context: async (args: any) => {
            return await makeRequestContext(args);
          },
        }
      ),
    );


  } catch (error) {
    logger.error(`[server] 💀 Error creating apollo server ${JSON.stringify(error, undefined, 2)}`);
  }

  const theServer = httpServer.listen(PORT, () => {
    logger.info(`[server] 🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
  });
  return theServer;

}

// Start the server using async function
async function main() {

  try {
    await listen();
  } catch (err) {
    logger.error(`[server] 💀 Error starting the node server ${JSON.stringify(err, undefined, 2)}`);
  }
}

main()





