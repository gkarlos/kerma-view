/**
 * @module source
 * @category Renderer
 * @subcategory models
 * @property {module:source.SrcLoc} SrcLoc
 * @property {module:source.SrcInfo} SrcInfo
 * @property {module:source.SrcRange} SrcRange
 * @property {module:source.FunctionSrc} FunctionSrc
 * @property {module:source.FunctionCallSrc} FunctionCallSrc
 */
module.exports = {
  SrcLoc : require('./SrcLoc'),
  SrcInfo : require('./SrcInfo'),
  SrcRange : require('./SrcRange'),
  FunctionSrc : require('./FunctionSrc'),
  FunctionCallSrc : require('./FunctionCallSrc'),
  MemoryInfo : require('./MemoryInfo')
}