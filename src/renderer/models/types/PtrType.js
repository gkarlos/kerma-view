const Type = require('./Type')
const AddressSpace = require('@renderer/models/memory/AddressSpace')

/**
 * @memberof module:types
 * @extends {Type}
 */
class PtrType extends Type {

  /** */ static DefaultWidth = 64
  
  /** @type {Type}         */ #pointeeTy
  /** @type {AddressSpace} */ #addrSpace

  /**
   * @param {Type}         pointeeTy
   * @param {AddressSpace} addrSpace
   * @param {Number}       [bits=64]
   */
  constructor(pointeeTy, bits=PtrType.DefaultWidth) {
    if ( !pointeeTy)
      throw new Error("Missing required argument 'pointeeTy'")
    if ( !(pointeeTy instanceof Type))
      throw new Error("pointeeTy must be an instance of Type")
    if ( bits !== 32 && bits !== 64)
      throw new Error("Pointers can only be 32 or 64 bits")
    super("pointer", bits)
    this.#pointeeTy = pointeeTy
  }

  /**
   * @param {Type}
   */
  getPointeeType() {
    return this.#pointeeTy
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
  } 

  /** 
   * @returns {String}
   */
  toString() {
    return this.#pointeeTy.toString() + "*"
  }

  /** 
   * @param {Boolean} [includeAliases=false]
   * @returns {String} 
   */
  pp(includeAliases=false, indent="") {
    let res = `${indent}${this.getPointeeType().pp(includeAliases)} *:${this.getRequiredBytes()}`
    if ( includeAliases && this.hasAliases()) {
      res += " ("
      this.getAliases().forEach((alias, i) => {
        res += alias
        if ( i < this.getAliases().length - 1)
          res += ","
      });
      res += ")"
    }
    return res
  }

  /**
   * @param {Type}         pointeeTy
   * @param {Number}       [bits=64]
   * @returns {PtrType}
   */
  static get(pointeeTy, bits=64) {
    return new PtrType(pointeeTy, bits)
  }
}

module.exports = PtrType