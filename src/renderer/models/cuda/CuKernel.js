/** @ignore @typedef {import("@renderer/models/source/FunctionSrc")} FunctionSrc */
/** @ignore @typedef {import("@renderer/models/cuda/CuLaunch")} CuLaunch */

const SrcRange = require("../source/SrcRange")
/**
 * @memberof module:cuda
 */
class CuKernel {
  /** @type {Number}   */ #id
  /** @type {SrcRange} */ #range
  /** @type {String}   */ #color
  /** @type {String}   */ #name

  /**
   * @param {Number} id
   * @param {string} name
   * @param {SrcRange} range
   */
  constructor(id,name,range,color) {
    this.#id = id
    this.#name = name
    this.#range = range
    this.#color = color
  }

  /** @type {Number} */
  get id() { return this.#id }

  /** @type {SrcRange} */
  get range() { return this.#range }

  /** @type {string} */
  get name() { return this.#name }

  /** @type {string} */
  get color() { return this.#color }

  /**
   * @param {String} color
   * @return this;
   */
  setColor(color){
    this.#color = color
    return this
  }
  /**
   * Compare with another kernel for equality
   * @param {CuKernel} other
   */
  equals(other) {
    return (other instanceof CuKernel)
      && this.#id === other.id
  }

  /**
   * String representation of this kernel
   * @param {Boolean} [short=false] If set a compact String representation is returned
   * @returns {String}
   */
  toString(short=false) {
    return `#${this.id}, ${this.name}`
  }
}

module.exports = CuKernel