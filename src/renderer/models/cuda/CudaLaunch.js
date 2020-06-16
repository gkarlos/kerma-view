/** @ignore @typedef {import("@renderer/models/cuda/CudaGrid")} CudaGrid */
/** @ignore @typedef {import("@renderer/models/cuda/CudaGrid")} CudaBlock */
/** @ignore @typedef {import("@renderer/models/source/FunctionCallInfo")} FunctionCallInfo */

/**
 * Model for a Cuda kernel launch
 */
class CudaLaunch {

  /** @type {CudaGrid}         */ #grid
  /** @type {CudaBlock}        */ #block
  /** @type {FunctionCallInfo} */ #srcInfo

  /** 
   * @param {CudaGrid} grid The Grid used by the kernel launch
   * @param {CudaBlock} block The Block used by the kenerl launch
   * @param {FunctionCallInfo} srcInfo
   */

  constructor(grid, block, srcInfo) {
    this.#grid = grid
    this.#block = block
    this.#srcInfo = srcInfo
  }


}



module.exports = CudaLaunch