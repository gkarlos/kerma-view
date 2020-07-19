const Type = require('./Type')

/**
 * @memberof module:types
 */
class PtrType extends Type {
  
  /** @type {Type}         */ #pointeeTy
  /** @type {AddressSpace} */ #addrSpace

  /**
   * @param {Type}         pointeeTy
   * @param {AddressSpace} addrSpace
   * @param {Number}       [bits=64]
   */
  constructor(pointeeTy, addrSpace, bits=64) {
    this.#pointeeTy = pointeeTy
    this.#addrSpace = addrSpace
    super("pointer", bits)
  }

  /**
   * @param {Type}
   */
  getPointeeType() {
    return this.#pointeeTy
  }

  /** 
   * @abstract
   * @returns {Boolean} 
   */
  isValidArrayElementType() {
    return true
  }

  /**
   * @returns {Boolean}
   */
  equals(other) {
    return (other instanceof PtrType)
      && super.equals(other)
      && this.getPointeeType().equals(other.getPointeeType())
  } 
}

module.exports = PtrType