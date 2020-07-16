const SrcInfo = require('./SrcInfo')
const SrcRange = require('./SrcRange')

/**
 * @memberof module:source
 */
class FunctionSrc extends SrcInfo {

  /** @type {String} */ #name
  /** @type {String} */ #arguments 
  /** @type {Boolean} */ #isKernel
  /** @type {String}  */ #type

  /**
   * Create a new FunctionSrc instance
   * @param {Object}      opts
   * @param {String}      opts.type
   * @param {String}      opts.filename
   * @param {SrcRange} opts.range
   * @param {String}      opts.name
   * @param {String}      opts.arguments
   * @param {Boolean}     opts.isKernel
   */
  constructor(opts={}) {
    super(opts)
    this.#type = opts.type || "void"
    this.#name = opts.name || null
    this.#arguments = opts.arguments || null
    this.#isKernel = opts.isKernel || false
  }

  /** @type {String} */
  get name() { return this.#name }

  /** @type {String} */
  get type() { return this.#type }

  /** @type {String} */
  get arguments() { return this.#arguments }

  /** @returns {Boolean} */
  isKernel() { return this.#isKernel }

  /**
   * Compare with another FunctionSrc for equality
   * @param {FunctionSrc} other Another FunctionSrc 
   */
  equals(other) {
    return (other instanceof FunctionSrc ) && super.equals(other)
      && this.#name === other.name 
      && this.#arguments === other.arguments
      && this.#isKernel === other.isKernel()
  }
}

module.exports = FunctionSrc