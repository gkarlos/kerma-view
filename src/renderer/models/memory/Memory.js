/**@ignore @typedef import("@renderer/modules/source/MemorySrc") MemorySrc */
/**@ignore @typedef import("@renderer/modules/Dim") Dim */

const MemorySrc = require("@renderer/models/source/MemorySrc")
const Dim       = require("@renderer/models/Dim")
const {
  isPowerOf2
} = require("@common/util/math")

/**
 * @memberof module:memory
 */
class Memory {
  /**@type {Dim}       */ #dim
  /**@type {Number}    */ #elementSize
  /**@type {Boolean}   */ #elementSign
  /**@type {MemorySrc} */ #src

  /**
   * @param {Dim}       dim          The size of this memory
   * @param {Object}    element      Description of the elements of this memory
   * @param {Number}    element.size Size of the elements of this memory. Must be a power of 2
   * @param {Boolean}   element.sign Signed or unsigned elements
   * @param {MemorySrc} src          Source info for this memory
   */
  constructor(dim, element={size: 32, sign: true}, src) {
    if ( !dim)
      throw new Error("missing required argument dim")
    if ( !(dim instanceof Dim))
      throw new Error("dim must be a Dim instance")
    if ( !isPowerOf2(element.size))
      throw new Error("element.size must be a power of 2")
    
    this.#dim = dim
    this.#src = src || new MemorySrc()
    this.#elementSize = element.size
    this.#elementSign = element.sign
  }

  get src() { return this.#src }

  get dim() { return this.#dim }

  get elementSize() { return this.#elementSize }

  get elementSign() { return this.#elementSign }

  get isSigned()    { return this.#elementSign }

  get isUnsigned()  { return !this.#elementSign }

  /** 
   * @param {Memory} other 
   */
  equals(other) {
    return (other instanceof Memory)
      && this.#dim.equals(other.dim)
      && this.#elementSize === other.elementSize
      && this.#elementSign === other.elementSign
      && this.#src.equals(other.src)
  }
}

module.exports = Memory