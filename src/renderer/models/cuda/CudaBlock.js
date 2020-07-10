const Limits = require('./CudaLimits')
const CudaWarp = require('./CudaWarp')
const CudaDim = require('./CudaDim')
const CudaIndex = require('./CudaIndex')

/** @ignore @typedef {import("@renderer/models/cuda/CudaDim")} CudaDim */
/** @ignore @typedef {import("@renderer/models/cuda/CudaIndex")} CudaIndex */

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
   * Create new CudaBlock. A dim is required. An index may be assigned later.
   * **No checks are performed on the index**. That is the index may be invalid for the grid this block is part of.
   * @param {CudaDim|Number}   dim The dimensions of the block
   * @param {CudaGrid}         [grid] The grid this block belongs to. Can be set later
   * @param {CudaIndex|Number} [index] An optional index for the position of this block in the grid. Can be set later
   */
  constructor(dim, grid=undefined, index=undefined) {

    const CudaGrid = require('./CudaGrid')

    /// check the dim
    if ( !(dim instanceof CudaDim) && !Number.isInteger(dim))
      throw new Error("dim must be a CudaDim or Integer")
      
    this.#dim = Number.isInteger(dim)? new CudaDim(dim) : dim

    if ( this.#dim.is3D())
      throw new Error("3D Blocks are not currently supported")
    if ( !Limits.validBlockDims(this.#dim.x, this.#dim.y, this.#dim.z))
      throw new Error(`Invalid Block dimensions : ${this.#dim.toString()}`)

    /// check the grid
    if( grid === undefined || grid === null) 
      this.#grid = undefined
    else {
      if ( !(typeof(grid) !== CudaGrid))
        throw new Error('grid must be a CudaGrid instance')
      if ( !grid.block.equals(this.#dim))
        throw new Error('dim does not match grid.block')
      this.#grid = grid
    }

    /// check the index
    if( index === undefined || index === null) 
      this.#index = CudaIndex.Unknown
    else {
      this.#index = Number.isInteger(index)? new CudaIndex(index) : index

      if ( this.#grid && !this.#grid.hasIndex(this.#index))
        throw new Error(`Invalid block index ${this.#index.toString(true)} for grid ${this.#grid.toString(true)}`)
    }

    this.#warps = Array.apply(null, Array(this.numWarps)).map(function () {})
  }

  /**
   * Check if this block has been assigned an index
   * @returns {Boolean}
   */
  hasIndex() { return !this.#index.equals(CudaIndex.Unknown) }

  /**
   * Check if this block has been associated with a grid
   * @returns {Boolean}
   */
  hasGrid() { return this.#grid === undefined }

  /**
   * Assign an index to this block. Not checks are performed on the index.
   * Whether the index is valid within the grid must be checked externally
   * @param {CudaIndex|Number} index 
   * @returns {CudaBlock} this
   * @throws {Error} On invalid argument
   */
  setIndex(index) {
    if ( !(index instanceof CudaIndex) && !Number.isInteger(index))
      throw new Error("Index must be CudaIndex or Integer")
    this.#index = Number.isInteger(index)? new CudaIndex(index) : index
    return this;
  }

  /**
   * Associate this block with a grid instance.
   * @param {CudaGrid} grid
   * @returns {CudaBlock} this
   * @throws {Error} On invalid argument
   * @throws {Error} If the block has an index which is out of bounds of the provided grid
   */
  setGrid(grid) {
    const CudaGrid = require('./CudaGrid')

    if ( !(grid instanceof CudaGrid))
      throw new Error('grid must be a CudaGrid instance')
    if ( this.#index && !grid.hasIndex(this.#index))
      throw new Error(`Grid '${grid.toString()}' and block index '${this.#index.toString()}' missmatch`)
    this.#grid = grid
    return this
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
  getFirstTid() {
    if ( !this.hasIndex())
      throw new Error('Operation requires an indx to be assigned to the block')
    return new CudaIndex(this.#index.y * this.#dim.y, this.#index.x * this.#dim.x)
  }

  /**
   * Retrieve the global index of the last thread in the block
   * @returns {CudaIndex}
   * @throws If the block does not have an index. See {@link module:cuda.CudaBlock#hasIndex}
   */
  getLastTid() {
    if ( !this.hasIndex())
      throw new Error('Operation required an index to be assigned to the block')
    return new CudaIndex((this.#index.y + 1) * this.#dim.y - 1, (this.#index.x + 1) * this.#dim.x - 1)
  }

  /**
   * Retrieve the global linear index of the first thread in the block
   * @returns {Number}
   * @throws If the block does not have an index. See {@link module:cuda.CudaBlock#hasIndex}
   */
  getFirstLinearTid() {
    if ( !this.hasIndex())
      throw new Error('Operation requires an indx to be assigned to the block')
    return this.size * this.getIndex().linearize(this.#dim)
  }

  /**
   * Retrieve the global linear index of the last thread in the block
   * @returns {Number}
   * @throws If the block does not have an index. See {@link module:cuda.CudaBlock#hasIndex}
   */
  getLastLinearTid() {
    if ( !this.hasIndex())
      throw new Error('Operation requires an index to be assigned to the block')
    return this.size * (this.getIndex() + 1) - 1
  }

  /**
   * Retrieve the dimensions of this block
   * @returns {CudaDim}
   */
  get dim() { return this.#dim}

  /** 
   * Retrieve the size of the x-dimension of the block 
   * @type {Number}
   */
  get x() { return this.#dim.x }

  /** 
   * Retrieve the size of the y-dimension of the block
   * @type {Number}
   */
  get y() { return this.#dim.y }

  // /** Retrieve the size of the z-dimension of the block
  //  * @returns {Number}
  //  */
  // get z() { return this.#dim.z }

  /** 
   * Retrieve the number of threads in the block
   * @returns {Number}
   */
  get size() { return this.#dim.size }

  /** 
   * Retrieve the number of warps in the block
   * @returns {Number}
   */
  get numWarps() { return Math.floor(this.size / Limits.warpSize) + (this.size % Limits.warpSize > 0 ? 1 : 0) }

  /**
   * Check if a thread index exists in this block
   * @param {CudaIndex|Number} index 
   */
  hasThreadIndex(index) { return this.#dim.hasIndex(index) }

  /**
   * Check if a warp index exists in this block
   * @param {CudaIndex|Number} index 
   */
  hasWarpIndex(index) { 
    return Number.isInteger(index) 
      ? (index >= 0 && index < this.numWarps)
      : (index.y >= 0 && index.y < this.numWarps)
  }

  /** 
   * Check if there are unused lanes in the last warp of the block.
   * That is the size of the block is not a multiple of {@link CudaLimits.warpSize}
   * @returns {Boolean}
   */
  hasWarpWithInactiveLanes() { return this.size % Limits.warpSize != 0 }

  /**
   * Retrieve a warp from this block
   * @param {Number} index
   * @returns {CudaWarp}
   */
  getWarp(index) {
    if ( !Number.isInteger(index))
      throw new Error("Invalid argument. Integer required")
    if ( index < 0 || index > this.numWarps)
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
   * Two blocks are considered equal if they have the same dimensions, i.e the indices of
   * the blocks within the grid are not checked.
   * To compare if two CudaBlock objects refer to same block within the grid use `eql()`
   * @param {CudaBlock} other 
   * @return {Boolean}
   */
  equals(other) {
    return (other instanceof CudaBlock) && this.#dim.equals(other.dim)
  }

  /**
   * Compare with another block for equality including indices
   * @param {CudaBlock} other 
   */
  eql(other) {
    return this.equals(other)
      && this.hasIndex() && other.hasIndex()
      && this.getIndex().equals(other.getIndex())
  }
}

module.exports = CudaBlock