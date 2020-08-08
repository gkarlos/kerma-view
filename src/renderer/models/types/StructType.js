
const Type = require('@renderer/models/types/Type')

/**
 * @memberof module:types
 * @extends {Type}
 */
class StructType extends Type {
  /** @type {Type[]} **/ #elementTypes
  
  /**
   * @param {Type[]} elementTypes
   */
  constructor(elementTypes=[], name) {

    let selfElemTypes = []
    
    elementTypes.forEach((ty,i) => {
      if ( !(ty instanceof Type))
        throw new Error(`Invalid type @position ${i}`)
      if ( !ty.isValidStructElementType())
        throw new Error(`Invalid struct element type @position ${i}`)
      selfElemTypes.push(ty)
    })

    super(`struct${name? " " + name : ""}`, selfElemTypes.reduce((accu, ty) => accu + ty.getBitWidth(), 0))
    this.#elementTypes = selfElemTypes
  }

  /** @returns {Boolean} */
  isAnonymous() {
    return this.name === 'struct';
  }

  /** @returns {Boolean} */
  isNamed() {
    return !this.isAnonymous()
  }

  /** @returns {Type[]} */
  getElementTypes() {
    return this.#elementTypes
  }

  /**
   * @param {Type} type 
   * @returns {Boolean}
   */
  hasElementType(type) {
    if ( !type.isValidStructElementType())
      return false
    return this.#elementTypes.find(ty => ty.equals(type))? true : false
  }

  /**
   * @returns {Number}
   */
  getNumElements() {
    return this.#elementTypes.length
  }

  /**
   * @returns {Number}
   */
  getNesting() {
    return 1 + (this.#elementTypes.length > 0? Math.max(...this.#elementTypes.map(ty => ty.getNesting())) : 0)
  }

  /** @type {Boolean} */
  isArrayType() { return false; }

  /** @type {Boolean} */
  isPtrType() { return false; }

  /** @type {Boolean} */
  isStructType() { return true; }

  /** @type {Boolean} */
  isBasicType() { return false; }

  /**
   * @returns {String} 
   */
  toString() {
    let res = "{"
    let self = this
    this.#elementTypes.forEach((ty,i) => {
      res += ` ${ty.toString()}`
      if ( i < self.#elementTypes.length - 1)
        res += ","
    })
    return res + " }"
  }

  /** 
   * @param {Boolean} [includeAliases=false]
   * @returns {String} 
   */
  pp(includeAliases=false,indent="") {
    let res = `${indent}${this.name} {\n`
    this.#elementTypes.forEach((ty, i) => {
      res += `${ty.pp(includeAliases, (indent + "  "))}${i < this.#elementTypes.length - 1? "," : ""}\n`
    })
    res += `${indent}}:${this.getRequiredBytes()}`
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
   * @param {StructType} other
   * @returns {Boolen}
   */
  equals(other) {
    if ( !(other instanceof StructType))
      return false
    
    if ( this.getNumElements() !== other.getNumElements())
      return false

    if ( this.getName() !== other.getName())
      return false

    if ( this.getBitWidth() != other.getBitWidth())
      return false
    
    for ( let i = 0; i < this.#elementTypes.length; ++i )
      if ( !this.#elementTypes[i].equals(other.getElementTypes()[i]))
        return false
    
    return true
  }

  /**
   * @param {Type[]} elementTypes
   * @returns {StructType}
   */
  static get(elementTypes=[], name="struct") {
    return new StructType(elementTypes, name)
  }
}

module.exports = StructType