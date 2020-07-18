/** @ignore @typedef {import("@renderer/models/Dim")} Dim */
/** @ignore @typedef {import("@renderer/models/Index")} Index */


/**
 * Represents a 2D index. Can be used as a thread/block index
 * or index into an array. **Row-major** order is assumed
 * 
 * @category Renderer
 * @subcategory models
 */
class Index {
  /** @type {Number} */
  #col
  /** @type {Number} */
  #row
  /** @type {Boolean} */
  #onedimensional


  /**
   * Transform 2D index to 1D index
   * @param   {Index} index A 2D index
   * @param   {Dim} dim A cuda dim description
   * @throws  {Error} If args are invalid. **Only 2D Dims are supported**
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

    return index.x + index.y * dim.x
  }


  /**
   * Transform a 1-dimensional index to a 2-dimensional index
   * @param   {Number|Index} index A 1-Dimensional index. If a Index is passed and the y-dimension > 1 then it is returned as is.
   * @param   {Dim} dim A cuda dim description
   * @throws  {Error} If args are invalid. **Only 2D Dims are supported**
   * @returns {Index} 
   */
  static delinearize(index, dim) {
    if ( index === undefined) throw new Error('Missing required argument `index`')
    if ( dim === undefined)  throw new Error('Missing required argument `dim`')
    if ( dim.is3D()) throw new Error('Invalid dim. 3 dimensions are not supported')

    let row, col
    if ( Number.isInteger(index)) {
      if ( index < 0)
        throw new Error('Index must be >= 0')
      if ( dim.y === 1)
        return new Index(index)
      row = Math.floor(index / dim.x)
      col = index % dim.x
    } else {
      if ( !(index instanceof Index)) throw new Error('Argument `index` must be an Integer or a Index')
      // if ( index.col >= dim.x || index.row >= dim.y) throw new Error(`Argument missmatch. Index ${index.toString()} not valid for dims ${dim.toString()}`)
      if ( index.row > 0) //2D index already
        return index
      row = Math.floor(index.col / dim.x)
      col = index.col % dim.x
    }

    if ( row >= dim.y || col >= dim.x)
      throw new Error(`Argument missmatch. Index ${index.toString()} not valid for dims ${dim.toString()}`)

    return new Index(row, col)
  }


  /** @protected */
  _argCheck(row,col) {
    if ( row && (!Number.isInteger(row) || row < 0))
      throw new Error('Invalid index `row`: must be integer > 0')
    if ( col && (!Number.isInteger(col) || col < 0))
      throw new Error('Invalid index `col`: must be integer > 0')
  }


  /**
   * Creates a new `Index` object
   *
   * @param {Number} [row] Value for the row, (y) dimension.
   * @param {Number} col Value for the col (x) dimension.
   * @description
   *  - When two arguments are passed the first one defines the row (y) and the second one the column (x).
   *  - When one argument is passed it defines the column (x).
   * This is to be consistent with common, C-like, **row-major indexing notation**
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

    if ( row === "unknown") {
      /// FOR INTERNAL USE ONLY
      this.#col = -1
      this.#row = -1

    } else {  

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
   * Alias for {@link Index#row}
   * @returns {Number}
   */
  get y() { return this.row }


  /**
   * Retrieve the col value (x-coordinate)
   * Alias for {@link Index#col}
   * @returns {Number}
   */
  get x() { return this.col }


  /**
   * Increase the index. No-op if no arguments passed
   *
   * @param   {Number} [row]
   * @param   {Number} col
   * @returns {Index} this
   * @throws  {Error} Operation results in invalid index. e.g a negative value for some dimension
   * @description
   *  - When two arguments are passed the first one defines the row (y) increase and the second one the column (x) increase
   *  - When one argument is passed it defines the column (x) increase.
   * This is to be consistent with common, C-like, **row-major indexing notation**
   * @example
   * let index = new Index(1,1) // 2nd element of 2nd row
   * index.inc(1,1)                 // 3nd element of 3rd row
   * index.inc(1)                   // 4th element of 3rd row. equivalent to index.inc(0,1)
   * index.inc(-10)                 // Error
   */
  inc(row, col) {
    if ( row === undefined)
      return this;

    if ( this.is1D() && col !== undefined) 
      throw new Error('Cannot inc row of 1-Dimensional index')
    
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
   * Decrease the index. No-op if no arguments passed
   *
   * @param   {Number} [row]
   * @param   {Number} col
   * @returns {Index} this
   * @throws  {Error} Operation results in invalid index. e.g a negative value for some dimension
   * @description
   *  - When two arguments are passed the first one defines the row (y) decrease and the second one the column (x) decrease
   *  - When one argument is passed it defines the column (x) decrease.
   * This is to be consistent with common, C-like, **row-major indexing notation**
   * @example
   * let index = new Index(1,1) // 2nd element of 2nd row
   * index.dec(1,1)                 // 1st element of 1st row
   * index.dec(0,0)                 // No change
   * index.dec(10)                  // Error
   * index.dec(-9)                  // 10th element of first row. Equivalent to dec(0,-9)
   * index.dec(2,2)                 // Error
   * index.dec(0,9)                 // 1st element of 1st row. Equivalent to dec(9) 
   */
  dec(row, col) {
    if ( row === undefined)
      return this;

    if ( this.is1D() && col !== undefined) 
      throw new Error('Cannot dec row of 1-Dimensional index')
    
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
   * Linearize the index
   * @param {Dim}
   * @returns {Number}
   */
  linearize(dim) { return Index.linearize(this, dim) }


  /**
   * Delinearize the index. Identity function if the index is already 2D or 3D
   * @param {Dim} other
   * @returns {Index}
   */
  delinearize(dim) {
    if ( this.is2D() || this.is3D())
      return this
    return Index.delinearize(this, dim)
  }


  /**
   * Compare equality with another index
   * @param {Index} other 
   * @return {Boolean}
   */
  equals(other) {
    return (other instanceof Index)
      && this.x == other.x && this.y == other.y
  }


  /**
   * Create a copy of the index
   * @returns {Index}
   */
  clone() {
    return new Index(this.#row, this.#col)
  }


  /**
   * Get a String representation of the index
   * @return {String}
   */
  toString(includeLinear=false) { 
    return (this.x === -1 || this.y === -1)? "unknown" : `(${this.y},${this.x})` 
  }

}

/**
 * Represents an unknown index. Allows queries that want to return an
 * unknown index to return this instead of null. To check if an index x
 * is unknown simply to `x.equals(Index.Unknown)`
 * @type {Index}
 */
Index.Unknown = new Index("unknown")

module.exports = Index