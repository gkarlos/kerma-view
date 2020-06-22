/**
 * @memberof module:source
 */
class SourceLoc {
  /** @type {Number} */ #line
  /** @type {Number} */ #column

  constructor(line, column) {
    this.#line = line || 0
    this.#column = column || 0
  }

  /** @type {Number} */
  get line() { return this.#line }

  /** @type {Number} */
  get column() { return this.#column }

  /** @returns {Number[]} */
  toArray() {
    return [this.#line, this.#column]
  }

  /**
   * Compare with another SourceLoc for equality
   * @param {SourceLoc} other Another SourceLoc
   */
  equals(other) {
    if ( !(other instanceof SourceLoc))
      return false
    return this.#line === other.line && this.#column === other.column
  }
}

module.exports = SourceLoc