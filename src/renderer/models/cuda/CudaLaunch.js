/** @ignore @typedef {import("@renderer/models/cuda/CudaGrid")} CudaGrid */
/** @ignore @typedef {import("@renderer/models/cuda/CudaGrid")} CudaBlock */
/** @ignore @typedef {import("@renderer/models/source/FunctionCallInfo")} FunctionCallInfo */

const FunctionInfo = require("../source/FunctionInfo")

/**
 * Model for a Cuda kernel launch
 */
class CudaLaunch {

  /** @type {CudaGrid}         */ #grid
  /** @type {CudaBlock}        */ #block
  /** @type {FunctionCallInfo} */ #source
  /** @type {FunctionInfo}     */ #callerSource

  /** 
   * @param {CudaGrid} grid The Grid used by the kernel launch
   * @param {CudaBlock} block The Block used by the kenerl launch
   * @param {FunctionCallInfo} srcInfo
   */

  constructor(grid, block, source, callerSource) {
    this.#grid = grid
    this.#block = block
    this.#source = source
    this.#callerSource = callerSource
  }

  /** @type {CudaGrid} */
  get grid() { return this.#grid }

  /** @type {CudaBlock} */
  get block() { return this.#block }

  /** @type {FunctionCallInfo} */
  get source() { return this.#source }

  /** @type {FunctionInfo} */
  get callerSource() { return this.#callerSource }

  /**
   * Compare with another CudaLaunch for equality
   * @param {CudaLaunch} other 
   */
  equals(other) {
    return ( other instanceof CudaLaunch)
      && this.#grid.equals(other.grid)
      && this.#block.equals(other.block)
      && this.#source.equals(other.source)
      && this.#callerSource.equals(other.callerSource)
  }

}

module.exports = CudaLaunch