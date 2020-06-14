const Limits = require('./CudaLimits')

/**
 * Represents a Cuda Grid
 * @memberof module:cuda
 */
class CudaGrid {

  /**
   * @type {Number} 
   * @private
   */
  #x
  /**
   * @type {Number} 
   * @private
   */
  #y
  /**
   * @type {Number} 
   * @private
   */
  #z

  /**
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} z 
   */
  constructor(x, y=1, z=1) {
    if ( !Limits.validGridDims(x, y, z))
      throw new Error(`Invalid Grid dimensions : ${x},${y},${z}`)
    this.#x = x
    this.#y = y
    this.#z = z
  }

  /** 
   * Retrieve the size of the x-dimension of the grid 
   * @returns {Number}
   */
  get x() { return this.#x }

  /** 
   * Retrieve the size of the y-dimension of the grid
   * @returns {Number}
   */
  get y() { return this.#y }

  /** 
   * Retrieve the size of the z-dimension of the grid
   * @returns {Number}
   */
  get z() { return this.#z }

  /**
   * Retrieve the number of blocks in the grid
   * @returns {Number}
   */
  get size() { return this.#x * this.#y * this.#z }

  hasIndex() {
    // TODO
  }

  /**
   * Check if the grid is 1-dimensional. i.e Exactly one dimension has size > 1
   * @returns {Boolean}
   */
  is1D() { 
    return (this.#y == 1 && this.#z == 1) 
        || (this.#y > 1  && this.#x == 1 && this.#z == 1) 
        || (this.#z > 1  && this.#x == 1 && this.#y == 1)
  }
  
  /**
   * Check if the grid is 2-dimensional. i.e Exactly two dimensions have size > 1
   */
  is2D() { 
    return (this.#x > 1 && this.#y > 1 && this.#z == 1)
     || (this.#x > 1 && this.#y == 1 && this.#z > 1)
     || (this.#x == 1 && this.#y > 1 && this.#z > 1)
  } 

  /**
   * Check if the grid is 3-dimensional. i.e All dimensions have size > 1
   * @returns {Boolean}
   */
  is3D() { return (this.#x > 1 && this.#y > 1 && this.#z > 1) }

  /**
   * String representation of the grid
   * @returns {String}
   */
  toString() {
    return `(${this.#x}x${this.#y}x${this.#z}, #blocks: ${this.size})`
  }

  
  /**
   * Compare with another grid for value equality
   * @param {CudaGrid} other 
   * @return {Boolean}
   */
  equals(other) {
    if ( !(other instanceof CudaGrid))
      return false
    return this.#x === other.x && this.#y === other.y && this.#z === other.z
  }
}


module.exports = CudaGrid