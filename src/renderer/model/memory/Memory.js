const MemoryShape = require('./MemoryShape')
const {InternalError} = require('util/error')
const {isString} = require('util/traits')

var crypto = null;
/**
 * Models arbitrary memory
 * 
 * @memberof module:model/memory
 *
 */
class Memory {
  //TODO For now this class does not store memory contents

  /**
   * Create a random Memory
   */
  static createRandom() {
    if ( !crypto)
      crypto = require('crypto')
    
    let name = `vec${crypto.randomBytes(8).toString('hex')}`
    let type =  "int"
    let shape = MemoryShape.createRandom()
    return new Memory(name, type, shape)
  }

  /**
   * @param {String} name
   * @param {Integer} type
   * @param {MemoryShape} shape
   * @param {Object} props
   */
  constructor(name, type, shape, props) {
    if ( !name || !isString(name) || name.length < 1)
      throw new InternalError("Memory.constructor(): invalid or missing argument 'name'")
    if ( !shape || !(shape instanceof MemoryShape))
      throw new InternalError("Memory.constructor(): invalid of missing argument 'shape' ")
    this.name = name;
    this.type = type;
    this.shape = shape;
    if ( props)
      Object.assign(this, props)
  }

  /** @returns {String} the name of this memory */
  getName() { return this.name }

  /** @returns {String} the type of this memory */
  getType() { return this.type }
  
  /** @returns {Shape} the shape of this memory */
  getShape() { return this.shape }


  //
  // Computed properties
  //

  /** Size of the x dimension */
  get x() { return this.shape.getX() }
  /** Size of the y dimension */
  get y() { return this.shape.getY() }
  /** Size of the z dimension */
  get z() { return this.shape.getZ() }


  //
  // Instance methods
  //

  /** Retrieve the size of the x dimension */
  getX() { return this.shape.getX() }
  /** Retrieve the size of the y dimension */
  getY() { return this.shape.getY() }
  /** Retrieve the size of the z dimension */
  getZ() { return this.shape.getZ() }

  /** Set the size of the x dimension */
  setX(v) { this.shape.setX(v) }
  /** Set the size of the y dimension */
  setY(v) { this.shape.setY(v) }
  /** Set the size of the z dimension */
  setZ(v) { this.shape.setZ(v) }

  /** @returns {Number} The number of dimensions 
   */
  getDims() {
    return this.shape.getDims()
  }

  /** @return {boolean} whether the object represents an array 
   */
  isArray() {
    return this.shape.getX() > 1 || this.shape.getY() > 1 || this.shape.getZ() > 1
  }

  /**
   * This is just an alias for **isArray**
   * @return {boolean} whether the object represents a vector
   */
  isVector() {
    return this.isArray()
  }

  /** @return {boolean} whether the object represents scalar 
   */
  isScalar() {
    return !this.isArray()
  }

  /** @return {boolean} whether the object represents an array of more than 1 dimensions 
   */
  isMultiDimensionalArray() {
    return this.isArray() && this.getDims() > 1
  }
}

module.exports = Memory