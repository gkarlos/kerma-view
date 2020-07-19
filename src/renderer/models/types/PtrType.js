const Type = require('./Type')
const AddressSpace = require('@renderer/models/memory/AddressSpace')

/**
 * @memberof module:types
 * @extends {Type}
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
    if ( !pointeeTy)
      throw new Error("Missing required argument 'pointeeTy'")
    if ( !(pointeeTy instanceof Type))
      throw new Error("pointeeTy must be an instance of Type")
    if ( addrSpace === undefined || addrSpace === null)
      throw new Error("Missing required argument 'addrSpace'")
    if ( !(addrSpace instanceof AddressSpace))
      throw new Error("addrSpace must be an instance of AddressSpace")
    if ( bits !== 32 && bits !== 64)
      throw new Error("Pointers can only be 32 or 64 bits")
    super("pointer", bits)
    this.#pointeeTy = pointeeTy
    this.#addrSpace = addrSpace
  }

  /**
   * @param {Type}
   */
  getPointeeType() {
    return this.#pointeeTy
  }

  /**
   * @returns {AddressSpace}
   */
  getAddressSpace() {
    return this.#addrSpace
  }

  /** @returns {Boolean} */
  isArrayType() { return false; }

  /** @returns {Boolean} */
  isPtrType() { return true; }

  /** @returns {Boolean} */
  isStructType() { return false; }

  /** @returns {Boolean} */
  isBasicType() { return false; }

  /** @returns {Boolean} */
  isPtrToBasicType() {
    return !this.#pointeeTy.isAggregateType()
  }

  /** @return {Boolean} */
  isPtrToAggregateType() {
    return this.#pointeeTy.isAggregateType()
  }

  /** @returns {Number} */
  getNesting() {
    return 1 + this.#pointeeTy.getNesting()
  }

  /**
   * @returns {Boolean}
   */
  equals(other) {
    return (other instanceof PtrType)
      && super.equals(other)
      && this.getPointeeType().equals(other.getPointeeType())
      && this.#addrSpace.equals(other.getAddressSpace())
  } 

  /** 
   * @returns {String}
   */
  toString() {
    return this.#pointeeTy.toString() + "*"
  }

  /**
   * @param {Type}         pointeeTy
   * @param {AddressSpace} addrSpace
   * @param {Number}       [bits=64]
   * @returns {PtrType}
   */
  static get(pointeeTy, addrSpace, bits=64) {
    return new PtrType(pointeeTy, addrSpace, bits)
  }
}

module.exports = PtrType