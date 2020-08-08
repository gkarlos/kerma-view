const Type = require('./Type')
const Dim  = require('@renderer/models/Dim')

/**
 * @memberof module:types
 * @extends {Type}
 */
class ArrayType extends Type {
  
  /** @type {Type} */ #elementType
  /** @type {Dim}  */ #dim

  /**
   * @param {Type} elementType 
   * @param {Dim|Number}  dim 
   */
  constructor(elementType, dim) {
    if ( !elementType)
      throw new Error("Missing required argument elementType")
    if ( dim === undefined || dim === null)
      throw new Error("Missing required argument dim")
    if ( !elementType.isValidArrayElementType())
      throw new Error("Invalid array element type")
    
    let tmpDim = Number.isInteger(dim) ? new Dim(dim) : dim
    super("array", tmpDim.size * elementType.bits)
    this.#elementType = elementType
    this.#dim = tmpDim
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
   * @returns {Number}
   */
  getNesting() {
    return 1 + this.#elementType.getNesting()
  }

  /** @returns {Boolean} */
  isArrayType() { return true; }
  
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
  toString() {
    if ( this.#dim.is1D()) {
      return `[${this.#dim.x} x ${this.#elementType.toString()}]`
    } else if ( this.#dim.is2D()) {
      return `[${this.#dim.x} x [${this.#dim.y} x ${this.#elementType.toString()}]]`
    } else {
      return `[${this.#dim.x} x [${this.#dim.y} x [${this.#dim.z} x ${this.#elementType.toString()}]]]`
    }
  }

  /** 
   * @param {Boolean} [includeAliases=false]
   * @returns {String} 
   */
  pp(includeAliases=false,indent="") {
    let res = `[${this.#elementType.pp()}]:${this.getRequiredBytes()}`
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