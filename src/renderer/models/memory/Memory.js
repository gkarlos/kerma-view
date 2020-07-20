/**@ignore @typedef {import("@renderer/models/source/MemorySrc")} MemorySrc */
/**@ignore @typedef {import("@renderer/models/Dim")} Dim    */
/**@ignore @typedef {import("@renderer/models/types/Type")} */

const MemorySrc = require("@renderer/models/source/MemorySrc")
const Dim       = require("@renderer/models/Dim")
const {
  isPowerOf2
} = require("@common/util/math")

/**
 * @memberof module:memory
 */
class Memory {
  /**@type {Type}      */ #type
  /**@type {MemorySrc} */ #src

  /**
   * @param {Type}      type  Type of this memory  
   * @param {MemorySrc} src   Source info for this memory
   */
  constructor(type, src) {
    // if ( !dim)
    //   throw new Error("missing required argument dim")
    // if ( !(dim instanceof Dim))
    //   throw new Error("dim must be a Dim instance")
    
    // this.#dim = dim
    // this.#src = src || new MemorySrc()
    // this.#elementSize = (element.size === undefined)? 32 : element.size
    // this.#elementSign = (element.sign === undefined)? true : element.sign

    if ( !isPowerOf2(element.size))
      throw new Error("element.size must be a power of 2")
  }

  get type() { return this.#type }

  get src() { return this.#src }

  // get dim() { return this.#dim }

  // get elementSize() { return this.#elementSize }

  // get elementSign() { return this.#elementSign }

  // get isSigned()    { return this.#elementSign }

  // get isUnsigned()  { return !this.#elementSign }

  /** 
   * @param {Memory} other 
   */
  equals(other) {
    return (other instanceof Memory)
      // && this.#dim.equals(other.dim)
      // && this.#elementSize === other.elementSize
      // && this.#elementSign === other.elementSign
      && this.#src.equals(other.src)
  }

  toString() {

  }
}

module.exports = Memory