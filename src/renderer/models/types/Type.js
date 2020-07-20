/**
 * Base class for all types
 * Usually this class should not be used directly to create types
 * Most common types can be retrieve through {@link module:types.Types}
 * @memberof module:types
 */
class Type {
  /** @type {String}   */ #name
  /** @type {Number}   */ #bits
  /** @type {String[]} */ #aliases

  /**
   * @param {String} name 
   * @param {Number} bits
   * @param {Number} align
   */
  constructor(name, bits) {
    this.#name  = name
    this.#bits  = bits
    this.#aliases = []
  }

  /** @type {String}    */
  get name() { return this.#name }

  /** @type {Number}    */
  get bits() { return this.#bits }

  /** @returns {String} */
  getName() { return this.#name }

  /** @returns {Number} */
  getBitWidth() { return this.#bits }

  /** @returns {Number} */
  getByteWidth() { return Math.ceil(this.#bits / 8) }

  /** @returns {Number} */
  getRequiredBits() { return this.getByteWidth() * 8 }

  /** @returns {Number} */
  getRequiredBytes() { return this.getByteWidth() }

  /** @returns {Number} */
  getNesting() { return 0; }

  /** @returns {String[]} */
  getAliases() { return this.#aliases }

  /** @returns {Number} */
  isNested() { return this.getNesting() > 0 }

  /** 
   * @param {String} alias
   * @returns {Type}
   */
  addAlias(alias) {
    this.#aliases.push(alias)
    return this
  }

  /**
   * @param {String} alias 
   * @returns {Boolean}
   */
  hasAlias(alias) {
    return this.#aliases.find(al => al === alias)? true : false
  } 

  /**
   * @returns {Booleean}
   */
  hasAliases() {
    return this.#aliases.length > 0
  }

  /** @returns {Boolean} */
  isArrayType() { return false; }

  /** @returns {Boolean} */
  isPtrType() { return false; }

  /** @returns {Boolean} */
  isStructType() { return false; }

  /** @returns {Boolean} */
  isIntType() { return false; }

  /** @returns {Boolean} */
  isFloatType() { return false; }

  /** @returns {Boolean} */
  isBasicType() { return this.isIntType() || this.isFloatType() }

  /** @returns {Boolean} */
  isAggregateType() { return this.isArrayType() || this.isStructType() }

  /** 
   * @abstract
   * @returns {Boolean} 
   */
  isValidArrayElementType() {
    return true
  }

  /**
   * @abstract 
   * @returns {Boolean}
   */
  isValidStructElementType() {
    return true  
  }

  /** @returns {String} */
  toString() {
    return this.name + this.#bits.toString()
  } 

  /** @returns {Boolean} */
  equals(other) {
    return (other instanceof Type)
      && this.#name === other.name
      && this.#bits === other.getBitWidth()
  }

  /**
   * @param {String} name 
   * @param {Number} bits
   * @param {Number} align
   * @returns {Type}
   */
  static get(name, bits) {
    return new Type(name, bits)
  }
}

module.exports = Type

