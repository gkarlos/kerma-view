const AddressSpace = require("@renderer/models/memory/AddressSpace")
const Memory       = require('@renderer/models/memory/Memory')
const PtrType      = require('@renderer/models/types/PtrType')

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
 * ```
 * // pointer to 32bit unsigned integer
 * let ptrA = new Pointer(Types.getPtrType(Types.UInt32), ...)        
 * // pointer to a 1D array of 1024 32bit unsigned integers 
 * let ptrB = new Pointer(Types.getPtrType(Types.getArrayType(Types.UInt32, 1024), ...)) 
 * ```
 * In this example `ptrA` cannot be used to point to the array ptrB points to. 
 * Also `ptrB` pointing to the entire array, also (implicitely) points to the first element of the array.
 * So it can be thought as the base address of the array.
 * 
 * @memberof module:memory
 */
class Pointer extends Memory {
  
  /** @type {PtrType} The base type of all pointers */
  static Type = require('@renderer/models/types/PtrType')

  /** @type {Memory}    */ #memory
  /** @type {Pointer}   */ #aliased
  /** @type {Pointer[]} */ #aliases
  /** @type {Boolean}   */ #materialized

  /**
   * @param {PtrType}      type      Type of this pointer  
   * @param {AddressSpace} [addrSpace] The address space of this pointer. **Note** this is *not* the pointee's adrress space
   * @param {MemorySrc}    [src]     Source info for this pointer
   */
  constructor(type, addrSpace, src) {
    if ( !type)
      throw new Error("Missing required argument type")
    if ( !(type instanceof PtrType))
      throw new Error("type must be a PtrType instance")
    if ( addrSpace && !(addrSpace instanceof AddressSpace))
      throw new Error("addrSpace must be an AddressSpace instance")
    if ( src && !(src instanceof Memory.Src))
      throw new Error("src must be MemorySrc instance")
    super(type, addrSpace, src)
    this.#aliases = []
    this.#materialized = false
  }

  /** @type {PtrType} */
  get type() { return super.type }

  /** @type {Boolean} */
  is32bit() { return this.type.getBitWidth() === 32 }

  /** @type {Boolean} */
  is64bit() { return this.type.getBitWidth() === 64 }

  /** 
   * Make this pointer an alias to another pointer.
   * 
   * Both pointers must have the same type. An error is raised on missmatch.
   * 
   * On success:
   *  - This pointer will be pointing to the aliased pointer's memory if one exists. 
   *  - If the aliased pointer does not point to memory and this pointer does, this pointer's memory is removed
   * 
   * @param {Pointer} pointer The aliased pointer
   * @type {Pointer} 
   */
  aliases(pointer) {
    if( pointer) {
      if ( !(pointer instanceof Pointer))
        throw new Error("pointer must be an instance of Pointer")

      if ( !this.type.equals(pointer.type))
        throw new Error(`type missmatch: ${this.type.toString()} vs. ${pointer.type.toString()}`)
      
      if ( pointer.equals(this.#aliased))
        return this

      if ( this.#aliased)
        this.clearAlias()

      this.#memory  = pointer.getPointee()
      this.#aliased = pointer

      if ( !this.#aliased.hasAlias(this))
        this.#aliased.addAlias(this)
    }
    return this
  }

  /**
   * Add an alias to this pointer
   * @param {Pointer} pointer 
   * @returns {Pointer} this
   */
  addAlias(pointer) {
    if ( pointer) {
      if ( !(pointer instanceof Pointer))
        throw new Error("pointer must be an instance of Pointer")
      
      if ( !this.#aliases.find(alias => alias.equals(pointer))) {
        this.#aliases.push(pointer)
        pointer.aliases(this)
      }
    }
    return this
  }

  /**
   * @param {Pointer} pointer 
   * @returns {Pointer} this
   */
  removeAlias(pointer) {
    if ( pointer) {
      for ( let i = 0; i < this.#aliases.length; ++ i)
        if ( this.#aliases[i].equals(pointer)) {
          this.#aliases.splice(i, 1)
          pointer.clearAlias()
          break
        }
    }
    return this
  }

  /**
   * @param {Boolean} pointer 
   */
  hasAlias(pointer) {
    return !!this.#aliases.find(alias => alias.equals(pointer))
  }

  /**
   * @returns {Pointer} this
   */
  removeAllAliases() {
    let old = this.#aliases
    this.#aliased = []
    old.forEach(alias => alias.clearAlias())
    return this
  }

  /**
   * @returns {Pointer[]}
   */
  getAliases() {
    return this.#aliases
  }

  /**
   * Check if the pointer is aliasing another pointer
   * @returns {Boolean}
   */
  isAlias() {
    return !!this.#aliased
  }

  /**
   * Check if this pointer has aliases
   * @returns {Boolean}
   */
  isAliased() {
    return this.#aliases.length > 0
  }

  /**
   * Make this pointer not an alias anymore
   * @returns {Pointer} this
   */
  clearAlias() {
    this.#aliased.removeAlias(this)
    this.#aliased = undefined
    return this
  }

  /**
   * Get the aliased pointer if this pointer is an alias.
   * @returns {Pointer|undefined}
   */
  getAliased() {
    return this.#aliased
  }

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
   * Check if this Pointer points to something
   * @returns {Boolean}
   */
  hasPointee() {
    return !!this.#memory
  }

  /**
   * Create a memory this pointer points to based on the pointer's type
   * The address space of the memory can be specified through the `addrSpace`
   * param and does not have to be the same as the pointer's
   * @param {AddressSpace} addrSpace
   * @returns {Memory}
   */
  createPointee(addrSpace=AddressSpace.Unknown) {
    return new Memory(this.type.getPointeeType(), addrSpace)
  }

  /**
   * Create a copy of this pointer. The pointee Memory (if any) is *not* copied. I.e 
   * the returned pointer (copy) will point to the same Memory as we do.
   */
  copy() {
    return new Pointer(this.getType(), this.getAddressSpace(), this.getSrc())
  }

  /**
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