"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const lodash_1 = __importDefault(require("lodash"));
const accountsResolvers_1 = require("./accountsResolvers");
const relationshipResolvers_1 = require("./relationshipResolvers");
const campaignsResolvers_1 = require("./campaignsResolvers");
const brandsResolvers_1 = require("./brandsResolvers");
const commonResolvers_1 = require("./commonResolvers");
const skuResolvers_1 = require("./skuResolvers");
const retailerResolvers_1 = require("./retailerResolvers");
const usersResolvers_1 = require("./usersResolvers");
exports.resolvers = lodash_1.default.merge(accountsResolvers_1.accountResolvers, relationshipResolvers_1.relationshipResolvers, campaignsResolvers_1.campaignsResolvers, brandsResolvers_1.brandResolvers, commonResolvers_1.commonResolvers, skuResolvers_1.skuResolvers, retailerResolvers_1.retailerResolvers, usersResolvers_1.usersResolvers);
