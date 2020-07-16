/** @ignore @typedef {import("@renderer/models/cuda/CudaGrid")} CudaGrid */
/** @ignore @typedef {import("@renderer/models/cuda/CudaGrid")} CudaBlock */
/** @ignore @typedef {import("@renderer/models/cuda/CudaKernel")} CudaKernel */
/** @ignore @typedef {import("@renderer/models/source/FunctionCallSrc")} FunctionCallSrc */

const FunctionSrc = require("../source/FunctionSrc")

/**
 * Model for a Cuda kernel launch
 */
class CudaLaunch {

  /** @type {Number}           */ #id       
  /** @type {CudaGrid}         */ #grid
  /** @type {CudaKernel}       */ #kernel
  /** @type {FunctionCallSrc} */ #source

  /** 
   * @param {CudaKernel} kernel The Kernel this launch is for
   * @param {CudaGrid} dims
   * @param {Object} props Optional properties
   * @param {Number} [props.id] An id for this launch
   * @param {FunctionCallSrc} [props.source] Source info about the launch
   */
  constructor(kernel, grid, props={}) {
    this.#kernel = kernel || undefined
    this.#grid   = grid || undefined
    this.#source = props && props.source || undefined
    if ( props && (props.id !== undefined || props.id !== null))
      this.#id = props.id
  }

  /** 
   * The kernel this launch is relevant to
   * @type {CudaKernel} 
   */
  get kernel() { return this.#kernel }

  /** @type {CudaGrid} */
  get grid() { return this.#grid }

  /** @type {CudaBlock} */
  get block() { return this.#grid.block }

  /** @type {FunctionCallSrc} */
  get source() { return this.#source }

  /** @type {FunctionSrc} */
  get callerSource() { return this.#source.caller }

  /** @type {Number} */
  get id() { return this.#id }

  /**
   * Compare with another CudaLaunch for equality
   * @param {CudaLaunch} other 
   */
  equals(other) {
    return ( other instanceof CudaLaunch)
      && this.#grid.equals(other.grid)
      && this.kernel.equals(other.kernel)
      && ((this.#source && other.source && this.#source.equals(other.source)) || (!this.#source && !other.source))
      && ((this.#id && other.id && this.#id === other.id) || (!this.#id && !other.id))
  }

  /**
   * String Representation of the launch
   * @param {Boolean} [short=false] If set a compact String representation is return
   * @returns {String}
   */
  toString(short=false) {
    return short? `#${this.id}, ${this.source.name}, <<<${this.grid.toString(true)}>>>`
      : `launch(id: ${this.id}, kernel: ${this.source.name}, caller: ${this.#source.caller.name}, params: <<<${this.grid.toString(true)}}>>>)`
  }

}

module.exports = CudaLaunch