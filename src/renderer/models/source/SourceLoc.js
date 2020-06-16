/**
 * @memberof module:source
 */
class SourceLoc {
  /** @type {Number} */ #line
  /** @type {Number} */ #column

  constructor(line, column) {
    this.#line = line
    this.#column = column
  }

  /** @type {Number} */
  get line() { return this.#line }

  /** @type {Number} */
  get column() { return this.#column }
}

module.exports = SourceLoc