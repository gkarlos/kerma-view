/** @ignore @typedef {import("@renderer/models/source/SourceRange")} SourceRange */

const SourceRange = require("./SourceRange")


/**
 * @memberof module:source
 */
class SourceInfo {

  /** @type {String} */      #filename
  /** @type {SourceRange} */ #range


  /**
   * @param {Object} opts 
   * @param {String} opts.filename
   * @param {SourceRange} opts.range
   */
  constructor( opts={}) {
    this.#filename = opts.filename || null
    this.#range = opts.range || new SourceRange()
  }

  /** @type {String} */
  get filename() { return this.#filename }

  /** @type {SourceRange} */
  get range() { return this.#range }

  /**
   * Compare with another SourceInfo for equality
   * @param {SourceInfo} other Another SourceInfo
   */
  equals(other) {
    if ( !(other instanceof SourceInfo))
      return false
    return this.#filename === other.filename && this.#range.equals(other.range)
  }
}

module.exports = SourceInfo