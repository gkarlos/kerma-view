const Limits    = require('@renderer/models/cuda/CuLimits')
const CuDim   = require('@renderer/models/cuda/CuDim')
const CuIndex = require('@renderer/models/cuda/CuIndex')
const CuBlock = require('@renderer/models/cuda/CuBlock')
const Dim = require('@renderer/models/Dim')

/** @ignore @typedef {import("@renderer/models/cuda/CuBlock")} CuBlock */

/**
 * A Cuda grid description
 * @memberof module:cuda
 */
class CuGrid {
  /** @type {CuDim}   */ #dim
  /** @type {CuDim}   */ #blockDim
  /** @type {CuBlock} */ #blockInstance

  /**
   * @param {CuDim|Number} dim Dimensions of the grid. 
   *                             If an integer is passed it is considered the x-dimension and the y-dimension is implicitly `1`
   * @param {CuDim|Number} blockDim Dimensions of the blocks of the grid
   *                                  If an integer is passed it is considered the x-dimension and the y-dimension is implicitly `1`
   */
  constructor(dim, blockDim) {
    if ( !(dim instanceof CuDim) && !(dim instanceof Dim) && !Number.isInteger(dim))
      throw new Error("dim must be a CuDim or Integer")
    if ( !(blockDim instanceof CuDim) && !(blockDim instanceof Dim) && !Number.isInteger(blockDim))
      throw new Error('blockDim must be a CuDim or Integer')

    this.#dim = Number.isInteger(dim)? new CuDim(dim) : dim
    this.#blockDim = Number.isInteger(blockDim) ? new CuDim(blockDim) : blockDim

    if ( this.#dim.is3D())
      throw new Error("3D Grids are not currently supported")    
    if ( this.#blockDim.is3D())
      throw new Error("3D Blocks are not currently supported")
   
    if ( !Limits.validGridDim(this.#dim))
      throw new Error(`Invalid Grid dimensions : ${this.#dim.toString()}`)
    if ( !Limits.validBlockDim(this.#blockDim))
      throw new Error(`Invalid Block dimensions : ${this.#blockDim.toString()}`)

    this.#blockInstance = new CuBlock(this, 0)    
  }

  /// --------------------- ///
  ///  Accessor Properties  ///
  /// --------------------- ///

  /**
   * The dimensions of the grid
   * @type {CuDim}
   */
  get dim() { return this.#dim}

  /**
   * The dimenions of the blocks of the grid
   * @type {CuDim}
   */
  get blockDim() { return this.#blockDim }

  /**
   * The dimenions of the blocks of the grid. Alias for {@link module:cuda.CuGrid#blockDim}
   * @type {CuDim}
   */
  get block() { return this.#blockDim }

  /** 
   * Retrieve the size of the x-dimension of the grid 
   * @returns {Number}
   */
  get x() { return this.#dim.x }

  /** 
   * Retrieve the size of the y-dimension of the grid
   * @returns {Number}
   */
  get y() { return this.#dim.y; }

  /**
   * Retrieve the number of blocks in the grid
   * @returns {Number}
   */
  get size() { return this.#dim.size }



  /// --------------------- ///
  ///        Methods        ///
  /// --------------------- ///

  /**
   * Retrieve the block at a given index
   * @param {CuIndex|Number} index A valid index within the grid
   * @throws Error on invalid index
   * @returns {CuBlock}
   */
  getBlock(index) {
    try {
      return new CuBlock(this, index)
    } catch ( e) {
      throw new Error(e.message)
    }
  }

  /**
   * Retrieve the number of warps in each block of the grid
   * @returns {Number}
   */
  getBlockNumWarps() {
    return this.#blockInstance.numWarps
  }

  /**
   * Retrieve the dimensions of this grid
   * @returns {CuDim}
   */
  getDim() { return this.#dim}

  /**
   * Check if an index exists in this grid
   * @param {CuIndex|Number} index 
   */
  hasIndex(index) { return this.#dim.hasIndex(index) }

  /**
   * Check if the grid is 1-dimensional
   * @returns {Boolean}
   */
  is1D() { return this.#dim.is1D() }
  
  /**
   * Check if the grid is 2-dimensional
   */
  is2D() { return this.#dim.is2D() } 

  /**
   * Check if the grid is 3-dimensional. i.e All dimensions have size > 1
   * @returns {Boolean}
   */
  is3D() { return false }

  /**
   * String representation of the grid
   * @param {Boolean} [short=false] If set a compact String representation is returned
   * @returns {String}
   */
  toString(short=false) {
    return short ? `${this.#dim.toString(true)}, ${this.block.x}x${this.block.y}` 
    : `(${this.x}x${this.y}, ${this.block.x}x${this.block.y}, #blocks: ${this.size})`
  }

  
  /**
   * Compare with another grid for value equality
   * @param {CuGrid} other 
   * @return {Boolean}
   */
  equals(other) {
    return (other instanceof CuGrid) && this.#dim.equals(other.dim) && this.#blockDim.equals(other.block)
  }

  /**
   * Create a copy of this grid
   * @returns {CuGrid}
   */
  clone() {
    return new CuGrid(this.#dim.clone(), this.#blockDim.clone())
  }
}


module.exports = CuGrid