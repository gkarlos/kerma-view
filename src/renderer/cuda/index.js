
/** @ignore @typedef {import("./CudaLimits").} CudaLimits */

/** 
 * @module cuda
 * @property {module:cuda.CudaLimits} Limits
 * @property {module:cuda.CudaBlock} Block
 * @property {module:cuda.CudaGrid} Grid
 * @property {module:cuda.CudaWarp} Warp
 */
module.exports = {
  Limits : require('./CudaLimits'),
  Block : require('./CudaBlock'),
  Grid : require('./CudaGrid'),
  Warp : require('./CudaWarp')
}