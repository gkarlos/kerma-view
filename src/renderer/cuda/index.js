
/** @ignore @typedef {import("./CudaLimits").} CudaLimits */

/** 
 * @module cuda
 * @property {module:cuda.CudaLimits} Limits
 * @property {module:cuda.CudaBlock} Block
 * @property {module:cuda.CudaGrid} Grid
 * @property {module:cuda.CudaWarp} Warp
 * @property {module:cuda.CudaIndex} Index
 * @property {module:cuda.CudaDim} Dim
 */
module.exports = {
  Limits : require('./CudaLimits'),
  Block : require('./CudaBlock'),
  Grid : require('./CudaGrid'),
  Warp : require('./CudaWarp'),
  Index : require('./CudaIndex'),
  Dim : require('./CudaDim'),
  CudaLimits : require('./CudaLimits'),
  CudaBlock : require('./CudaBlock'),
  CudaGrid : require('./CudaGrid'),
  CudaWarp : require('./CudaWarp'),
  CudaIndex : require('./CudaIndex'),
  CudaDim : require('./CudaDim')
}