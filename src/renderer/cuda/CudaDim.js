const CudaIndex = require('./CudaIndex')

/**
 * @memberof module:cuda
 */
class CudaDim {
  /** @type {Number} */
  #x
  /** @type {Number} */
  #y
  /** @type {Number} */
  #z

  /**
   * Create a new CudaDim instance
   * @param {Number} x Size of the x-dimension (Number of columns)
   * @param {Number} [y] Size of the y-dimension (Number of rows)
   * @param {Number} [z] Size of the z-dimension (Number of layers)
   */
  constructor(x, y=1, z=1) {
    if ( !Number.isInteger(x))
      throw new Error('Invalid argument `x`. Must be integer')
    if ( !Number.isInteger(y))
      throw new Error('Invalid argument `y`. Must be integer')
    if ( !Number.isInteger(z))
      throw new Error('Invalid argument `z`. Must be integer')
    if ( x < 1 || y < 1 || z < 1)
      throw new Error('Arguments cannot be < 1')
    this.#x = x
    this.#y = y
    this.#z = z
  }

  /** 
   * Size of the x-dimension (Number of columns)
   * @returns {Number}
   */
  get x() { return this.#x}

  /** 
   * Size of the y-dimension (Number of rows)
   * @returns {Number}
   */
  get y() { return this.#y}

  /** 
   * Size of the z-dimension (Number of layers)
   * @returns {Number}
   */
  get z() { return this.#z}
  
  /** 
   * Number of rows (y-dimension)
   * @alias y
   * @returns {Number}
   */
  get rows() { return this.#y}

  /** 
   * Number of columns (x-dimension)
   * @alias x
   * @returns {Number}
   */
  get cols() { return this.#x}

  /** 
   * Number of layers (z-dimension)
   * @alias x
   * @returns {Number}
   */
  get layers() { return this.#z}

  /**
   * Total number of elements
   * @returns {Number}
   */
  get size() { return this.#x * this.#y * this.#z}

  /**
   * Check if an index exists in these dimensions
   * @param {CudaIndex|Number} index 
   */
  hasIndex(index) {
    if ( !(index instanceof CudaIndex) && !Number.isInteger(index))
      throw new Error("index must be a CudaIndex or Integer")
    let idx = Number.isInteger(index)? new CudaIndex(index) : index
    return  !( idx.x >= this.#x ||  idx.y >= this.#y)
  }

  /**
   * Check if 1-dimensional
   * @returns {Boolean}
   */
  is1D() { 
    return (this.#y == 1 && this.#z == 1) 
        || (this.#y > 1  && this.#x == 1 && this.#z == 1) 
        || (this.#z > 1  && this.#x == 1 && this.#y == 1)
  }
  
  /**
   * Check if 2-dimensional
   * @returns {Boolean}
   */
  is2D() { 
    return (this.#x > 1 && this.#y > 1 && this.#z == 1)
     || (this.#x > 1 && this.#y == 1 && this.#z > 1)
     || (this.#x == 1 && this.#y > 1 && this.#z > 1)
  } 

  /**
   * Check if 3-dimensional
   * @returns {Boolean}
   */
  is3D() { return (this.#x > 1 && this.#y > 1 && this.#z > 1) }

  /**
   * Create a copy of this CudaDim object
   * @returns {CudaDim}
   */
  clone() {
    return new CudaDim(this.#x, this.#y, this.#z)
  }

  /**
   * String representation of this CudaDim object
   * @returns {String}
   */
  toString() {
    let str = `${this.#x}x${this.#y}`
    if (this.#z > 1)
      str += `x${this.#z}`
    return str
  }

  /**
   * Compare with another CudaDim for value-equality
   * @param {CudaDim} other Another CudaDim
   * @returns {Boolean}
   */
  equals(other) {
    if ( !other || !(other instanceof CudaDim))
      return false
    return this.#x === other.x && this.y === other.y && this.z === other.z
  }

  /**
   * Returns an array with the size of the x,y and z dimensions (in that order)
   * @returns {Array.<Number>}
   */
  toArray() {
    return [this.#x, this.#y, this.#z]
  }
}

module.exports = CudaDim