const CuWarp   = require('@renderer/models/cuda/CuWarp')
const CuDim    = require('@renderer/models/cuda/CuDim')
const CuLimits = require('@renderer/models/cuda/CuLimits')
const CuIndex  = require('@renderer/models/cuda/CuIndex')

var isCuGrid
var isCuIndex

/** @ignore @typedef {import("@renderer/models/cuda/CuGrid")} CuGrid */

/**
 * This class represents a block in a cuda grid
 * @memberof module:cuda
 */
class CuBlock {
  /** @type {CuDim}           */ #dim
  /** @type {CuGrid}        */ #grid 
  /** @type {CuIndex}       */ #index
  /** @type {Array<CuWarp>} */ #warps


  /**
   * Create new CuBlock
   * @param {CuGrid}         grid  The grid this block belongs to
   * @param {CuIndex|Number} index The index of the block within the grid
   * @throws {Error} Missing and/or undefined arguments
   * @throws {Error} Arguments have incorrect type
   * @throws {Error} Index not valid in the grid
   */
  constructor(grid, index) {

    if ( !isCuGrid)
      isCuGrid = require('@renderer/models/cuda').isCuGrid
    if ( !isCuIndex)
      isCuIndex = require('@renderer/models/cuda').isCuIndex

    if ( !grid)
      throw new Error("Missing required argument 'grid'")
    if ( !isCuGrid(grid))
      throw new Error('grid must be a CuGrid instance')
    
    this.#grid = grid
    this.#dim = grid.block

    try {
      this.setIndex(index)
    } catch ( e) {
      throw new Error(e)
    }

    // Create an empty warps array. We will lazily populate it
    // as soon as requests for warps come in
    this.#warps = Array.apply(null, Array(this.numWarps)).map(function () {})
  }

  /// --------------------- ///
  ///  Accessor Properties  ///
  /// --------------------- ///

  /**
   * The dimensions of this block
   * @type {CuDim}
   */
  get dim() { return this.#dim}

  /**
   * The grid this block belongs to
   * @type {CuGrid}
   */
  get grid() { return this.#grid }

  /** 
   * Size of the x-dimension of the block 
   * @type {Number}
   */
  get x() { return this.#dim.x }

  /** 
   * Size of the y-dimension of the block
   * @type {Number}
   */
  get y() { return this.#dim.y }

  /** 
   * Size of the z-dimension of the block
   * Currently this always returns 1 as 3D blocks are not yet supported
   * @type {Number}
   */
  get z() { return 1 }

  /** 
   * Number of threads in the block
   * @type {Number}
   */
  get size() { return this.#dim.size }

  /** 
   * Number of warps in this block
   * @type {Number}
   */
  get numWarps() { return Math.floor(this.size / CuLimits.warpSize) + (this.size % CuLimits.warpSize > 0 ? 1 : 0) }


  /// ---------------------- ///
  ///        Methods         ///
  /// ---------------------- ///

  /**
   * Assign an index to this block
   * 
   * @param   {CuIndex|Number} index 
   * @returns {CuBlock} this
   * @throws  {Error} Argument invalid or incorrect type
   * @throws  {Error} Index not valid in the grid
   */
  setIndex(index) {
    if ( !isCuIndex(index) && !Number.isInteger(index))
      throw new Error("Index must be CuIndex or Integer")
    if ( Number.isInteger(index))
      this.#index = this.#dim.is1D()? new CuIndex(index) : CuIndex.delinearize(index, this.#grid.dim)
    else
      this.#index = index
    if ( !this.#grid.hasIndex(this.#index))
      throw new Error(`Invalid block index ${this.#index.toString(true)} for grid ${this.#grid.toString(true)}`)
    return this;
  }

  /**
   * Retrieve the index of this block (if one exists) <br/>
   * @returns {CuIndex} The index of this block or `undefined`
   */
  getIndex() {
    return this.#index
  }

  /**
   * Retrieve the number of warps in this block. Alias for `numWarps`
   * @returns {Number}
   */
  getNumWarps() { return this.numWarps }

  /**
   * Retrieve the global index of the first thread in the block
   * @returns {CuIndex}
   * @throws If the block does not have an index. See {@link module:cuda.CuBlock#hasIndex}
   */
  getFirstGlobalThreadIdx() {
    return new CuIndex(this.#index.y * this.#dim.y, this.#index.x * this.#dim.x)
  }

  /**
   * Retrieve the global index of the last thread in the block
   * @returns {CuIndex}
   * @throws If the block does not have an index. See {@link module:cuda.CuBlock#hasIndex}
   */
  getLastGlobalThreadIdx() {
    return new CuIndex((this.#index.y + 1) * this.#dim.y - 1, (this.#index.x + 1) * this.#dim.x - 1)
  }

  /**
   * Retrieve the global linear index of the first thread in the block
   * @returns {Number}
   * @throws If the block does not have an index. See {@link module:cuda.CuBlock#hasIndex}
   */
  getFirstGlobalLinearThreadIdx() {
    return this.size * this.getIndex().linearize(this.#grid.dim)
  }

  /**
   * Retrieve the global linear index of the last thread in the block
   * @returns {Number}
   * @throws If the block does not have an index. See {@link module:cuda.CuBlock#hasIndex}
   */
  getLastGlobalLinearThreadIdx() {
    return this.size * (this.getIndex().linearize(this.#grid.dim) + 1) - 1
  }

  /**
   * Check if a thread index is within the bounds of this block
   * @param {CuIndex|Number} index 
   */
  hasLocalThreadIdx(index) { 
    return this.#dim.hasIndex(index)
  }

  /**
   * Check if a linear thread index is within the bounds of this block
   * @param {Number} index 
   */
  hasLocalLinearThreadIdx(index) {
    return index > 0 && index < this.size
  }

  /**
   * Check if this block contains a thread with a given global index.
   * 
   * If an integer is passed it will be treated as an index with 0 in the y-dimension.
   * For instance 
   *  - `hasGlobalThreadIdx(10)` 
   *  - `hasGlobalThreadIdx(new CuIndex(0,10))`
   *  - `hasGlobalThreadIdx(new CuIndex(10))`
   * are equivalent
   * 
   * To check if the block contains a linear index use {@link module:cuda.CuBlock#hasGlobalLinearIndex}
   * @param {CuIndex|Number} index 
   */
  hasGlobalThreadIdx(index) {
    let idx
    if ( Number.isInteger(index))
      idx = new CuIndex(index)
    else if ( index instanceof CuIndex)
      idx = index
    else
      throw new Error('index must be a CuIndex or an integer')

    let first = this.getFirstGlobalThreadIdx()
    let last = this.getLastGlobalThreadIdx()

    // console.log(idx.toString(), first.toString(), last.toString(), "---", this.#index.toString())
    return idx.x >= first.x && idx.x <= last.x
      &&  idx.y >= first.y && idx.y <= last.y
  }

  /**
   * Check if this block contains a thread with a given global linear index
   * @param {Number} index 
   */
  hasGlobalLinearThreadIdx(index) {
    if ( !Number.isInteger(index))
      throw new Error('index must be an integer')
    return index >= this.getFirstGlobalLinearThreadIdx() && index <= this.getLastGlobalLinearThreadIdx()
  }

  /**
   * Check if a warp index exists in this block
   * @param {CuIndex|Number} index 
   */
  hasWarpIdx(index) { 
    if ( !Number.isInteger(index))
      throw new Error('index must be an integer')
    return index >= 0 && index < this.numWarps
  }

  /** 
   * Check if there are unused lanes in the last warp of the block.
   * That is the size of the block is not a multiple of {@link CuLimits.warpSize}
   * @returns {Boolean}
   */
  hasWarpWithInactiveLanes() { return this.size % CuLimits.warpSize != 0 }

  /**
   * Retrieve a warp from this block
   * @param {Number} index
   * @returns {CuWarp}
   */
  getWarp(index) {
    if ( !Number.isInteger(index))
      throw new Error("Invalid argument. Integer required")
    if ( index < 0 || index >= this.numWarps)
      throw new Error()
    if ( this.#warps[index] === undefined)
      this.#warps[index] = new CuWarp(this, index)
    return this.#warps[index]
  }

  /**
   * Check if the block is 1-dimensional. i.e Exactly one dimension has size > 1
   * @returns {Boolean}
   */
  is1D() { return this.#dim.is1D() }
  
  /**
   * Check if the block is 2-dimensional. i.e Exactly two dimensions have size > 1
   */
  is2D() { return this.#dim.is1D() } 

  /**
   * Check if the block is 3-dimensional. i.e All dimensions have size > 1
   * @returns {Boolean}
   */
  is3D() { return false }

  /**
   * String representation of the block
   * @param {Boolean} [short=false] If set a compact String representation is returned
   * @returns {String}
   */
  toString(short=false) {
    return short ? `#${this.#index.toString()}, ${this.#dim.x}x${this.#dim.y}` 
      : `(#${this.#index.toString()}, dim: ${this.#dim.x}x${this.#dim.y}, #threads: ${this.size}, #warps: ${this.numWarps})`
  }

  /**
   * Compare with another block for equality
   * Two blocks are equal if they belong to the same grid
   * and have the same index within the grid
   * @param {CuBlock} other 
   * @return {Boolean}
   */
  equals(other) {
    return (other instanceof CuBlock) 
      && this.#grid.equals(other.grid)
      && this.#index.equals(other.getIndex())
  }

  /**
   * Returns a copy of this block
   * @returns {CuBlock}
   */
  clone() {
    return new CuBlock(this.#grid.clone(), this.#index.clone())
  }
}

module.exports = CuBlock