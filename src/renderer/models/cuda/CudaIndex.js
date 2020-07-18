const Index = require('@renderer/models/Index')

/** @ignore @typedef import("@renderer/models/Dim") Dim */
/** @ignore @typedef import("@renderer/models/cuda/CudaDim") Dim */
/** @ignore @typedef import("@renderer/models/cuda/CudaIndex") CudaIndex */
/**
 * Represents a 2D index value. Can be used index a thread or
 * index into an array. **Row-major** order is assumed
 * 
 * @category Renderer
 * @subcategory models
 */
class CudaIndex extends Index {
  /**
   * Creates a new `CudaIndex` object
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
    try {
      super(row, col)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * Transform 2D index to 1D index
   * @param   {Index|CudaIndex} index A 2D index
   * @param   {Dim|CudaDim} dim A cuda dim description
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
   * @param   {Number|Index|CudaIndex} index A 1-Dimensional index. If a Index is passed and the y-dimension > 1 then it is returned as is.
   * @param   {Dim|CudaDim} dim A cuda dim description
   * @throws  {Error} If args are invalid. **Only 2D Dims are supported**
   * @returns {CudaIndex} 
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

    return new CudaIndex(row, col)
  }
}

CudaIndex.Unknown = new CudaIndex('unknown')

module.exports = CudaIndex