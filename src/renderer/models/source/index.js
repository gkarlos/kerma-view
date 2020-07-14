/**
 * @module source
 * @category Renderer
 * @subcategory models
 * @property {module:source.SourceLoc} SourceLoc
 * @property {module:source.SourceInfo} SourceInfo
 * @property {module:source.SourceRange} SourceRange
 * @property {module:source.FunctionInfo} FunctionInfo
 * @property {module:source.FunctionCallInfo} FunctionCallInfo
 */
module.exports = {
  SourceLoc : require('./SourceLoc'),
  SourceInfo : require('./SourceInfo'),
  SourceRange : require('./SourceRange'),
  FunctionInfo : require('./FunctionInfo'),
  FunctionCallInfo : require('./FunctionCallInfo'),
  MemoryInfo : require('./MemoryInfo')
}