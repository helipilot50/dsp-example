"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = exports.whitelist = void 0;
const logger_1 = require("./logger");
exports.whitelist = [];
if (process.env.CORS_WHITELIST) {
    process.env.CORS_WHITELIST.split(',').forEach((url) => {
        exports.whitelist.push(url);
    });
}
logger_1.logger.info(`[cors] whitelist: ${JSON.stringify(exports.whitelist, null, 2)}`);
exports.corsOptions = {
    origin: exports.whitelist
};
