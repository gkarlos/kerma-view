const SourceInfo = require('./SourceInfo')
const SourceRange = require('./SourceRange')

/**
 * @memberof module:source
 */
class FunctionInfo extends SourceInfo {

  /** @type {String} */ #name
  /** @type {String} */ #arguments 
  /** @type {Boolean} */ #isKernel

  /**
   * Create a new FunctionInfo instance
   * @param {Object}      opts
   * @param {String}      opts.filename
   * @param {SourceRange} opts.range
   * @param {String}      opts.name
   * @param {String}      opts.arguments
   * @param {Boolean}     opts.isKernel
   */
  constructor(opts={}) {
    super(opts)
    this.#name = opts.name || null
    this.#arguments = opts.arguments || null
    this.#isKernel = opts.isKernel || false
  }

  /** @type {String} */
  get name() { return this.#name }

  /** @type {String} */
  get arguments() { return this.#arguments }

  /** @returns {Boolean} */
  isKernel() { return this.#isKernel }

  /**
   * Compare with another FunctionInfo for equality
   * @param {FunctionInfo} other Another FunctionInfo 
   */
  equals(other) {
    return (other instanceof FunctionInfo ) && super.equals(other)
      && this.#name === other.name 
      && this.#arguments === other.arguments
      && this.#isKernel === other.isKernel()
  }
}

module.exports = FunctionInfo