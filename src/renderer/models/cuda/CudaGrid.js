const Limits = require('./CudaLimits')
const CudaDim = require('./CudaDim')
const CudaIndex = require('./CudaIndex')

/** @ignore @typedef {import("@renderer/models/cuda/CudaDim")} CudaDim */

var CudaBlock;

/**
 * A Cuda grid description
 * @memberof module:cuda
 */
class CudaGrid {
  /** @type {CudaDim} */ #dim
  /** @type {CudaDim} */ #blockDim

  /** @type {CudaBlock} */ #blockInstance

  /**
   * @param {CudaDim|Number} dim Dimensions of the grid
   * @param {CudaDim|Number} blockDim Dimensions of the blocks of the grid
   */
  constructor(dim, blockDim) {
    if ( !(dim instanceof CudaDim) && !Number.isInteger(dim))
      throw new Error("dim must be a CudaDim or Integer")
    if ( !(blockDim instanceof CudaDim) && !Number.isInteger(blockDim))
      throw new Error('blockDim must be a CudaDim or Integer')

    this.#dim = Number.isInteger(dim)? new CudaDim(dim) : dim
    this.#blockDim = Number.isInteger(blockDim) ? new CudaDim(blockDim) : blockDim

    if ( this.#dim.is3D())
      throw new Error("3D Grids are not currently supported")    
    if ( this.#blockDim.is3D())
      throw new Error("3D Blocks are not currently supported")
   
    if ( !Limits.validGridDim(this.#dim))
      throw new Error(`Invalid Grid dimensions : ${this.#dim.toString()}`)
    if ( !Limits.validBlockDim(this.#blockDim))
      throw new Error(`Invalid Block dimensions : ${this.#blockDim.toString()}`)
    
    // this.#blockInstance = new CudaBlock(blockDim, this, 0)
  }

  /// --------------------- ///
  ///  Accessor Properties  ///
  /// --------------------- ///

  /**
   * The dimensions of the grid
   * @type {CudaDim}
   */
  get dim() { return this.#dim}

  /**
   * The dimenions of the blocks of the grid
   * @type {CudaDim}
   */
  get blockDim() { return this.#blockDim }

  /**
   * The dimenions of the blocks of the grid. Alias for {@link module:cuda.CudaGrid#blockDim}
   * @type {CudaDim}
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
   * @param {CudaIndex|Number} index A valid index within the grid
   * @throws Error on invalid index
   * @returns {CudaBlock}
   */
  getBlock(index) {
    if ( !CudaBlock)
      CudaBlock = require('./CudaBlock')
      
    return new CudaBlock(this.block, index)
    // if ( !(Number.isInteger(index) || (index instanceof CudaIndex)))
    //   throw new Error("index must me of type Number or CudaIndex")
    // if ( !this.hasIndex(index))
    //   throw new Error(`Invalid block index '${Number.isInteger(index)? index : index.toString()}' for grid '${this.toString(true)}'`)
    // TODO
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
   * @returns {CudaDim}
   */
  getDim() { return this.#dim}

  /**
   * Check if an index exists in this grid
   * @param {CudaIndex|Number} index 
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
   * @param {CudaGrid} other 
   * @return {Boolean}
   */
  equals(other) {
    return (other instanceof CudaGrid) && this.#dim.equals(other.dim) && this.#blockDim.equals(other.block)
  }

  /**
   * Create a copy of this grid
   * @returns {CudaGrid}
   */
  clone() {
    return new CudaGrid(this.#dim.clone(), this.#blockDim.clone())
  }
}


module.exports = CudaGrid