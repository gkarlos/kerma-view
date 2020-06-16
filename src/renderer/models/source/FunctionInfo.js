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
   * @param {Number}      opts.id
   * @param {String}      opts.filename
   * @param {SourceRange} opts.range
   * @param {String}      opts.name
   * @param {String}      opts.arguments
   * @param {Boolean}     opts.isKernel
   */
  constructor(opts={}, isKernel=false) {
    super(opts)
    this.#name = opts.name || null
    this.#arguments = opts.arguments || null
    this.#isKernel = isKernel
  }

  /** @type {String} */
  get name() { return this.#name }

  /** @type {String} */
  get arguments() { return this.arguments }

  /** @returns {Boolean} */
  isKernel() { return this.#isKernel }
}

module.exports = FunctionInfo