const SourceInfo = require('./SourceInfo')

/** @ignore @typedef {import("@renderer/models/source/FunctionInfo")} FunctionInfo */


/**
 * @memberof module:source
 */
class FunctionCallInfo extends SourceInfo {
  /** @type {String}  */ #name
  /** @type {String}  */ #arguments 
  /** @type {FunctionInfo} */ #caller
  /** @type {Boolean} */ #isKernelLaunch
  /** @type {Boolean} */ #launchParams
  /** @type {Boolean} */ #inLoop

  /**
   * Create a new FunctionCallInfo instance
   * @param {Object}       opts
   * @param {String}       opts.filename
   * @param {SourceRange}  opts.range
   * @param {String}       opts.arguments
   * @param {FunctionInfo} opts.caller
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

  /** @type {FunctionInfo} */
  get caller() { return this.#caller }

  /** @type {String} */
  get launchParams() { return this.#launchParams }

  /** @type {Boolean} */
  get inLoop() { return this.#inLoop }

  /** @returns {Boolean} */
  isKernelLaunch() { return this.#isKernelLaunch }

  /**
   * Compare with another FunctionCallInfo for equality
   * @param {FunctionCallInfo} other Another FunctionCallInfo 
   */
  equals(other) {
    return (other instanceof FunctionCallInfo) 
      && super.equals(other)
      && this.#name === other.name
      && this.#arguments === other.arguments
      && this.caller.equals(other.caller)
      && this.launchParams === other.launchParams
      && this.inLoop === other.inLoop
      && this.isKernelLaunch() === other.isKernelLaunch()

  }
}

module.exports = FunctionCallInfo