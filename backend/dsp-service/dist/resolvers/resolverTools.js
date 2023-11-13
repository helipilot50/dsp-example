"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topLevelFieldsFromQuery = void 0;
function topLevelFieldsFromQuery(info) {
    // context.logger.debug(`topLevelFieldsFromQuery ${JSON.stringify(info, null, 2)}`);
    return info.fieldNodes[0].selectionSet?.selections.map((sel) => sel.name.value).filter((name) => name !== '__typename');
}
exports.topLevelFieldsFromQuery = topLevelFieldsFromQuery;
