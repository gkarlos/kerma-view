const SrcInfo = require('./SrcInfo')

/** @ignore @typedef {import("@renderer/models/source/FunctionSrc")} FunctionSrc */


/**
 * @memberof module:source
 */
class FunctionCallSrc extends SrcInfo {
  /** @type {String}  */ #name
  /** @type {String}  */ #arguments 
  /** @type {FunctionSrc} */ #caller
  /** @type {Boolean} */ #isKernelLaunch
  /** @type {Boolean} */ #launchParams
  /** @type {Boolean} */ #inLoop

  /**
   * Create a new FunctionCallSrc instance
   * @param {Object}       opts
   * @param {String}       opts.filename
   * @param {SourceRange}  opts.range
   * @param {String}       opts.arguments
   * @param {FunctionSrc}  opts.caller
   * @param {Boolean}      opts.isKernelLaunch
   * @param {String}       opts.launchParams
   * @param {Boolean}      opts.inLoop
   */
  constructor(opts={}) {
    super(opts)
    this.#name = opts.name || null
    this.#arguments = opts.arguments || null
    this.#caller = opts.caller || null
    this.#isKernelLaunch = opts.isKernelLaunch || false
    this.#launchParams = opts.launchParams || null
    this.#inLoop = opts.inLoop || false
  }

  /** @type {String} */
  get name () { return this.#name }

  /** @type {String} */
  get arguments() { return this.#arguments }

  /** @type {FunctionSrc} */
  get caller() { return this.#caller }

  /** @type {String} */
  get launchParams() { return this.#launchParams }

  /** @type {Boolean} */
  get inLoop() { return this.#inLoop }

  /** @returns {Boolean} */
  isKernelLaunch() { return this.#isKernelLaunch }

  /**
   * Compare with another FunctionCallSrc for equality
   * @param {FunctionCallSrc} other Another FunctionCallSrc 
   * @returns {Boolean}
   */
  equals(other) {
    return (other instanceof FunctionCallSrc) 
      && super.equals(other)
      && this.#name === other.name
      && this.#arguments === other.arguments
      && (   (this.caller === null && other.caller === null) 
          || (this.caller !== null && other.caller !== null && this.caller.equals(other.caller)))
      && this.launchParams === other.launchParams
      && this.inLoop === other.inLoop
      && this.isKernelLaunch() === other.isKernelLaunch()

  }
}

module.exports = FunctionCallSrc