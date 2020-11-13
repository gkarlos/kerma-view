/** @ignore @typedef {import("@renderer/models/source/SrcLoc")} SrcLoc */

const SrcLoc = require('./SrcLoc')

/**
 * @memberof module:source
 */
class SrcRange {

  /** @type {Number} */ #fromLine
  /** @type {Number} */ #fromColumn
  /** @type {Number} */ #toLine
  /** @type {Number} */ #toColumn

  /**
   * Create a new SrcRange object
   * @param {Object} opts
   * @param {Number} opts.fromLine   Starting line
   * @param {Number} opts.fromColumn Starting column
   * @param {Number} opts.toLine     Ending line   (inclusive)
   * @param {Number} opts.toColumn   Ending column (inclusive)
   */
  constructor(opts={}) {
    this.#fromLine   = opts.fromLine   || 0
    this.#fromColumn = opts.fromColumn || 0
    this.#toLine     = opts.toLine     || Infinity
    this.#toColumn   = opts.toColumn   || Infinity
  }

  /**
   * Create a Source Range from an array. The array must have the form
   * [fromLine, fromColumn, toLine, toColumn]
   * @param {Number[]} arr 
   */
  static fromArray(arr) {
    return new SrcRange({
      fromLine   : (arr[0] === undefined || arr[0] === null)? 0 : arr[0],
      fromColumn : (arr[1] === undefined || arr[1] === null)? 0 : arr[1],
      toLine     : (arr[2] === undefined || arr[2] === null)? Infinity : arr[2],
      toColumn   : (arr[3] === undefined || arr[3] === null)? Infinity : arr[3]
    })
  }

  /** @type {SrcLoc} */
  get from() { return new SrcLoc(this.#fromLine, this.#fromColumn) }

  /** @type {SrcLoc} */
  get to() { return new SrcLoc(this.#toLine, this.#toColumn) }

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
   * Compare with another SrcRange for equality
   * @param {SrcRange} other 
   */
  equals(other) {
    if ( !(other instanceof SrcRange))
      return false
    return this.from.equals(other.from) && this.to.equals(other.to)
  }
}

module.exports = SrcRange