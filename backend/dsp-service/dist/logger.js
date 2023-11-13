"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
const winston_1 = require("winston");
var winston_2 = require("winston");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return winston_2.Logger; } });
exports.logger = (0, winston_1.createLogger)({
    levels: {
        error: 0,
        warning: 1,
        info: 2,
        debug: 3,
        trace: 4
    },
    level: 'debug',
    format: winston_1.format.combine(winston_1.format.splat(), winston_1.format.simple()),
    transports: [new winston_1.transports.Console()]
});
