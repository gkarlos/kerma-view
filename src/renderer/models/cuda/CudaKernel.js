/** @ignore @typedef {import("@renderer/models/source/FunctionInfo")} FunctionInfo */

/**
 * @memberof module:cuda
 */
class CudaKernel {
  /** @type {FunctionInfo} */
  #source

  /**
   * 
   * @param {FunctionInfo} source 
   */
  constructor(source) {
    this.#source = source
  }

  /** @type {FunctionInfo} */
  get source() { return this.#source }

  
}