const Type = require('./Type')

/**@ignore @typedef {import("@renderer/models/Dim")} Dim */

/**
 * @memberof module:types
 */
class ArrayType extends Type {
  
  /** @type {Type} */ #elementType
  /** @type {Dim}  */ #dim

  /**
   * @param {Type} elementType 
   * @param {Dim|Number}  dim 
   */
  constructor(elementType, dim) {
    if ( !elementType.isValidArrayElementType())
      throw new Error("Invalid array element type")
    this.#elementType = type
    this.#dim  = Number.isInteger(dim) ? new Dim(dim) : dim
    super("array", this.#dim.size, elementType.getAlignment())
  }

  /**
   * @returns {Type}
   */
  getElementType() {
    return this.#elementType
  }

  /**
   * @returns {Dim}
   */
  getDim() {
    return this.#dim
  }

  /**
   * @returns {Boolean}
   */
  isValidArrayElementType() { return false }

  /**
   * @returns {Boolean}
   */
  isValidStructElementType() { return true }

  /**
   * @returns {String}
   */
  toString(short=false) {
    if ( this.#dim.is1D()) {
      return `[${this.#dim.x} x ${this.#elementType.toString(short)}]`
    } else if ( this.#dim.is2D()) {
      return `[${this.#dim.x} x [ ${this.#dim.y} x ${this.#elementType.toString(short)}]]`
    } else {
      return `[${this.#dim.x} x [ ${this.#dim.y} x [ ${this.#dim.z} x ${this.#elementType.toString(short)}]]]`
    }
  }

  /**
   * @param {ArrayType}
   * @returns {Boolean}
   */
  equals(other) {
    return ( other instanceof ArrayType )
      && this.#elementType.equals(other.getElementType())
      && this.#dim.equals(other.getDim())
  }

  /**
   * @param {Type} elementType 
   * @param {Dim|Number}  dim 
   */
  static get(elementType, dim) {
    return new ArrayType(elementType, dim)
  }
}

module.exports = ArrayType