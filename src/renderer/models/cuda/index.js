/** 
 * @module cuda
 * @category models
 * @property {module:cuda.CudaLimits} Limits
 * @property {module:cuda.CudaBlock} Block
 * @property {module:cuda.CudaGrid} Grid
 * @property {module:cuda.CudaWarp} Warp
 * @property {module:cuda.CudaThread} Thread
 * @property {module:cuda.CudaIndex} Index
 * @property {module:cuda.CudaDim} Dim
 * @property {module:cuda.CudaKernel} Kernel
 */
module.exports = {
  Limits : require('./CudaLimits'),
  Block : require('./CudaBlock'),
  Grid : require('./CudaGrid'),
  Warp : require('./CudaWarp'),
  Thread : require('./CudaThread'),
  Index : require('./CudaIndex'),
  Dim : require('./CudaDim'),
  Launch : require('./CudaLaunch'),
  Kernel : require('./CudaKernel'),
  CudaLimits : require('./CudaLimits'),
  CudaBlock : require('./CudaBlock'),
  CudaGrid : require('./CudaGrid'),
  CudaWarp : require('./CudaWarp'),
  CudaThread : require('./CudaThread'),
  CudaIndex : require('./CudaIndex'),
  CudaDim : require('./CudaDim'),
  CudaKernel : require('./CudaKernel')
}