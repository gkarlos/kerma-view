const Type = require('@renderer/models/types/Type')

/**
 * @memberof module:types
 */
class IntType extends Type {
  /** @type {Boolean} */ #sign

  /**
   * Create a new IntType instance
   * @param {Number} bits 
   * @param {Boolean} sign 
   */
  constructor(bits=32, sign=false) {
    super("int", bits)
    this.#sign = sign || false
  }

  /** @type {Boolean} */
  get sign() { return this.#sign}

  /** @returns {Boolean} */
  isSigned() { return this.#sign }

  /** @returns {Boolean} */
  isUnsigned() { return !this.#sign }

  /** @returns {Boolean} */
  isIntType() { return true; }

  /** @returns {String} */
  toString() {
    return (this.isUnsigned()? "." : "") + "i" + this.bits.toString()
  } 

  /** @returns {Boolean} */
  equals(other) {
    return (other instanceof IntType)
      && super.equals(other)
      && this.#sign === other.sign
  }
  
  /**
   * Create a new IntType instance
   * @param {Number} bits 
   * @param {Boolean} sign
   * @returns {IntType}
   */
  static get(bits=32, sign=false) {
    return new IntType(bits, sign)
  }

  /**
   * Turn a Type reference to an IntType reference
   * @param {Type} type
   * @returns {IntType|null} 
   */
  static cast(type) {
    if ( type.isIntType())
      return new IntType(type.bits, type.sign)
    return null
  }
}

module.exports = IntType