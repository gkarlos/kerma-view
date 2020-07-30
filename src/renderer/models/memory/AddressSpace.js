/**
 * @memberof module:memory
 */
class AddressSpace {

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

  /** @returns {String} */
  getName() {
    return this.#name
  }

  /** @returns {Number} */
  getValue() {
    return this.#value
  }

  /**
   * @param {AddressSpace} other
   * @returns {Boolean}
   */
  equals(other) {
    return ( other instanceof AddressSpace )
      && this.#name === other.name
      && this.#value === other.value
  }
}

/** @type {AddressSpace} */
AddressSpace.Unknown = new AddressSpace("unknown", -1)

module.exports = AddressSpace