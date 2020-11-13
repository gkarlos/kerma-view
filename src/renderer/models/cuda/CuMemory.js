const Memory      = require('@renderer/models/Memory')
const CuAddrSpace = require('@renderer/models/cuda/CuAddrSpace')
const Types       = require('@renderer/models/types/Types')
const CuPointer = require('./CuPointer')

/**@ignore @typedef {import("@renderer/models/Memory")} Memory */
/**@ignore @typedef {import("@renderer/models/cuda/CuAddrSpace")} CuAddrSpace*/

/**
 * Extends {@link module:memory.Memory}
 */
class CuMemory extends Memory {

  /** @type {Boolean} */ #isHostAlloc
  /** @type {Boolean} */ #isStackAlloc
  /** @type {Boolean} */ #isPinned
  /** @type {Boolean} */ #arg

  /**
   * @param {Type}         type      Type of this memory  
   * @param {CuAddrSpace}  addrSpace The address space of this memory 
   * @param {MemorySrc}    [src]     Source info for this memory
   * @param {Object}       [props]   
   * @param {Boolean}      [props.hostAlloc=true]    Memory allocated from host code
   * @param {Boolean}      [props.stackAlloc=false]  Memory allocated on the stack
   * @param {Boolean}      [props.pinned=false]            Pinned memory
   * @param {Boolean}      [props.arg=false]               This memory is passed to the kernel as na argument
   */
  constructor(type, addrSpace, src, props={}) {
    if ( !type)
      throw new Error("Missing required argument type")
    if ( !(type instanceof Types.Type))
      throw new Error("type must be a Type instance")
    if ( !addrSpace)
      throw new Error("Missing required argument addrSpace")
    if ( !(addrSpace instanceof CuAddrSpace))
      throw new Error("addrSpace must be an CuAddrSpace instance")
    if ( src && !(src instanceof Memory.Src))
      throw new Error("src must be MemorySrc instance")
    
    super(type, addrSpace, src)

    this.#isPinned      = props.pinned !== undefined? props.pinned : false
    this.#isHostAlloc   = props.hostAlloc !== undefined? props.hostAlloc : true
    this.#isStackAlloc  = props.stackAlloc !== undefined? porps.stackAlloc : false
    this.#arg           = props.arg !== undefined? props.arg : false
  }

  /**
   * Get a pointer to this memory
   * @returns {CuPointer}
   */
  getPointer() {
    //TODO
  }

  /**
   * Check if this memory is passed to the kernel as an argument
   * @returns {Boolean}
   */
  isKernelArg() {
    return this.#arg
  }

  /**
   * Set whether the memory is pinned
   * i.e allocated through `cudaMallocHost` or `cudaHostAlloc`
   * @param {Boolean} val 
   */
  setPinned(val) {
    this.#isPinned = !!val
  }
 
  /**
   * Set whether the memory is allocated from host code
   * through `cudaMalloc`. By default `CuMemory` objects have this
   * property set to true.
   * 
   * @param {Boolean} val 
   * @returns {CuMemory} this
   */
  setHostAlloc(val) {
    this.#isHostAlloc = !!val
  }

  /**
   * Check if the memory is allocated from host code
   * @returns {Boolean} 
   */
  isHostAlloc() { 
    return this.#isHostAlloc
  }

  /**
   * Set whether the memory is allocated from device code
   * through `malloc`
   * 
   * @param {Boolean} val
   * @returns {CuMemory} this 
   */
  setDeviceAlloc(val) {
    this.#isHostAlloc = !val
    return this;
  }

  /**
   * Check if the memory is allocated from device code. i.e
   * through `malloc` call from kernel code
   * 
   * @returns {Boolean} 
   */
  isDeviceAlloc() { 
    return !this.#isHostAlloc
  }

  /**
   * Set whether the memory is stack allocated
   * 
   * @param {*} val 
   */
  setStackAlloc(val) {
    return this.#isStackAlloc
  }

  /** 
   * Check if the memory is stack allocated
   * @returns {Boolean}
   */
  isStackAlloc() { 
    return this.#isStackAlloc
  }

  /**
   * Check if the kernel can only access this memory through
   * a pointer to it pass as an argument
   * @returns {Boolean}
   */
  isAccessedThroughPtrArg() {
    return this.type.isArrayType() 
      && this.addrSpace.equals(CuAddrSpace.Global)
      && !this.isHostAlloc()
  }

  /**
   * Validate the memory's consistency.
   * For instance we should not have both
   * `isDeviceAlloc() == true` and `isStackAlloc() == true`
   * @returns {Boolean}
   * @throws {}
   */
  validate() {

  }
}

module.exports = CuMemory