const Pointer      = require('@renderer/models/memory/Pointer')
const PtrType      = Pointer.Type
const AddressSpace = require("@renderer/models/cuda/CuAddrSpace")
const CuMemory     = require('@renderer/models/cuda/CuMemory')
const CuAddrSpace  = require('@renderer/models/cuda/CuAddrSpace')

/**
 * @memberof module:cuda
 */
class CuPointer extends Pointer {

  /** @type {Boolean} */ #materialized
  /** @type {Boolean} */ #kernelArg
 
  /**
   * @param {PtrType}       type        Type of this pointer  
   * @param {AddressSpace} [addrSpace] The address space of this pointer. **Note** this is *not* the pointee's adrress space
   * @param {MemorySrc}    [src]       Source info for this pointer
   */
  constructor(type, addrSpace=CuAddrSpace.Local, src) {
    super(type, addrSpace, src)
    this.#materialized = false
    this.#kernelArg = false
  }

  /**
   * Make this pointer an alias to another pointer
   * @returns {CuPointer} this
   */
  aliases(pointer) {
  }

  /**
   * Set the the memory this pointer points to
   * The memory type must be the same as the type of the pointer's pointee
   * @param {CuMemory} memory
   * @returns {CuPointer} this
   * @throws On type missmatch
   */
  setPointee(memory) {
    if ( !(memory instanceof CuMemory))
      throw new Error("memory must be an instance of CuMemory")
    super.setPointee(memory)
    return this
  }

  /**
   * @returns {CuMemory}
   */
  getPointee() { 
    return super.getPointee()
  }

  /**
   * @returns {CuAddrSpace}
   */
  getAddrSpace() {
    return super.getAddressSpace()
  }

  /**
   * Set whether this pointer is materialized. i.e is a valid
   * pointer in the kernel source code
   * 
   * @param {Boolean} val
   * @returns {CuPointer} this
   */
  setMaterialiazed(val) {
    this.#materialized = !!val
    return this
  }

  /**
   * Set whether this pointer is an argument to a kernel
   * @param {Boolean} val 
   * @returns {CuPointer} this
   */
  setKernelArg(val) {
    this.#kernelArg = !!val
    return this
  }


  /**
   * Check whether the pointer is materialized. i.e is a valid
   * pointer in the kernel source code
   * 
   * @returns {Boolean}
   */
  isMaterialized() {
    return this.#materialized
  }

  /**
   * @returns {Boolean}
   */
  isKernelArg() {
    return this.#kernelArg
  }

  pointsToSharedMemory() {
    if ( this.getPointee()) {

    }
    return false
  }

  pointsToGlobalMemory() {
    if ( this.getPointee()) {

    }
    return false
  }

  pointsToConstantMemory() {
    if ( this.getPointee()) {

    }
    return false
  }
}

module.exports = CuPointer