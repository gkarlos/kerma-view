
const Type = require('./Type')

/**
 * @memberof module:types
 */
class StructType extends Type {
  static DEFAULT_ALIGN = 8

  /** @type {Type[]} **/ #elementTypes
  
  /**
   * @param {Type[]} elementTypes
   */
  constructor(elementTypes, name="struct") {
    this.#elementTypes = []

    let self = this
    
    types.forEach((ty,i) => {
      if ( !(ty instanceof Type))
        throw new Error(`Invalid type @position ${i}`)
      if ( !ty.isValidStructElementType())
        throw new Error(`Invalid struct element type @position ${i}`)
      self.#types.push(ty)
    })

    super(name, this.#types.reduce((accu, ty) => accu + ty.getBitWidth()))
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

  /**
   * @param {Boolean} short 
   */
  toString(short=false) {
    let res = "{ "
    this.#elementTypes.forEach((ty,i) => {
      res += ty.toString(short)
      if ( i < res.length - 1)
        res += ", "
    })
    return res + "}"
  }
}

module.exports = StructType