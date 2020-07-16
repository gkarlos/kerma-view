const SrcInfo = require('./SrcInfo')
const SrcRange = require('./SrcRange')
const _ = require('@renderer/app')._

/** @ignore @type import("@renderer/models/source/SrcRange") SrcRange*/

/**
 * @memberof module:source
 */
class MemoryInfo extends SrcInfo {

  /** @type {String}   */ #type
  /** @type {String}   */ #name
  /** @type {String[]} */ #qualifiers
  
  /**
   * Create a new MemoryInfo object
   * @param {Object}      opts
   * @param {String}      opts.type
   * @param {String}      opts.name
   * @param {String[]}    opts.qualifiers
   * @param {String}      opts.filename
   * @param {SrcRange} opts.range
   */
  constructor(opts={}) {
    super(opts)
    this.#type = opts.type
    this.#name = opts.name
    this.#qualifiers = opts.qualifiers || []
  }

  /** @type {String} */
  get type() { return this.#type }

  /** @type {String} */
  get name() { return this.#name }

  /** @type {String} */
  get qualifiers() { return this.#qualifiers }

  /** @returns {Boolean} */
  hasQualifier(qualifier) {
    return this.#qualifiers.find(qualifier)
  }

  /** @returns {void} */
  addQualifier(qualifier) {
    this.#qualifiers.push(qualifier)
  }

  /** @returns {Boolean} */
  removeQualifier(qualifier) {
    let res = false
    for ( let i = 0; i < this.#qualifiers.length; ++i)
      if ( this.#qualifiers[i] === qualifier) {
        this.#qualifiers.splice(i, 1)
        res = true
      }
    return res
  }

  /**
   * 
   * @param {MemoryInfo} other 
   */
  equals(other) {
    return (other instanceof MemoryInfo) 
      && super.equals(other)
      && this.#type === other.type
      && this.#name === other.name
      && _.isEqual(this.#qualifiers, other.qualifiers)
  }
}

module.exports = MemoryInfo