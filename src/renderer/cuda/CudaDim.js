class CudaDim {
  /** @type {Number} */
  #rows
  /** @type {Number} */
  #cols

  /**
   * Create a new CudaDim instance
   * @param {Number} cols Number of columns (x-dimension)
   * @param {Number} rows Number of rows (y-dimension)
   */
  constructor(cols, rows=1) {
    if ( !Number.isInteger(cols))
      throw new Error('Invalid argument `cols`. Must be integer')
    if ( !Number.isInteger(cols))
      throw new Error('Invalid argument `cols`. Must be integer')
    if ( cols === 0 || rows === 0)
      throw new Error('Arguments cannot be 0')
      
    this.#cols = cols
    this.#rows = rows
  }
  
  /** 
   * Number of rows. Size of the y-dimension
   * @returns {Number}
   */
  get rows() { return this.#rows}

  /** 
   * Number of rows. Size of the y-dimension
   * @returns {Number}
   */
  get y() { return this.#rows}

  /** 
   * Number of columns. Size of the x-dimension
   * @returns {Number}
   */
  get cols() { return this.#cols}

  /** 
   * Number of rows. Size of the y-dimension
   * @returns {Number}
   */
  get x() { return this.#cols}

  /**
   * Total number of elements
   * @returns {Number}
   */
  get size() { return this.#rows * this.#cols }

  /**
   * Create a copy of this CudaDim object
   * @returns {CudaDIm}
   */
  clone() {
    return new CudaDim(this.#cols, this.#rows)
  }

  /**
   * String representation of this CudaDim object
   * @returns {String}
   */
  toString() {
    return `${this.cols}x${this.rows}`
  }

  /**
   * Compare with another CudaDim for value-equality
   * @param {CudaDim} other Another CudaDim
   * @returns {Boolean}
   */
  equals(other) {
    if ( !other || !(other instanceof CudaDim))
      return false
    return this.rows === other.rows && this.cols === other.cols
  }

  /**
   * Returns an array with the size of the y and x dimensions (in that order)
   * @returns {Array.<Number>}
   */
  toArray() {
    return [this.#cols, this.#rows]
  }
}

module.exports = CudaDim