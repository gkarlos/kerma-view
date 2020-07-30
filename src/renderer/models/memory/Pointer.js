const AddressSpace = require("@renderer/models/memory/AddressSpace")
const Memory       = require('@renderer/models/memory/Memory')
const PtrType      = require('@renderer/models/types/PtrType')
const { add } = require("lodash")

/**
 * This class is used to model pointers. A Pointer is a piece of
 * Memory with type restrictions. Therefore this class inherits
 * Memory and extends its API with additional functionlity.
 * 
 * Since this class can be used to model both pointer declaractions 
 * and pointer definitions, it is not a requirement to always be 
 * pointing to some memory. I.e a pointee is not required for 
 * construction and can be set later.
 * 
 * Our use cases are mostly the result of malloc-family (and in
 * particular cudaMalloc-family) calls as well as kernel arguments. 
 * 
 * It differs from typical C/C++ pointers in the following manner:
 * 
 * It can point to basic types (int, float, etc..) and structs just
 * as it does in C/C++ but it can also point to arrays. Pointing
 * to an array is explicitely represented instead of having a pointer
 * to its first element. See the example below.
 * 
 * @example
 * let ptrA = new Pointer(Types.getPtrType(Types.UInt32), ...)         // pointer to 32bit unsigned integer
 * let ptrB = new Pointer(Types.getArrayType(Types.UInt32, 1024), ...) // pointer to a 1D array of 1024 32bit unsigned integers
 * 
 * // In this example `ptrA` cannot be used to point to the array ptrB points to. 
 * // Also `ptrB` pointing to the entire array, also (implicitely) points to the first element of the array.
 * // So it can be thought as the base address of the array.
 * 
 * @memberof module:memory
 */
class Pointer extends Memory {
  
  /** @type {PtrType} The base type of all pointers */
  static Type = require('@renderer/models/types/PtrType')

  /** @type {Memory} */ #memory

  /**
   * @param {PtrType}      type      Type of this pointer  
   * @param {AddressSpace} addrSpace The address space of this pointer. **Note** this is *not* the pointee's adrress space
   * @param {MemorySrc}    [src]     Source info for this pointer
   */
  constructor(type, addrSpace, src) {
    console.log(type.toString())
    if ( !type)
      throw new Error("Missing required argument type")
    if ( !(type instanceof PtrType))
      throw new Error("type must be a Type instance")
    if ( !addrSpace)
      throw new Error("Missing required argument addrSpace")
    if ( !(addrSpace instanceof AddressSpace))
      throw new Error("addrSpace must be an AddressSpace instance")
    if ( src && !(src instanceof Memory.Src))
      throw new Error("src must be MemorySrc instance")
    super(type, addrSpace, src)
  }

  /** @type {PtrType} */
  get type() { return super.type }

  /**
   * Set the the memory this pointer points to
   * The memory type must be the same as the type of the pointer's pointeee
   * @param {Memory} memory 
   * @returns {Pointer} this
   * @throws On type missmatch
   */
  setPointee(memory) {
    if ( !memory)
      throw new Error("Missing required argument 'memory'")
    if ( !this.type.getPointeeType().equals(memory.type))
      throw new Error(`Pointer/Pointee type missmatch: ${this.type.toString()} / ${memory.type.toString()}`)
    this.#memory = memory
    return this
  }

  /**
   * Get the memory this pointer points to
   * @returns {Memory}
   */
  getPointee() {
    return this.#memory
  } 

  /**
   * Check if this Pointer points to 
   * @returns {Boolean}
   */
  hasPointee() {
    return !!this.#memory
  }

  /**
   * 
   * @param {Pointer} other 
   * @returns {Boolean}
   */
  equals(other) {
    return ( other instanceof Pointer)
      && this.type.equals(other.type)
      && ( (this.hasPointee() && other.hasPointee() && this.getPointee().equals(other.getPointee()))
        || (!this.hasPointee() && !other.hasPointee()))
  }
}

module.exports = Pointer