"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const default_1 = require("@apollo/server/plugin/landingPage/default");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const utils_keyvaluecache_1 = require("@apollo/utils.keyvaluecache");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const logger_1 = require("./logger");
const body_parser_1 = __importDefault(require("body-parser"));
const { json } = body_parser_1.default;
const cors_1 = __importDefault(require("cors"));
const subgraph_1 = require("@apollo/subgraph");
const fetchSchema_1 = require("./fetchSchema");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const apollo_validation_directives_1 = require("@profusion/apollo-validation-directives");
// SSE
// import { createHandler } from 'graphql-sse/lib/use/express';
// Resolvers
const resolvers_1 = require("./resolvers");
const context_1 = require("./context");
const cors_2 = require("./cors");
const PORT = (process.env.PORT) ? Number.parseInt(process.env.PORT) : 4000;
async function listen() {
    logger_1.logger.level = process.env.LOG_LEVEL || 'debug';
    console.log('[server] log level:', logger_1.logger.level);
    // Create an Express app and HTTP server; we will attach both the WebSocket
    // server and the ApolloServer to this HTTP server.
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    app.use((0, serve_favicon_1.default)(__dirname + '/public/favicon.ico'));
    try {
        logger_1.logger.info('[server] creating apollo server');
        let defs = (0, graphql_tag_1.default) `
      extend type Query{
      _dummy: Boolean
      }
      `;
        try {
            const schemaDir = process.env.SCHEMA_DIR || './schema';
            logger_1.logger.info(`[server] schema directory: ${schemaDir}`);
            defs = (0, fetchSchema_1.schemaFromDirectory)(schemaDir);
        }
        catch (err) {
            logger_1.logger.error(`[server] 💀 Error reading schema ${JSON.stringify(err, undefined, 2)}`);
            throw err;
        }
        logger_1.logger.info(`[server] building schema`);
        const graphSchema = (0, subgraph_1.buildSubgraphSchema)({
            typeDefs: defs,
            resolvers: resolvers_1.resolvers,
        });
        const schemaWithPermissions = (0, apollo_validation_directives_1.applyDirectivesToSchema)([apollo_validation_directives_1.hasPermissions], graphSchema);
        //---------------------------------------------------------------------------------
        //   socket server for subscriptions
        //---------------------------------------------------------------------------------
        // Creating the WebSocket server
        const wsServer = new ws_1.WebSocketServer({
            // This is the `httpServer` we created in a previous step.
            server: httpServer,
            // Pass a different path here if app.use
            // serves expressMiddleware at a different path
            path: '/subscriptions'
        });
        // Hand in the schema we just created and have the
        // WebSocketServer start listening.
        const serverCleanup = (0, ws_2.useServer)({
            schema: graphSchema,
            context: async (args) => {
                return (0, context_1.makeWebSocketContext)(args);
            },
            onConnect: async (ctx) => {
                logger_1.logger.info('[server] WS Connected!');
                // Check authentication every time a client connects.
                logger_1.logger.info(`[server] WS Connection Params: ${JSON.stringify(ctx.connectionParams, undefined, 2)}`);
                // if (tokenIsNotValid(ctx.connectionParams)) {
                // You can return false to close the connection  or throw an explicit error
                // throw new Error('Auth token missing!');
                return ctx;
            },
            onDisconnect(ctx, code, reason) {
                logger_1.logger.info(`[server] WS Disconnected! ${code}, ${reason}`);
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
        logger_1.logger.info(`INTROSPECTION ${process.env.INTROSPECTION}`);
        const server = new server_1.ApolloServer({
            schema: schemaWithPermissions,
            cache: new utils_keyvaluecache_1.InMemoryLRUCache({
                // ~100MiB
                maxSize: Math.pow(2, 20) * 100,
                // 30 seconds
                ttl: 30,
            }),
            plugins: [
                (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
                {
                    async serverWillStart() {
                        return {
                            async drainServer() {
                                await serverCleanup.dispose();
                            },
                        };
                    },
                },
                (0, default_1.ApolloServerPluginLandingPageLocalDefault)({
                    embed: {
                        endpointIsEditable: true,
                    }
                }),
            ],
            introspection: (process.env.INTROSPECTION) ? Boolean(process.env.INTROSPECTION) : true,
            logger: logger_1.logger
        });
        await server.start();
        //---------------------------------------------------------------------------------
        // express and apollo middleware
        //---------------------------------------------------------------------------------
        app.use('/graphql', (0, cors_1.default)(cors_2.corsOptions), json(), 
        // ClerkExpressWithAuth(),
        (0, express4_1.expressMiddleware)(server, {
            context: async (args) => {
                return await (0, context_1.makeRequestContext)(args);
            },
        }));
    }
    catch (error) {
        logger_1.logger.error(`[server] 💀 Error creating apollo server ${JSON.stringify(error, undefined, 2)}`);
    }
    const theServer = httpServer.listen(PORT, () => {
        logger_1.logger.info(`[server] 🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
    });
    return theServer;
}
// Start the server using async function
async function main() {
    try {
        await listen();
    }
    catch (err) {
        logger_1.logger.error(`[server] 💀 Error starting the node server ${JSON.stringify(err, undefined, 2)}`);
    }
}
main();
