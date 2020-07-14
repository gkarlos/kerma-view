
const Limits = require('./CudaLimits')
const Block = require('./CudaBlock')
const Grid = require('./CudaGrid')
const Warp = require('./CudaWarp')
const Thread = require('./CudaThread')
const Index = require('./CudaIndex')
const Dim = require('./CudaDim')
const Launch = require('./CudaLaunch')
const Kernel = require('./CudaKernel')
const CudaLimits = require('./CudaLimits')
const CudaBlock = require('./CudaBlock')
const CudaGrid = require('./CudaGrid')
const CudaWarp = require('./CudaWarp')
const CudaThread = require('./CudaThread')
const CudaIndex = require('./CudaIndex')
const CudaDim = require('./CudaDim')
const CudaKernel = require('./CudaKernel')

/**
 * Check if an object is an instance of CudaGrid
 * @memberof module:cuda
 * @param {*} obj 
 * @returns {Boolean}
 */
function isCudaGrid(obj) {
  return (obj.constructor && ('CudaGrid' === obj.constructor.name))
}

/**
 * Check if an object is an instance of CudaBlock
 * @memberof module:cuda
 * @param {*} obj 
 * @returns {Boolean}
 */
function isCudaBlock(obj) {
  return (obj.constructor && ('CudaBlock' === obj.constructor.name))
}

/**
 * Check if an object is an instance of CudaWarp
 * @memberof module:cuda
 * @param {*} obj 
 * @returns {Boolean}
 */
function isCudaWarp(obj) {
  return (obj.constructor && ('CudaWarp' === obj.constructor.name))
}

/**
 * Check if an object is an instance of CudaThread
 * @memberof module:cuda
 * @param {*} obj 
 * @returns {Boolean}
 */
function isCudaThread(obj) {
  return (obj.constructor && ('CudaThread' === obj.constructor.name))
}

/**
 * Check if an object is an instance of CudaIndex
 * @memberof module:cuda
 * @param {*} obj 
 * @returns {Boolean}
 */
function isCudaIndex(obj) {
  return (obj.constructor && ('CudaIndex' === obj.constructor.name))
}

/**
 * Check if an object is an instance of CudaDim
 * @memberof module:cuda
 * @param {*} obj 
 * @returns {Boolean}
 */
function isCudaDim(obj) {
  return (obj.constructor && ('CudaDim' === obj.constructor.name))
}


/** 
 * @module cuda
 * @category Renderer
 * @subcategory models
 */
module.exports = {
  Limits,
  Block,
  Grid,
  Warp,
  Thread,
  Index,
  Dim,
  Launch,
  Kernel,
  CudaLimits,
  CudaBlock,
  CudaGrid,
  CudaWarp,
  CudaThread,
  CudaIndex,
  CudaDim,
  CudaKernel,
  isCudaGrid,
  isCudaBlock,
  isCudaWarp,
  isCudaThread,
  isCudaIndex,
  isCudaDim
}
