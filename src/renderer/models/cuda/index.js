
const CuLimits       = require('./CuLimits')
const CuBlock        = require('./CuBlock')
const CuGrid         = require('./CuGrid')
const CuWarp         = require('./CuWarp')
const CuThread       = require('./CuThread')
const CuIndex        = require('./CuIndex')
// const CuLaunch       = require('./CuLaunch')
const CuKernel       = require('./CuKernel')
const CuAddrSpace      = require('./CuAddrSpace')

const Limits = CuLimits
const Block  = CuBlock
const Grid   = CuGrid
const Warp   = CuWarp
const Thread = CuThread
const Index  = CuIndex
// const Launch = CuLaunch
const Kernel = CuKernel
const AddrSpace = CuAddrSpace

/**
 * Check if an object is an instance of CuGrid
 * @memberof module:cuda
 * @param {*} obj 
 * @returns {Boolean}
 */
function isCuGrid(obj) {
  return (obj.constructor && ('CuGrid' === obj.constructor.name))
}

/**
 * Check if an object is an instance of CuBlock
 * @memberof module:cuda
 * @param {*} obj 
 * @returns {Boolean}
 */
function isCuBlock(obj) {
  return (obj.constructor && ('CuBlock' === obj.constructor.name))
}

/**
 * Check if an object is an instance of CuWarp
 * @memberof module:cuda
 * @param {*} obj 
 * @returns {Boolean}
 */
function isCuWarp(obj) {
  return (obj.constructor && ('CuWarp' === obj.constructor.name))
}

/**
 * Check if an object is an instance of CuThread
 * @memberof module:cuda
 * @param {*} obj 
 * @returns {Boolean}
 */
function isCuThread(obj) {
  return (obj.constructor && ('CuThread' === obj.constructor.name))
}

/**
 * Check if an object is an instance of CuIndex
 * @memberof module:cuda
 * @param {*} obj 
 * @returns {Boolean}
 */
function isCuIndex(obj) {
  return (obj.constructor && ('CuIndex' === obj.constructor.name))
}

/**
 * Check if an object is an instance of CuDim
 * @memberof module:cuda
 * @param {*} obj 
 * @returns {Boolean}
 */
function isCuDim(obj) {
  return (obj.constructor && ('CuDim' === obj.constructor.name))
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
  // Launch,
  Kernel,
  AddrSpace,
  CuLimits,
  CuBlock,
  CuGrid,
  CuWarp,
  CuThread,
  CuIndex,
  CuKernel,
  CuAddrSpace,
  isCuGrid,
  isCuBlock,
  isCuWarp,
  isCuThread,
  isCuIndex,
  isCuDim
}
