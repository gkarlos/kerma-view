const {
  CudaLimits,
  CudaWarp,
  CudaDim,
  CudaIndex,
  isCudaGrid } = require('@renderer/models/cuda')

/** @ignore @typedef {import("@renderer/models/cuda/CudaGrid")} CudaGrid */

/**
 * This class represents a block in a cuda grid
 * @memberof module:cuda
 */
class CudaBlock {
  /** @type {CudaDim}         */ #dim
  /** @type {CudaGrid}        */ #grid 
  /** @type {CudaIndex}       */ #index
  /** @type {Array<CudaWarp>} */ #warps


  /**
   * Create new CudaBlock
   * @param {CudaGrid}         grid  The grid this block belongs to
   * @param {CudaIndex|Number} index The index of the block within the grid
   * @throws {Error} Missing and/or undefined arguments
   * @throws {Error} Arguments have incorrect type
   * @throws {Error} Index not valid in the grid
   */
  constructor(grid, index) {
    if ( !grid)
      throw new Error("Missing required argument 'grid'")
    if ( !isCudaGrid(grid))
      throw new Error('grid must be a CudaGrid instance')

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
   * @type {CudaDim}
   */
  get dim() { return this.#dim}

  /**
   * The grid this block belongs to
   * @type {CudaGrid}
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
   * Number of warps in the block
   * @type {Number}
   */
  get numWarps() { return Math.floor(this.size / CudaLimits.warpSize) + (this.size % CudaLimits.warpSize > 0 ? 1 : 0) }


  /// ---------------------- ///
  ///        Methods         ///
  /// ---------------------- ///

  /**
   * Assign an index to this block
   * 
   * @param   {CudaIndex|Number} index 
   * @returns {CudaBlock} this
   * @throws  {Error} Argument invalid or incorrect type
   * @throws  {Error} Index not valid in the grid
   */
  setIndex(index) {
    if ( !(index instanceof CudaIndex) && !Number.isInteger(index))
      throw new Error("Index must be CudaIndex or Integer")
    if ( Number.isInteger(index))
      this.#index = this.#dim.is1D()? new CudaIndex(index) : CudaIndex.delinearize(index, this.#grid.dim)
    else
      this.#index = index
    if ( !this.#grid.hasIndex(this.#index))
      throw new Error(`Invalid block index ${this.#index.toString(true)} for grid ${this.#grid.toString(true)}`)
    return this;
  }

  /**
   * Retrieve the index of this block (if one exists) <br/>
   * @returns {CudaIndex} The index of this block or `undefined`
   */
  getIndex() {
    return this.#index
  }

  /**
   * Retrieve the global index of the first thread in the block
   * @returns {CudaIndex}
   * @throws If the block does not have an index. See {@link module:cuda.CudaBlock#hasIndex}
   */
  getFirstGlobalThreadIdx() {
    return new CudaIndex(this.#index.y * this.#dim.y, this.#index.x * this.#dim.x)
  }

  /**
   * Retrieve the global index of the last thread in the block
   * @returns {CudaIndex}
   * @throws If the block does not have an index. See {@link module:cuda.CudaBlock#hasIndex}
   */
  getLastGlobalThreadIdx() {
    return new CudaIndex((this.#index.y + 1) * this.#dim.y - 1, (this.#index.x + 1) * this.#dim.x - 1)
  }

  /**
   * Retrieve the global linear index of the first thread in the block
   * @returns {Number}
   * @throws If the block does not have an index. See {@link module:cuda.CudaBlock#hasIndex}
   */
  getFirstGlobalLinearThreadIdx() {
    return this.size * this.getIndex().linearize(this.#grid.dim)
  }

  /**
   * Retrieve the global linear index of the last thread in the block
   * @returns {Number}
   * @throws If the block does not have an index. See {@link module:cuda.CudaBlock#hasIndex}
   */
  getLastGlobalLinearThreadIdx() {
    return this.size * (this.getIndex().linearize(this.#grid.dim) + 1) - 1
  }

  /**
   * Check if a thread index is within the bounds of this block
   * @param {CudaIndex|Number} index 
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
   *  - `hasGlobalThreadIdx(new CudaIndex(0,10))`
   *  - `hasGlobalThreadIdx(new CudaIndex(10))`
   * are equivalent
   * 
   * To check if the block contains a linear index use {@link module:cuda.CudaBlock#hasGlobalLinearIndex}
   * @param {CudaIndex|Number} index 
   */
  hasGlobalThreadIdx(index) {
    let idx
    if ( Number.isInteger(index))
      idx = new CudaIndex(index)
    else if ( index instanceof CudaIndex)
      idx = index
    else
      throw new Error('index must be a CudaIndex or an integer')

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
   * @param {CudaIndex|Number} index 
   */
  hasWarpIdx(index) { 
    if ( !Number.isInteger(index))
      throw new Error('index must be an integer')
    return index >= 0 && index < this.numWarps
  }

  /** 
   * Check if there are unused lanes in the last warp of the block.
   * That is the size of the block is not a multiple of {@link CudaLimits.warpSize}
   * @returns {Boolean}
   */
  hasWarpWithInactiveLanes() { return this.size % CudaLimits.warpSize != 0 }

  /**
   * Retrieve a warp from this block
   * @param {Number} index
   * @returns {CudaWarp}
   */
  getWarp(index) {
    if ( !Number.isInteger(index))
      throw new Error("Invalid argument. Integer required")
    if ( index < 0 || index >= this.numWarps)
      throw new Error()
    if ( this.#warps[index] === undefined)
      this.#warps[index] = new CudaWarp(this, index)
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
   * @param {CudaBlock} other 
   * @return {Boolean}
   */
  equals(other) {
    return (other instanceof CudaBlock) 
      && this.#grid.equals(other.grid)
      && this.#index.equals(other.getIndex())
  }

  /**
   * Returns a copy of this block
   * @returns {CudaBlock}
   */
  clone() {
    return new CudaBlock(this.#grid.clone(), this.#index.clone())
  }
}

module.exports = CudaBlock