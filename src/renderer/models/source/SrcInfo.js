/** @ignore @typedef {import("@renderer/models/source/SrcRange")} SrcRange */

const SrcRange = require("./SrcRange")


/**
 * @memberof module:source
 */
class SrcInfo {

  /** @type {String}   */ #filename
  /** @type {SrcRange} */ #range


  /**
   * @param {Object} opts 
   * @param {String} opts.filename
   * @param {SrcRange} opts.range
   */
  constructor( opts={}) {
    this.#filename = opts.filename
    this.#range = opts.range || new SrcRange()
  }

  /** @type {String} */
  get filename() { return this.#filename }

  /** @type {SrcRange} */
  get range() { return this.#range }

  /**
   * Compare with another SrcInfo for equality
   * @param {SrcInfo} other Another SrcInfo
   */
  equals(other) {
    if ( !(other instanceof SrcInfo))
      return false
    return (this.#filename === other.filename) && this.#range.equals(other.range)
  }
}

module.exports = SrcInfo