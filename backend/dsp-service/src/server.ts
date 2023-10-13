import { ApolloServer } from '@apollo/server';
import * as dotenv from 'dotenv';
dotenv.config();
import { ExpressContextFunctionArgument, expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
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
import { DspContext } from './context';

import { pubsub, prisma } from './context';
import { corsOptions } from './cors';

import { User, userByToken } from './clerk';

const PORT = (process.env.PORT) ? Number.parseInt(process.env.PORT) : 4000;



async function listen() {

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
      defs = schemaFromDirectory(process.env.SCHEMA_DIR || './schema');
    } catch (err) {
      logger.error('[server] 💀 Error reading schema', JSON.stringify(err, undefined, 2));
      throw err;
    }



    logger.info('[server] building schema');

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
      onConnect: async (ctx: any) => {
        logger.info('[server] WS Connected!');
        // Check authentication every time a client connects.
        // if (tokenIsNotValid(ctx.connectionParams)) {
        // You can return false to close the connection  or throw an explicit error
        // throw new Error('Auth token missing!');
        return ctx;

      },
      onDisconnect(ctx: any, code: number, reason: string) {
        logger.info('[server] WS Disconnected!', code, reason);
      },
    }, wsServer);

    //---------------------------------------------------------------------------------
    //   Use SSE for subscriptions. experimental
    //---------------------------------------------------------------------------------
    //   const handler = createHandler({ schema: graphSchema });
    //   app.use('/graphql/subscriptions', async (req, res) => {
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
        introspection: (process.env.INTROSPECTION) ? Boolean(process.env.INTROSPECTION) : false,
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
      // ClerkExpressRequireAuth(),
      expressMiddleware(server, {
        context: async ({ req }: ExpressContextFunctionArgument): Promise<DspContext> => {
          // logger.debug('[server.context] req', JSON.stringify(req, undefined, 2));
          // logger.info('[server.context] req.headers', JSON.stringify(req.headers, undefined, 2));
          // logger.debug('[server.context] req.body', JSON.stringify(req.body, undefined, 2));

          if (req.headers.authorization) {
            logger.info('[server.context] has authorization header');
            logger.debug('[server.context] req.headers.authorization', JSON.stringify(req.headers.authorization, undefined, 2));
            const token = req.headers.authorization.split(' ')[1];
            const userProfile: User = await userByToken(token);
            logger.debug('[server.context] userProfile', JSON.stringify(userProfile, undefined, 2));

            return {
              user: userProfile,
              prisma,
              pubsub,
              token: token,
              logger: logger,
            };
          }
          logger.warning('[server.context] no authorization header');
          return {
            prisma,
            pubsub,
            logger: logger,
          };
        },
      }),
    );


  } catch (error) {
    logger.error('[server] 💀 Error creating apollo server', JSON.stringify(error, undefined, 2));
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
    logger.error('[server] 💀 Error starting the node server', JSON.stringify(err, undefined, 2));
  }
}

main()





