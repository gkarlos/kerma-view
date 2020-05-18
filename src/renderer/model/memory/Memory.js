const {InternalError} = require("util/error")

/**
 * @memberof module:model/memory
 */
class Memory {
  /**
   * 
   * @param {Object} opts
   * @param {String} opts.name
   * @param {Array} [opts.shape]
   */
  constructor(name, shape, props) {
    if ( !name)
      throw new InternalError("Memory.constructor() missing required argument `name`")
    
  } 

  static countDimensions(shape) {
    return 1 + (shape[1] > 1) + (shape[2] > 1)
  }

  static validShape(shape) {
    if ( !shape || shape.length == 0 || shape.length > 3)
      return false
    if ( shape.length > 1 && shape[1] == 0)
      return false
    if ( shape.length > 2 && shape[2] == 0)
      return false
    return true
  }
}

module.exports = Memory