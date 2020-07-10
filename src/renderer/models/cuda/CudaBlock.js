const Limits = require('./CudaLimits')
const CudaWarp = require('./CudaWarp')
const CudaDim = require('./CudaDim')
const CudaIndex = require('./CudaIndex')

/** @ignore @typedef {import("@renderer/models/cuda/CudaDim")} CudaDim */
/** @ignore @typedef {import("@renderer/models/cuda/CudaIndex")} CudaIndex */
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
   * Create new CudaBlock. A dim is required. An index may be assigned later.
   * **No checks are performed on the index**. That is the index may be invalid for the grid this block is part of.
   * @param {CudaDim|Number}   dim The dimensions of the block
   * @param {CudaGrid}         grid The grid this block belongs to
   * @param {CudaIndex|Number} [index] An optional index for the position of this block in the grid. 
   *                                   If a number is passed it will first be delinearized. Can be set later
   */
  constructor(dim, grid=undefined, index=undefined) {

    const CudaGrid = require('./CudaGrid')

    ///
    /// check the dim
    ///
    if ( !dim)
      throw new Error("Missing required argument 'dim'")
    if ( !(dim instanceof CudaDim) && !Number.isInteger(dim))
      throw new Error("dim must be a CudaDim or Integer")
      
    this.#dim = Number.isInteger(dim)? new CudaDim(dim) : dim

    if ( this.#dim.is3D())
      throw new Error("3D Blocks are not currently supported")
    if ( !Limits.validBlockDim(this.#dim))
      throw new Error(`Invalid Block dimensions : ${this.#dim.toString()}`)

    ///
    /// check the grid
    ///
    if ( !grid)
      throw new Error("Missing required argument 'grid'")
    if ( !(grid instanceof CudaGrid))
      throw new Error('grid must be a CudaGrid')
    if ( !grid.block.equals(this.#dim))
      throw new Error('dim does not match grid.block')

    this.#grid = grid

    /// 
    /// check the index
    ///
    if( index === undefined || index === null)
      this.#index = CudaIndex.Unknown
    else
      this.setIndex(index)

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
  get numWarps() { return Math.floor(this.size / Limits.warpSize) + (this.size % Limits.warpSize > 0 ? 1 : 0) }


  /// ------------------- ///
  ///       Methods       ///
  /// ------------------- ///

  /**
   * Check if this block has been assigned an index
   * @returns {Boolean}
   */
  hasIndex() { return !this.#index.equals(CudaIndex.Unknown) }

  /**
   * Check if this block has been associated with a grid
   * @returns {Boolean}
   */
  hasGrid() { return this.#grid !== undefined }

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
    if ( Number.isInteger(index))
      this.#index = this.#dim.is1D()? new CudaIndex(index) : CudaIndex.delinearize(index, this.#grid.dim)
    else
      this.#index = index
    if ( !this.#grid.hasIndex(this.#index))
      throw new Error(`Invalid block index ${this.#index.toString(true)} for grid ${this.#grid.toString(true)}`)
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
  getFirstThreadIdx() {
    if ( !this.hasIndex())
      throw new Error('Operation requires an indx to be assigned to the block')
    return new CudaIndex(this.#index.y * this.#dim.y, this.#index.x * this.#dim.x)
  }

  /**
   * Retrieve the global index of the last thread in the block
   * @returns {CudaIndex}
   * @throws If the block does not have an index. See {@link module:cuda.CudaBlock#hasIndex}
   */
  getLastThreadIdx() {
    if ( !this.hasIndex())
      throw new Error('Operation required an index to be assigned to the block')
    return new CudaIndex((this.#index.y + 1) * this.#dim.y - 1, (this.#index.x + 1) * this.#dim.x - 1)
  }

  /**
   * Retrieve the global linear index of the first thread in the block
   * @returns {Number}
   * @throws If the block does not have an index. See {@link module:cuda.CudaBlock#hasIndex}
   */
  getFirstLinearThreadIdx() {
    if ( !this.hasIndex())
      throw new Error('Operation requires an index to be assigned to the block')
    if ( !this.hasGrid())
      throw new Error('Operation requires a grid to be associated with the block')

    return this.size * this.getIndex().linearize(this.#grid.dim)
  }

  /**
   * Retrieve the global linear index of the last thread in the block
   * @returns {Number}
   * @throws If the block does not have an index. See {@link module:cuda.CudaBlock#hasIndex}
   */
  getLastLinearThreadIdx() {
    if ( !this.hasIndex())
      throw new Error('Operation requires an index to be assigned to the block')
    if ( !this.hasGrid())
      throw new Error('Operation requires a grid to be associated with the block')
      
    return this.size * (this.getIndex().linearize(this.#grid.dim) + 1) - 1
  }

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
   * Two blocks are considered equal if they have the same dimensions, belong to the
   * same grid and have the same index or both have no index. To compare the blocks
   * without their indices use `eql`
   * @param {CudaBlock} other 
   * @return {Boolean}
   */
  equals(other) {
    return (other instanceof CudaBlock) 
      && this.#dim.equals(other.dim)
      && this.#grid.equals(other.grid)
      && ( (!this.hasIndex() && !other.hasIndex()) || (this.getIndex().equals(other.getIndex())) )
  }

  /**
   * Compare with another block for equality including grid and index
   * @param {CudaBlock} other 
   */
  eql(other) {
    return this.equals(other)
      && this.hasIndex() && other.hasIndex()
      && this.getIndex().equals(other.getIndex())
  }
}

module.exports = CudaBlock