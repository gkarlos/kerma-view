/**
 * Represents a 2D index value. Can be used index a thread or
 * index into an array. **Row-major** order is assumed
 * 
 * @category models
 * @subcategory util
 */
class Index {

  #x
  #y

  /**
   * Transform 2D index to 1D index
   * @param {Index} index An index
   * @param {Number} [rows]  Size of the x dimension 
   * @param {Number} cols Size of the y dimension
   * @returns {Number} 
   */
  static linearize(index, rows, cols) {
    if ( index === undefined) throw new Error('Missing required argument `index`')
    if ( rows === undefined)  throw new Error('At least one argument after `index` is required')
    
    if ( cols === undefined) {
      cols = rows
      rows = 1
    }

    if ( rows < 1) throw new Error('Invalid rows size. Must be > 0')
    if ( cols < 1) throw new Error('Invalid cols size. Must be > 0')

    if ( index.x >= cols || index.y >= rows)
      throw new Error(`Invalid index '${index.toString()}' for dimensions [${rows},${cols}]`)

    if ( rows == 1) //1D
      return index.x

    return (index.y * cols) + index.x
  }

  /**
   * Transform an 1-dimensional index to a 3-dimensional index
   * @param {Integer} index A 1-Dimensional index 
   * @param {Integer} xDim Size of the x dimension 
   * @param {Integer} [yDim] Size of the y dimension
   * @param {Integer} [zDim] Size of the z dimension
   * @returns {Index} 
   */
  static delinearize(index, xDim, yDim = 1) {

  }

  /** @protected */
  _argCheck(row,col) {
    if ( row && (!Number.isInteger(row) || row < 0))
      throw new Error('Invalid argument `row`: must be integer > 0')
    if ( col && (!Number.isInteger(col) || col < 0))
      throw new Error('Invalid argument `col`: must be integer > 0')
  }

  /**
   * Creates a new `Index` object
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
    // if one argument passed treat it as col index
    if ( col === undefined) {
      col = row
      row = 0
    }
    this._argCheck(row, col)
    this.#x = col
    this.#y = row
  }
  
  /** 
   * Retrieve the x-coordinate
   * @returns {Integer}
   */
  get x() { return this.#x }

  /**
   * Retrieve the y-coordinate
   * @returns {Integer}
   */
  get y() { return this.#y }

  /**
   * Retrieve the row value
   * Alias for {@link Index#y}
   */
  get row() { return this.y }

  /**
   * Retrieve the col value
   * Alias for {@link Index#x}
   */
  get col() { return this.x }

  /**
   * Increase the index
   *
   * @param {Number} [row]
   * @param {Number} col
   * @returns {Index} this
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

    if ( col === undefined) {
      col = row
      row = 0
    }

    this.#y += row
    if ( this.#y < 0)
      throw new Error("Invalid argument `row`. Results in negative value")
    
    this.#x += col
    if ( this.#x < 0)
      throw new Error("Invalid argument `col`. Results in negative value")

    return this
  }

  /**
   * Decrease the index
   *
   * @param {Number} [row]
   * @param {Number} col
   * @returns {Index} this
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

    if ( col === undefined) {
      col = row
      row = 0
    }

    this.#y -= row
    if ( this.#y < 0)
      throw new Error("Invalid argument `row`. Results in negative value")
    
    this.#x -= col
    if ( this.#x < 0)
      throw new Error("Invalid argument `col`. Results in negative value")

    return this
  }
  /**
   * Compare equality with another index
   * @param {Index} other 
   * @return {Boolean}
   */
  equals(other) {
    if ( !other || !(other instanceof Index))
      return false
    return this.x == other.x && this.y == other.y
  }

  /**
   * Creates and return a copy of the `Point` object
   * @returns {Index}
   */
  clone() {
    let copy = new Index(this.#y, this.#x)
    return copy
  }

  /**
   * Get a String representation of the index
   * @return {String}
   */
  toString() { return `[${this.y},${this.x}]` }

}

module.exports = Index