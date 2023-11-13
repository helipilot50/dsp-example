"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.userById = exports.userByToken = exports.sessions = exports.userList = exports.User = void 0;
const clerk_sdk_node_1 = __importStar(require("@clerk/clerk-sdk-node"));
var clerk_sdk_node_2 = require("@clerk/clerk-sdk-node");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return clerk_sdk_node_2.User; } });
async function userList() {
    const users = clerk_sdk_node_1.default.users.getUserList();
    return users;
}
exports.userList = userList;
async function sessions() {
    const sessions = clerk_sdk_node_1.default.sessions.getSessionList();
    return sessions;
}
exports.sessions = sessions;
async function userByToken(token) {
    const decodedToken = decodeToken(token);
    if (!decodedToken) {
        throw new Error('No decoded token');
    }
    if (!decodedToken.sub) {
        throw new Error('No decodedToken.sub');
    }
    return userById(decodedToken.sub);
}
exports.userByToken = userByToken;
async function userById(id) {
    const user = await clerk_sdk_node_1.default.users.getUser(id);
    return user;
}
exports.userById = userById;
function decodeToken(token) {
    const decoded = (0, clerk_sdk_node_1.decodeJwt)(token);
    // try {
    //   // const verified = jwt.verify(token,
    //   //   process.env.CLERK_JWT_PUBLIC_KEY as string,
    //   // );
    //   logger.info('token verify', verified);
    // } catch (err) {
    //   logger.error('token verify', err);
    // }
    return decoded;
}
exports.decodeToken = decodeToken;
