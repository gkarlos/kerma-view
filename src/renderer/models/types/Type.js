/**
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

  /** 
   * @param {String} alias
   * @returns {Type}
   */
  addAlias(alias) {
    this.#aliases.push(alias)
    return this
  }

  /** @returns {Boolean} */
  isArrayType() { return false; }

  /** @returns {Boolean} */
  isPtrType() { return false; }

  /** @returns {Boolean} */
  isStructType() { return false; }

  /** @returns {Boolean} */
  isBasicType() { return true; }

  /**
   * @param {String} alias 
   * @returns {Boolean}
   */
  hasAlias(alias) {
    return this.#aliases.find(al => al === alias)? true : false
  } 

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
    let res;
    
    if ( this.#name === "int")
      res = "i"
    else if ( this.#name === "float")
      res = "f"
    else {
      res = this.#name
    }

    return res + this.#bits.toString()
  } 

  /** @returns {Boolean} */
  equals(other) {
    return (other instanceof Type)
      && this.#name === other.name
      && this.#bits === other.getBitWidth()
  }
}

/** @type {Type} */
Type.Int8    = new Type("int", 8)

/** @type {Type} */
Type.Int16   = new Type("int", 16)

/** @type {Type} */
Type.Int32   = new Type("int", 32)

/** @type {Type} */
Type.Int64   = new Type("int", 64)

/** @type {Type} */
Type.Float32 = new Type("float", 32)

/** @type {Type} */
Type.Float64 = new Type("float", 64)

/** @type {Type} */
Type.Boolean = new Type("int", 8).addAlias("bool").addAlias("boolean")

/** @type {Type} */
Type.Float = Type.Float32

/** @type {Type} */
Type.Double = Type.Float64

module.exports = Type

