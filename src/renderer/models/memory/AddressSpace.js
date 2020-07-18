/**
 * @memberof module:memory
 */
class AddrSpace {

  /** @type {String} */ #name
  /** @type {Number} */ #value

  constructor(name, value) {
    this.#name = name
    this.#value = value
  }

  /** @type {String} */
  get name() { return this.#name }

  /** @type {Number} */
  get value() { return this.#value }

  /**
   * @param {AddrSpace} other
   * @returns {Boolean}
   */
  equals(other) {
    return ( other instanceof AddrSpace )
      && this.#name === other.name
      && this.#value === other.value
  }
}

module.exports = AddrSpace