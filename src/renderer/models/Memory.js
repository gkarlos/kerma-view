/**@ignore @typedef {import("@renderer/models/source/MemorySrc")} MemorySrc */
/**@ignore @typedef {import("@renderer/models/Dim")} Dim    */
/**@ignore @typedef {import("@renderer/models/types/Type")} */

// const MemorySrc    = require("@renderer/models/source/MemorySrc")
const AddressSpace = require("@renderer/models/memory/AddressSpace")
const Type         = require("@renderer/models/types/Type")
const SrcLoc = require("./source/SrcLoc")


/**
 * Models arbitrary memory memory range at some address space
 * It can be used to represented both stack alocated memory, e.g `x, myArray` in:
 * ```
 * int x = ...
 * int myArray[10] = ...
 * ```
 * as well as heap allocated memory, i.e the pointee of the result
 * of malloc-like calls
 * 
 * In kernel code it can be used to represent the memory pointed to
 * by kernel arguments or any memory allocated from the kernel itself.
 * 
 * Again, this class is used to refer to contiguous memory ranges;
 * pointers are explicitely modeled by {@link module:memory.Pointer}
 * 
 * @memberof module:models
 */
class Memory {
  /**@type {Type}         */ #type
  /**@type {AddressSpace} */ #addrSpace
  /**@type {SrcLoc}       */ #loc
  /**@type {string}       */ #name

  /**
   * @param {Type}         type      Type of this memory
   * @param {AddressSpace} [addrSpace=AddressSpace.Unknown] The address space of this memory
   * @param {SrcLoc}       [loc]     Source info for this memory
   */
  constructor(name, type, addrSpace=AddressSpace.Unknown, loc) {
    this.#name          = name
    this.#type          = type
    this.#addrSpace     = addrSpace
    this.#loc           = loc
  }

  /** @type {string} */
  get name() { return this.#name }

  /** @type {Type} */
  get type() { return this.#type }

  /** @type {AddressSpace} */
  get addrSpace() { return this.#addrSpace }

  /** @type {SrcLoc} */
  get loc() { return this.#loc }

  /** @returns {Type} */
  getType() { return this.#type }
  /** @returns {AddressSpace} */
  getAddressSpace() { return this.#addrSpace }
  /** @returns {string} */
  getName() { return this.#name }


  /**
   * Set the source info for this memory
   * @param {SrcLoc} src
   * @returns {Memory} this
   */
  setLoc(loc) {
    this.#loc = loc
    return this
  }

  /**
   * Retrieve the number of elements of this memory
   * @returns {Number}
   */
  getNumElements() {
    if ( this.#type.isBasicType() || this.#type.isPtrType() || this.#type.isStructType())
      return 1
    else
      return this.#type.getDim().getSize()
  }

  /**
   * Retrieve the size (in Bytes) of this memory
   * @returns {Number}
   */
  getSize() {
    if ( this.#type.isBasicType() || this.#type.isPtrType() || this.#type.isStructType() ) {
      return this.#type.getRequiredBytes()
    } else {
      return this.#type.getDim().getSize() * this.#type.getElementType().getRequiredBytes()
    }
  }

  /**
   * Check if the memory is a scalar value
   * @returns {Boolean}
   */
  isScalar() {
    return !this.#type.isAggregateType()
  }

  /**
   * Check if the memory is a vector. Alias for {@link module:memory.Memory#isArray}
   * @returns {Boolean}
   */
  isVector() {
    return this.isArray()
  }

  /**
   * Check if the memory is an array
   * @returns {Boolean}
   */
  isArray() {
    return this.#type.isArrayType()
  }

  /**
   * Check if the memory is a struct
   * @returns {Boolean}
   */
  isStruct() {
    return this.#type.isStructType()
  }

  /**
   * Check if the memory is an array of structs
   * @returns {Boolean}
   */
  isArrayOfStructs() {
    return this.#type.isArrayType()
      && this.#type.getElementType().isStructType()
  }

  /**
   * Check if the memory is a struct that contains at least one array
   * @param {Boolean} 
   */
  isStructWithArrays() {
    if ( this.#type.isStructType()) {
      let elemTypes = this.#type.getElementTypes()

      for ( let i = 0; i < elemTypes.length; ++i)
        if ( elemTypes[i].isArrayType())
          return true
    }

    return false
  }

  /**
   * Check if the memory is a struct that contains at least one array
   * @param {Boolean} 
   */
  isStructOfArrays() {
    if ( this.#type.isStructType()) {
      let elemTypes = this.#type.getElementTypes()
      let res = true;
      for ( let i = 0; i < elemTypes.length; ++i)
        res = res && elemTypes[i].isArrayType()
      return res;
    }
    return false
  }

  /** 
   * Compare with another memory for equality
   * @param {Memory} other 
   */
  equals(other) {
    return (other instanceof Memory)
      && this.#type.equals(other.getType())
      && this.#addrSpace.equals(other.getAddressSpace())
      && this.#name == other.name
      && this.#loc.equals(other.loc)
  }

  /**
   * String representation of this memory
   * @returns {String}
   */
  toString() {
    let name = this.src? this.src.name : "mem"
    return `${name} (${this.#addrSpace.getValue()}) ${this.type.toString()}`
  }
}

module.exports = Memory