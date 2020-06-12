const Limits = require('./CudaLimits')
const CudaWarp = require('./CudaWarp')

/**
 * Represents a Cuda Block
 * @memberof module:cuda
 */
class CudaBlock {

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
   * @type {Array<CudaWarp>}
   * @private
   */
  #warps
  
  /**
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} z 
   */
  constructor(x, y=1, z=1) {
    if ( !Limits.validBlockDims(x, y, z))
      throw new Error(`Invalid Block dimensions : ${x},${y},${z}`)
    this.#x = x
    this.#y = y
    this.#z = z
    this.#warps = Array.apply(null, Array(this.numWarps)).map(function () {})
  }

  /** 
   * Retrieve the size of the x-dimension of the block 
   * @type {Number}
   */
  get x() { return this.#x }

  /** 
   * Retrieve the size of the y-dimension of the block
   * @type {Number}
   */
  get y() { return this.#y }

  /** Retrieve the size of the z-dimension of the block
   * @returns {Number}
   */
  get z() { return this.#z }

  /** 
   * Retrieve the number of threads in the block
   * @returns {Number}
   */
  get size() { return this.#x * this.#y * this.#z }

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
  is1D() { 
    return (this.#y == 1 && this.#z == 1) 
        || (this.#y > 1  && this.#x == 1 && this.#z == 1) 
        || (this.#z > 1  && this.#x == 1 && this.#y == 1)
  }
  
  /**
   * Check if the block is 2-dimensional. i.e Exactly two dimensions have size > 1
   */
  is2D() { 
    return (this.#x > 1 && this.#y > 1 && this.#z == 1)
     || (this.#x > 1 && this.#y == 1 && this.#z > 1)
     || (this.#x == 1 && this.#y > 1 && this.#z > 1)
  } 

  /**
   * Check if the block is 3-dimensional. i.e All dimensions have size > 1
   * @returns {Boolean}
   */
  is3D() { return (this.#x > 1 && this.#y > 1 && this.#z > 1) }

  /**
   * String representation of the block
   * @returns {String}
   */
  toString() {
    return `(${this.#x}x${this.#y}, #threads: ${this.size}, #warps: ${this.numWarps})`
  }

  /**
   * Compare with another block for value equality
   * @param {CudaBlock} other 
   * @return {Boolean}
   */
  equals(other) {
    if ( !(other instanceof CudaBlock))
      return false
    return this.#x === other.x && this.#y === other.y && this.#z === other.z
  }
}

module.exports = CudaBlock