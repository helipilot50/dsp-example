import { DocumentNode, buildASTSchema, printSchema } from "graphql";
import gql from "graphql-tag";
import fetch from "node-fetch";
import fs from 'fs';
import { glob, globSync } from 'glob';
import { mergeTypeDefs } from '@graphql-tools/merge';





export function schemaFromFile(schemaFile: string): DocumentNode {
  try {
    console.debug('[fetchSchema.schemaFromFile] loading schemas from file: ', schemaFile);
    const typeDefsString = fs.readFileSync(schemaFile, 'utf8');
    console.debug('[fetchSchema.schemaFromFile]compiling schema from file: ', schemaFile);
    return gql(typeDefsString);
  } catch (error) {
    console.error('[fetchSchema.schemaFromFile]💀 Error reading schema file', JSON.stringify(error, undefined, 2));
    throw error;
  }
}

export function schemaFromDirectory(schemaDir: string): DocumentNode {
  try {
    console.debug('[fetchSchema.schemaFromDirectory] loading schemas from files ', schemaDir);
    // const schemaFiles = fs.readdirSync(schemaDir);
    const schemaFiles = globSync(schemaDir + '/**/*.graphql');
    console.debug('[fetchSchema.schemaFromDirectory] schema files: ', schemaFiles);
    const typeDefs = schemaFiles.map((schemaFile): DocumentNode => {
      try {
        console.debug('[fetchSchema.schemaFromDirectory]reading schema file: ', schemaFile);
        const typeDefsString = fs.readFileSync(schemaFile, 'utf8');
        console.debug('[fetchSchema.schemaFromDirectory]compiling schema from file: ', schemaFile);
        return gql(typeDefsString);
      } catch (error) {
        console.error('[fetchSchema.schemaFromDirectory] 💀 Error in schema file', schemaFile, JSON.stringify(error, undefined, 2));
        throw error;
      }
    });
    const mergedDefs = mergeTypeDefs(typeDefs);

    // TODO
    // if (typeDefs.length > 1) {
    //   try {
    //     const astSchema = buildASTSchema(mergedDefs);
    //    console.debug('ast schema: ', astSchema);
    //     const mergedSchema = printSchema(astSchema);
    //    console.debug('merged schema: ', mergedSchema);
    //   } catch (mergeError) {
    //     console.error('💀 Error printing schema', JSON.stringify(mergeError, undefined, 2));
    //   }
    // }
    return mergedDefs;
  } catch (error) {
    console.error('[fetchSchema.schemaFromDirectory] 💀 Error reading schema files', JSON.stringify(error, undefined, 2));
    throw error;
  }
}



