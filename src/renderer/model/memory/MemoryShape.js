
const {InternalError} = require("util/error")

function __validateShape(x,y,z) {
  if ( x <= 0 || y <= 0 || z <= 0)
    throw new InternalError(`Invalid shape [${x},${y},${z}]`)
}

function __countDimensions(x, y, z) {
  return 1 + (y > 1) + (z > 1)
}

/**
 * Models the shape of a memory area
 *
 * @memberof module:model/memory
 */
class MemoryShape {
  //
  // Static members
  //
  static countDimensions(shape) {
    return __countDimensions(shape.x, shape.y, shape.z)
  }

  /**
   * 
   * @param {*} x The size of the x dimension
   * @param {*} y The size of the y dimension
   * @param {*} z The size of the z dimension
   * @throws {InternalError} Size of x, y, or z dimension is invalid
   */
  constructor(x=1, y=1, z=1) {
    __validateShape(x, y, z)
    this.x = x
    this.y = y
    this.z = z
  }

  //
  // Instance members
  //

  /** Get the size of the x dimension */
  getX() { return this.x }
  /** Get the size of the y dimension */
  getY() { return this.y }
  /** Get the size of the z dimension */
  getZ() { return this.z }
  /** Set the size of the x dimension */
  setX(value) { 
    if ( !value || value === 0) throw new InternalError(`Invalid x value '${value}'`)
    this.x = value;
  }

  setY(value) {
    if ( !value || value === 0) throw new InternalError(`Invalid y value '${value}'`)
    this.y = value
  }

  setZ(value) {
    if ( !value || value === 0) throw new InternalError(`Invalid z value '${value}'`)
    this.z = value
  }

  /**
   * Get the number of dimensions of this shape
   */
  getDims() {
    return MemoryShape.countDimensions(this)
  }
}

module.exports = MemoryShape
