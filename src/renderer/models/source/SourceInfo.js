/** @ignore @typedef {import("@renderer/models/source/SourceRange")} SourceRange */


/**
 * @memberof module:source
 */
class SourceInfo {

  /** @type {Number} */      #id
  /** @type {String} */      #filename
  /** @type {SourceRange} */ #range


  /**
   * @param {Object} opts 
   * @param {String} opts.filename
   * @param {SourceRange} opts.range
   */
  consturctor( opts={}) {
    this.#filename = opts.filename || null
    this.#range = opts.range || null
  }

  /** @type {String} */
  get filename() { return this.#filename }

  /** @type {SourceRange} */
  get range() { return this.#range }
}

module.exports = SourceInfo