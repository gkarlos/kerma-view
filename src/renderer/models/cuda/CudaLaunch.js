/** @ignore @typedef {import("@renderer/models/cuda/CudaGrid")} CudaGrid */
/** @ignore @typedef {import("@renderer/models/cuda/CudaGrid")} CudaBlock */
/** @ignore @typedef {import("@renderer/models/cuda/CudaKernel")} CudaKernel */
/** @ignore @typedef {import("@renderer/models/source/FunctionCallInfo")} FunctionCallInfo */

const FunctionInfo = require("../source/FunctionInfo")

/**
 * Model for a Cuda kernel launch
 */
class CudaLaunch {

  /** @type {Number}           */ #id       
  /** @type {CudaGrid}         */ #grid
  /** @type {CudaBlock}        */ #block
  /** @type {CudaKernel}       */ #kernel
  /** @type {FunctionCallInfo} */ #source

  /** 
   * @param {CudaKernel} kernel The Kernel this launch is for
   * @param {Object} dims
   * @param {CudaGrid} dims.grid The Grid used by the kernel launch
   * @param {CudaBlock} dims.block The Block used by the kernel launch
   * @param {Object} props Optional properties
   * @param {Number} [props.id] An id for this launch
   * @param {FunctionCallInfo} [props.source] Source info about the launch
   */
  constructor(kernel, dims={}, props={}) {
    this.#kernel = kernel || undefined
    this.#grid   = dims && dims.grid || undefined
    this.#block  = dims && dims.block || undefined
    this.#source = props && props.source || undefined
    this.#id = props && props.id
  }

  /** 
   * The kernel this launch is relevant to
   * @type {CudaKernel} 
   */
  get kernel() { return this.#kernel }

  /** @type {CudaGrid} */
  get grid() { return this.#grid }

  /** @type {CudaBlock} */
  get block() { return this.#block }

  /** @type {FunctionCallInfo} */
  get source() { return this.#source }

  /** @type {FunctionInfo} */
  get callerSource() { return this.#source.caller }

  /** @type {Number} */
  get id() { return this.#id }

  /**
   * Compare with another CudaLaunch for equality
   * @param {CudaLaunch} other 
   */
  equals(other) {
    return ( other instanceof CudaLaunch)
      && ((!this.#grid && !other.grid) || ( this.#grid && this.#grid.equals(other.grid)))
      && ((!this.#block && !other.block) || ( this.#block && this.#block.equals(other.block)))
      && this.#source.equals(other.source)
      && this.#id === other.id
  }

  /**
   * String Representation of the launch
   * @param {Boolean} [short=false] If set a compact String representation is return
   * @returns {String}
   */
  toString(short=false) {
    return short? `#${this.id}, ${this.source.name}, <<<${this.grid.toString(true)},${this.block.dim.toString()}>>>`
      : `launch(id: ${this.id}, kernel: ${this.source.name}, caller: ${this.#source.caller.name}, params: <<<${this.grid.toString(true)},${this.block.toString(true)}>>>)`
  }

}

module.exports = CudaLaunch