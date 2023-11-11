import { GraphQLResolveInfo } from "graphql";

export function topLevelFieldsFromQuery(info: GraphQLResolveInfo) {
  // context.logger.debug(`topLevelFieldsFromQuery ${JSON.stringify(info, null, 2)}`);
  return info.fieldNodes[0].selectionSet?.selections.map((sel: any) => sel.name.value).filter((name: string) => name !== '__typename');
}