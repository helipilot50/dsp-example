"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeWebSocketContext = exports.makeRequestContext = exports.pubsub = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const logger_1 = require("./logger");
const clerk_1 = require("./clerk");
exports.prisma = new client_1.PrismaClient();
exports.pubsub = new graphql_subscriptions_1.PubSub();
;
async function makeRequestContext({ req, res }) {
    let newContext = {
        prisma: exports.prisma,
        pubsub: exports.pubsub,
        logger: logger_1.logger,
    };
    try {
        if (req.auth && req.auth.userId) {
            const auth = req.auth;
            const user = await (0, clerk_1.userById)(auth.userId);
            const token = auth.getToken();
            newContext = {
                ...newContext,
                user,
                token,
            };
            // console.log('auth:', auth);
            // console.log('user:', user);//.username, user.emailAddresses[0].emailAddress);
        }
    }
    catch (error) {
        logger_1.logger.error(`[server.makeRequestContext] 💀 Error creating context ${JSON.stringify(error, undefined, 2)}`);
        throw error;
    }
    return newContext;
}
exports.makeRequestContext = makeRequestContext;
function makeWebSocketContext(args) {
    let newContext = {
        prisma: exports.prisma,
        pubsub: exports.pubsub,
        logger: logger_1.logger,
    };
    return newContext;
}
exports.makeWebSocketContext = makeWebSocketContext;
