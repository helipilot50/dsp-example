"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaFromDirectory = exports.schemaFromFile = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const fs_1 = __importDefault(require("fs"));
const glob_1 = require("glob");
const merge_1 = require("@graphql-tools/merge");
const logger_1 = require("./logger");
function schemaFromFile(schemaFile) {
    try {
        logger_1.logger.info(`[fetchSchema.schemaFromFile] loading schemas from file:  ${schemaFile}`);
        const typeDefsString = fs_1.default.readFileSync(schemaFile, 'utf8');
        logger_1.logger.info(`[fetchSchema.schemaFromFile]compiling schema from file:  ${schemaFile}`);
        return (0, graphql_tag_1.default)(typeDefsString);
    }
    catch (error) {
        logger_1.logger.error(`[fetchSchema.schemaFromFile]💀 Error reading schema file ${JSON.stringify(error, undefined, 2)}`);
        throw error;
    }
}
exports.schemaFromFile = schemaFromFile;
function schemaFromDirectory(schemaDir) {
    try {
        logger_1.logger.info(`[fetchSchema.schemaFromDirectory] loading schemas directory =>${schemaDir}/**/*.graphql`);
        // const schemaFiles = fs.readdirSync(schemaDir);
        const schemaFiles = (0, glob_1.globSync)(schemaDir + '/**/*.graphql');
        logger_1.logger.info(`[fetchSchema.schemaFromDirectory] schema files: ${JSON.stringify(schemaFiles, null, 2)}`);
        const typeDefs = schemaFiles.map((schemaFile) => {
            try {
                logger_1.logger.debug(`[fetchSchema.schemaFromDirectory]reading schema file: ${schemaFile}`);
                const typeDefsString = fs_1.default.readFileSync(schemaFile, 'utf8');
                logger_1.logger.debug(`[fetchSchema.schemaFromDirectory]compiling schema from file: ${schemaFile}`);
                return (0, graphql_tag_1.default)(typeDefsString);
            }
            catch (error) {
                logger_1.logger.error(`[fetchSchema.schemaFromDirectory] 💀 Error in schema file ${schemaFile}, ${JSON.stringify(error, undefined, 2)}`);
                throw error;
            }
        });
        const mergedDefs = (0, merge_1.mergeTypeDefs)(typeDefs);
        // TODO
        // if (typeDefs.length > 1) {
        //   try {
        //     const astSchema = buildASTSchema(mergedDefs);
        //    logger.debug(`ast schema:  ${astSchema}`);
        //     const mergedSchema = printSchema(astSchema);
        //    logger.debug(`merged schema:  ${mergedSchema}`);
        //   } catch (mergeError) {
        //     logger.error(`💀 Error printing schema ${JSON.stringify(mergeError, undefined, 2)}`);
        //   }
        // }
        return mergedDefs;
    }
    catch (error) {
        logger_1.logger.error(`[fetchSchema.schemaFromDirectory] 💀 Error reading schema files ${JSON.stringify(error, undefined, 2)}`);
        throw error;
    }
}
exports.schemaFromDirectory = schemaFromDirectory;
