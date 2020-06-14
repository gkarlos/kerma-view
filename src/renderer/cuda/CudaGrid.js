const Limits = require('./CudaLimits')
const CudaDim = require('./CudaDim')

/** @ignore @typedef {import("@renderer/cuda/CudaDim")} CudaDim */

/**
 * Represents a Cuda Grid
 * @memberof module:cuda
 */
class CudaGrid {
  /** @type {CudaDim} */ #dim

  /**
   * 
   * @param {CudaDim} dim 
   */
  constructor(dim) {
    if ( !(dim instanceof CudaDim) && !Number.isInteger(dim))
      throw new Error("dim must be a CudaDim or Integer")

    this.#dim = Number.isInteger(dim)? new CudaDim(dim) : dim

    if ( this.#dim.is3D())
      throw new Error("3D Grids are not currently supported")    
   
    if ( !Limits.validGridDims(this.#dim.x, this.#dim.y, this.#dim.z))
      throw new Error(`Invalid Grid dimensions : ${this.#dim.toString()}`)
  }

  /**
   * Retrieve the dimensions of this grid
   * @returns {CudaDim}
   */
  get dim() { return this.#dim}

  /** 
   * Retrieve the size of the x-dimension of the grid 
   * @returns {Number}
   */
  get x() { return this.#dim.x }

  /** 
   * Retrieve the size of the y-dimension of the grid
   * @returns {Number}
   */
  get y() { return this.#dim.y }

  // /** 
  //  * Retrieve the size of the z-dimension of the grid
  //  * @returns {Number}
  //  */
  // get z() { return this.#z }

  /**
   * Retrieve the number of blocks in the grid
   * @returns {Number}
   */
  get size() { return this.#dim.size }

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
   * @returns {String}
   */
  toString() {
    return `(${this.#dim.x}x${this.#dim.y}, #blocks: ${this.size})`
  }

  
  /**
   * Compare with another grid for value equality
   * @param {CudaGrid} other 
   * @return {Boolean}
   */
  equals(other) {
    if ( !(other instanceof CudaGrid))
      return false
    return this.#dim.equals(other.dim)
  }
}


module.exports = CudaGrid