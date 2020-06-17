/** @ignore @typedef {import("@renderer/models/source/SourceLoc")} SourceLoc */

const SourceLoc = require('./SourceLoc')

/**
 * @memberof module:source
 */
class SourceRange {

  /** @type {Number} */ #fromLine
  /** @type {Number} */ #fromColumn
  /** @type {Number} */ #toLine
  /** @type {Number} */ #toColumn

  /** 
   * @param {Object} opts
   * @param {Number} opts.fromLine
   * @param {Number} opts.fromColumn
   * @param {Number} opts.toLine
   * @param {Number} opts.toColumn 
   */
  constructor(opts={}) {
    this.#fromLine   = opts.fromLine || 0
    this.#fromColumn = opts.fromColumn || 0
    this.#toLine = opts.toLine || Infinity
    this.#toColumn = opts.toColumn || Infinity
  }

  /** @type {SourceLoc} */
  get from() { return new SourceLoc(this.#fromLine, this.#fromColumn) }

  /** @type {SourceLoc} */
  get to() { return new SourceLoc(this.#toLine, this.#toColumn) }
  
  /** @type {Number} */
  get fromLine() { return this.#fromLine }

  /** @type {Number} */
  get fromColumn() { return this.#fromColumn }

  /** @type {Number} */
  get toLine() { return this.#toLine }

  /** @type {Number} */
  get toColumn() { return this.#toColumn }

  /**
   * @returns {Boolean}
   */
  hasEndLine() { return this.#toLine !== Infinity }

  /**
   * @returns {Boolean}
   */
  hasEndColumn() { return this.#toColumn !== Infinity }

  /**
   * Compare with another SourceRange for equality
   * @param {SourceRange} other 
   */
  equals(other) {
    if ( !(other instanceof SourceRange))
      return false
    return this.from.equals(other.from) && this.to.equals(other.to)
  }
}

module.exports = SourceRange