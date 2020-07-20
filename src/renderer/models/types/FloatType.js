const Type = require('@renderer/models/types/Type')

/**
 * @memberof module:types
 */
class FloatType extends Type {
  /**
   * Create a new IntType instance
   * @param {Number} bits  
   */
  constructor(bits=32) {
    if ( bits !== 32 && bits !== 64)
      throw new Error("Only 32/64-bit floats are supported")
    super( bits === 32? "float" : "double", bits)
  }

  /** @type {Boolean} */
  get sign() { return true}

  /** @returns {Boolean} */
  isSigned() { true }

  /** @returns {Boolean} */
  isUnsigned() { return false }

  /** @returns {Boolean} */
  isFloatType() { return true; }
  
  /** @returns {String} */
  toString() {
    return "f" + this.bits.toString()
  } 

  /** @returns {Boolean} */
  equals(other) {
    return (other instanceof FloatType)
      && super.equals(other)
  }
  
  /**
   * Create a new IntType instance
   * @param {Number} bits 
   * @param {Boolean} sign
   * @returns {FloatType}
   */
  static get(bits=32) {
    return new FloatType(bits, sign)
  }

  /**
   * Turn a Type reference to an FloatType reference
   * @param {Type} type
   * @returns {FloatType|null} 
   */
  static cast(type) {
    if ( type.isFloatType()) {
      let ty = new FloatType(type.bits)
      if ( type.hasAliases())
        type.getAliases().forEach(alias => ty.addAlias(alias))
      return ty
    }
    return null
  }
}

module.exports = FloatType