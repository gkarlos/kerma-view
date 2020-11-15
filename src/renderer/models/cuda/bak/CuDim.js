const Dim = require('@renderer/models/Dim')

/**
 * This class is used to describe dimensions of various Cuda objects.
 * For instance CudaGrid, CudaBlock of even Arrays.
 * 
 * @memberof module:cuda
 * @extends {Dim}
 */
class CuDim extends Dim {
  /**
   * Create a new CuDim instance
   * @param {Number} x Size of the x-dimension (Number of columns)
   * @param {Number} [y] Size of the y-dimension (Number of rows)
   * @param {Number} [z] Size of the z-dimension (Number of layers)
   */
  constructor(x, y=1, z=1) {
    try {
      super(x,y,z)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * Factory method to create a new CuDim instance
   * @param {Number} x Size of the x-dimension (Number of columns)
   * @param {Number} [y] Size of the y-dimension (Number of rows)
   * @param {Number} [z] Size of the z-dimension (Number of layers)
   */
  static of(x, y=1, z=1) {
    return new CuDim(x,y,z)
  }
}

module.exports = CuDim