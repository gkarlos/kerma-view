const Limits = require('./CudaLimits')
const CudaWarp = require('./CudaWarp')
const CudaDim = require('./CudaDim')
const CudaIndex = require('./CudaIndex')

/** @ignore @typedef {import("@renderer/cuda/CudaDim")} CudaDim */
/** @ignore @typedef {import("@renderer/cuda/CudaIndex")} CudaIndex */

/**
 * Represents a Cuda Block
 * @memberof module:cuda
 */
class CudaBlock {
  /** @type {CudaDim} */ #dim
  /** @type {CudaIndex} */ #index
  /** @type {Array<CudaWarp>} */ #warps


  /**
   * Create new CudaBlock. A dim is required. An index may be assigned later.
   * **No checks are performed on the index**. That is the index may be invalid for the grid this block is part of.
   * @param {CudaDim|Number} dim The dimensions of the block
   * @param {CudaIndex|Number} [index] An optional index for the position of this block in the grid. Can be set later
   */
  constructor(dim, index=undefined) {

    this.#dim = Number.isInteger(dim)? new CudaDim(dim) : dim

    if ( this.#dim.is3D())
      throw new Error("3D Blocks are not currently supported")
    if ( !Limits.validBlockDims(this.#dim.x, this.#dim.y, this.#dim.z))
      throw new Error(`Invalid Block dimensions : ${this.#dim.toString()}`)

    if( index === undefined || index === null) 
      this.#index = null
    else {
      this.#index = Number.isInteger(index)? new CudaIndex(index) : index
    }

    this.#warps = Array.apply(null, Array(this.numWarps)).map(function () {})
  }

  /**
   * Check if this block has been assigned an index
   * @returns {Boolean}
   */
  hasIndex() { return this.#index !== null }

  /**
   * Assign an index to this block. Not checks are performed on the index.
   * Whether the index is valid within the grid must be checked externally
   * @param {CudaIndex|Number} index 
   * @returns {CudaBlock} this
   */
  setIndex(index) {
    if ( !(index instanceof CudaIndex) && !Number.isInteger(index))
      throw new Error("Index must be CudaIndex or Integer")
    this.#index = Number.isInteger(index)? new CudaIndex(index) : index
    return this;
  }

  /**
   * Retrieve the index of this block (if one exists) <br/>
   * If no index is assigned `null` is returned
   * @returns {CudaIndex} 
   */
  getIndex() {
    return this.#index === undefined? null: this.#index
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
  is3D() { return this.#dim.is3D() }

  /**
   * String representation of the block
   * @returns {String}
   */
  toString() {
    return `(${this.#dim.x}x${this.#dim.y}, #threads: ${this.size}, #warps: ${this.numWarps})`
  }

  /**
   * Compare with another block for value equality
   * @param {CudaBlock} other 
   * @return {Boolean}
   */
  equals(other) {
    if ( !(other instanceof CudaBlock))
      return false
    return this.#dim.equals(other.dim)
  }
}

module.exports = CudaBlock