/**@ignore @typedef {import("@renderer/models/source/MemorySrc")} MemorySrc */
/**@ignore @typedef {import("@renderer/models/Dim")} Dim    */
/**@ignore @typedef {import("@renderer/models/types/Type")} */

const MemorySrc    = require("@renderer/models/source/MemorySrc")
const AddressSpace = require("@renderer/models/memory/AddressSpace")
const Type         = require("@renderer/models/types/Type")


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
 * @memberof module:memory
 */
class Memory {
  /**@type {Type}         */ #type
  /**@type {AddressSpace} */ #addrSpace
  /**@type {MemorySrc}    */ #src
  /**@type {Boolean}      */ #materialized

  static Src = MemorySrc

  /**
   * @param {Type}         type      Type of this memory  
   * @param {AddressSpace} [addrSpace=AddressSpace.Unknown] The address space of this memory 
   * @param {MemorySrc}    [src]     Source info for this memory
   */
  constructor(type, addrSpace=AddressSpace.Unknown, src) {
    if ( !type)
      throw new Error("Missing required argument type")
    if ( !(type instanceof Type))
      throw new Error("type must be a Type instance")
    if ( !addrSpace)
      throw new Error("Missing required argument addrSpace")
    if ( !(addrSpace instanceof AddressSpace))
      throw new Error("addrSpace must be an AddressSpace instance")
    if ( src && !(src instanceof MemorySrc))
      throw new Error("src must be MemorySrc instance")
    
    this.#type          = type
    this.#addrSpace     = addrSpace
    this.#src           = src
    this.#materialized  = !!src
  }

  /** @type {Type} */
  get type() { return this.#type }

  /** @type {AddressSpace} */
  get addrSpace() { return this.#addrSpace }

  /** @type {MemorySrc} */
  get src() { return this.#src }


  /**
   * Retrieve the type of this memory
   * @returns {Type}
   */
  getType() {
    return this.#type
  }

  /**
   * Retrieve the address space of this memory
   * @returns {AddressSpace}
   */
  getAddressSpace() {
    return this.#addrSpace
  }

  /**
   * Retrieve src info for this memory
   * @returns {MemorySrc}
   */
  getSrc() {
    return this.#src
  }

  /**
   * Set the source info for this memory
   * @param {MemorySrc} src
   * @returns {Memory} this
   */
  setSrc(src) {
    this.#src = src
    return this
  }

  /**
   * Check if the memory has src info associated
   * @returns {Boolean}
   */
  hasSrc() {
    return !!this.#src
  }

  /**
   * Retrieve the name of this memory
   * @returns {String}
   */
  getName() {
    if ( this.src)
      if ( this.src.name.length > 0)
        return this.src.name
    return "unnamed-memory"
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
   * Mark this as materialized. I.e it exists in source code
   * @param {Boolean} materialized
   * @returns {Pointer} this 
   */
  setMaterialized(materialized=true) {
    this.#materialized = !!materialized
    return this
  }
  

  /** 
   * @type {Boolean} 
   */
  isMaterialized() { 
    return this.#materialized 
  }

  /**
   * Check if the memory is a pointer
   * @returns {Boolean}
   */
  isPointer() {
    return this.#type.isPtrType()
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
   * Create a pointer to this memory.
   * The created pointer will reside at address space {@link module:memory.AddressSpace.Unknown}
   * and must be explicitly set afterwards.
   * 
   * @returns {Pointer}
   */
  getPtr() {
    const Pointer = require('@renderer/models/memory/Pointer')
    return new Pointer( new Pointer.Type(this.#type), AddressSpace.Unknown)
                .setPointee(this)
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
      && ((!this.getSrc() && !other.getSrc()) || this.#src.equals(other.getSrc()))
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