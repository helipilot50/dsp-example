import { DocumentNode, buildASTSchema, printSchema } from "graphql";
import gql from "graphql-tag";
import fetch from "node-fetch";
import fs from 'fs';
import { glob, globSync } from 'glob';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { logger } from "./logger";




export function schemaFromFile(schemaFile: string): DocumentNode {
  try {
    logger.info(`[fetchSchema.schemaFromFile] loading schemas from file:  ${schemaFile}`);
    const typeDefsString = fs.readFileSync(schemaFile, 'utf8');
    logger.info(`[fetchSchema.schemaFromFile]compiling schema from file:  ${schemaFile}`);
    return gql(typeDefsString);
  } catch (error) {
    logger.error(`[fetchSchema.schemaFromFile]💀 Error reading schema file ${JSON.stringify(error, undefined, 2)}`);
    throw error;
  }
}

export function schemaFromDirectory(schemaDir: string): DocumentNode {
  try {
    logger.info(`[fetchSchema.schemaFromDirectory] loading schemas directory =>${schemaDir}/**/*.graphql`,);
    // const schemaFiles = fs.readdirSync(schemaDir);
    const schemaFiles = globSync(schemaDir + '/**/*.graphql');
    logger.info(`[fetchSchema.schemaFromDirectory] schema files: ${JSON.stringify(schemaFiles, null, 2)}`,);
    const typeDefs = schemaFiles.map((schemaFile): DocumentNode => {
      try {
        logger.debug(`[fetchSchema.schemaFromDirectory]reading schema file: ${schemaFile}`);
        const typeDefsString = fs.readFileSync(schemaFile, 'utf8');
        logger.debug(`[fetchSchema.schemaFromDirectory]compiling schema from file: ${schemaFile}`);
        return gql(typeDefsString);
      } catch (error) {
        logger.error(`[fetchSchema.schemaFromDirectory] 💀 Error in schema file ${schemaFile}, ${JSON.stringify(error, undefined, 2)}`);
        throw error;
      }
    });
    const mergedDefs = mergeTypeDefs(typeDefs);

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
  } catch (error) {
    logger.error(`[fetchSchema.schemaFromDirectory] 💀 Error reading schema files ${JSON.stringify(error, undefined, 2)}`);
    throw error;
  }
}



