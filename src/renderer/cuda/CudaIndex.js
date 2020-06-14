/** @ignore @typedef {import("@renderer/cuda/CudaDim")} CudaDim */


/**
 * Represents a 2D index value. Can be used index a thread or
 * index into an array. **Row-major** order is assumed
 * 
 * @memberof module:cuda
 */
class CudaIndex {
  /** @type {Number} */
  #col
  /** @type {Number} */
  #row
  /** @type {Boolean} */
  #onedimensional

  /**
   * Transform 2D index to 1D index
   * @param {CudaIndex} index A 2D index
   * @param {CudaDim} dim A cuda dim description
   * @throws {Error} If args are invalid. **Only 2D CudaDims are supported**
   * @returns {Number} 
   */
  static linearize(index, dim) {
    if ( index === undefined) throw new Error('Missing required argument `index`')
    if ( dim === undefined)  throw new Error('Missing required argument `dim`')
    if ( dim.is3D()) throw new Error('Invalid dim. 3 dimensions are not supported')
    if ( index.col >= dim.x || index.row >= dim.y)
      throw new Error(`Invalid index '${index.toString()}' for dimensions [${rows},${cols}]`)

    if ( dim.y == 1) //1D
      return index.col

    return (index.row * dim.x) + index.col
  }

  /**
   * Transform a 1-dimensional index to a 2-dimensional index
   * @param {Number|CudaIndex} index A 1-Dimensional index. If a CudaIndex is passed and the y-dimension > 1 then it is returned as is.
   * @param {CudaDim} dim A cuda dim description
   * @throws {Error} If args are invalid. **Only 2D CudaDims are supported**
   * @returns {CudaIndex} 
   */
  static delinearize(index, dim) {
    if ( index === undefined) throw new Error('Missing required argument `index`')
    if ( dim === undefined)  throw new Error('Missing required argument `dim`')
    if ( dim.is3D()) throw new Error('Invalid dim. 3 dimensions are not supported')

    let row, col
    if ( Number.isInteger(index)) {
      if ( dim.y === 1)
        return new CudaIndex(index)
      row = Math.floor(index / dim.x)
      col = index % dim.x
    } else {
      if ( !(index instanceof CudaIndex)) throw new Error('Argument `index` must be an Integer or a CudaIndex')
      // if ( index.col >= dim.x || index.row >= dim.y) throw new Error(`Argument missmatch. CudaIndex ${index.toString()} not valid for dims ${dim.toString()}`)
      if ( index.row > 0) //2D index already
        return index
      row = Math.floor(index.col / dim.x)
      col = index.col % dim.x
    }

    if ( row >= dim.y || col >= dim.x)
      throw new Error(`Argument missmatch. CudaIndex ${index.toString()} not valid for dims ${dim.toString()}`)

    return new CudaIndex(row, col)
  }

  /** @protected */
  _argCheck(row,col) {
    if ( row && (!Number.isInteger(row) || row < 0))
      throw new Error('Invalid index `row`: must be integer > 0')
    if ( col && (!Number.isInteger(col) || col < 0))
      throw new Error('Invalid index `col`: must be integer > 0')
  }

  /**
   * Creates a new `CudaIndex` object
   *
   * @param {Number} [row] Value for the row, (y) dimension.
   * @param {Number} col Value for the col (x) dimension.
   * @description
   *  - When two arguments are passed the first one defines the row and the second one the column.
   *  - When one argument is passed it defines the colum.
   * This is to be consistent with common, C-like, row-major indexing notation
   * @example
   *  let index1 = new Index(1,2) // 3rd element of the 2nd row
   * @example
   *  let index2 = new Index(9,1) // 2nd element of the 10th row
   * @example
   *  let index3 = new Index(9,0) // 1st element of the 10th row
   * @example
   *  let index4 = new Index(9)   // 10th element of the 1st row
   * @example
   *  let index5 = new Index(0,9) // Equivalent to index4
   */
  constructor(row, col) {
    this.#onedimensional = false

    // if one argument passed treat it as col index
    if ( col === undefined) {
      col = row
      row = 0
      this.#onedimensional = true
    }

    this._argCheck(row, col)
    this.#col = col
    this.#row = row
  }
  
  /** 
   * Retrieve the x-coordinate
   * @returns {Number}
   */
  get col() { return this.#col }

  /**
   * Retrieve the y-coordinate
   * @returns {Number}
   */
  get row() { return this.#row }

  /**
   * Retrieve the row value (y-coordinate)
   * Alias for {@link CudaIndex#row}
   * @returns {Number}
   */
  get y() { return this.row }

  /**
   * Retrieve the col value (x-coordinate)
   * Alias for {@link CudaIndex#col}
   * @returns {Number}
   */
  get x() { return this.col }

  /**
   * Increase the index
   *
   * @param {Number} [row]
   * @param {Number} col
   * @returns {CudaIndex} this
   * @throws {Error} When operation results in invalid index. 
   *                 e.g a negative value for some dimension
   * @description
   *  - When two arguments are passed the first one defines the row increase and the second one the column increase
   *  - When one argument is passed it defines the column increase.
   * This is to be consistent with common, C-like, row-major indexing notation
   * @example
   * let index = new Index(1,1) // 2nd element of 2nd row
   * index.inc(1,1)             // 3nd element of 3rd row
   * index.inc(1)               // 4th element of 3rd row. equivalent to index.inc(0,1)
   * index.inc(-10)             // Error
   */
  inc(row, col) {

    if ( row === undefined)
      return this;

    if ( this.is1D() && col !== undefined) 
      throw new Error('Index in 1-Dimensional')
    
    if ( col === undefined) {
      col = row
      row = 0
    }

    this.#row += row
    if ( this.#row < 0)
      throw new Error("Invalid argument `row`. Results in negative value")
    
    this.#col += col
    if ( this.#col < 0)
      throw new Error("Invalid argument `col`. Results in negative value")

    return this
  }

  /**
   * Decrease the index
   *
   * @param {Number} [row]
   * @param {Number} col
   * @returns {CudaIndex} this
   * @throws {Error} When operation results in invalid index. 
   *                 e.g a negative value for some dimension
   * @description
   *  - When two arguments are passed the first one defines the row increase and the second one the column increase
   *  - When one argument is passed it defines the column increase.
   * This is to be consistent with common, C-like, row-major indexing notation
   * @example
   * let index = new Index(1,1) // 2nd element of 2nd row
   * index.dec(1,1)             // 1st element of 1st row
   * index.dec(0,0)             // No change
   * index.dec(10)              // Error
   * index.dec(-9)              // 10th element of first row. Equivalent to dec(0,-9)
   * index.dec(2,2)             // Error
   * index.dec(0,9)             // 1st element of 1st row. Equivalent to dec(9) 
   */
  dec(row, col) {

    if ( row === undefined)
      return this;

    if ( this.is1D() && col !== undefined) 
      throw new Error('Index in 1-Dimensional')
    
    if ( col === undefined) {
      col = row
      row = 0
    }

    this.#row -= row
    if ( this.#row < 0)
      throw new Error("Invalid argument `row`. Results in negative value")
    
    this.#col -= col
    if ( this.#col < 0)
      throw new Error("Invalid argument `col`. Results in negative value")

    return this
  }

  /**
   * Check if the index is 1D
   * @returns {Boolean}
   */
  is1D() { return this.#onedimensional }

  /**
   * Check if index is 2D
   * @returns {Boolean}
   */
  is2D() { return !this.#onedimensional }

  /**
   * Compare equality with another index
   * @param {Index} other 
   * @return {Boolean}
   */
  equals(other) {
    if ( !other || !(other instanceof CudaIndex))
      return false
    return this.x == other.x && this.y == other.y
  }

  /**
   * Creates and return a copy of the `Point` object
   * @returns {Index}
   */
  clone() {
    let copy = new Index(this.#row, this.#col)
    return copy
  }

  /**
   * Get a String representation of the index
   * @return {String}
   */
  toString() { return `[${this.y},${this.x}]` }

}

module.exports = CudaIndex