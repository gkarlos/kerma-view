const Limits = require('@renderer/cuda/CudaLimits')

/** @ignore @typedef {import("@renderer/cuda/CudaBlock")} CudaBlock */

/**
 * Represents a Cuda Warp
 * @memberof module:cuda
 */
class CudaWarp {
  
  /** @type CudaBlock */ #block
  /** @type Number    */ #index
  /** @type Number    */ #usableThreads
  /** @type Number    */ #unusableThreads

  /**
   * 
   * @param {CudaBlock} block The CudaBlock this warp is part of 
   * @param {Number} index Linear index for the position of the warp in its block
   */
  constructor(block, index) {
    if ( index >= block.numWarps)
      throw new Error(`Invalid warp index '${index}' for block '[$]'`)
    this.#block = block
    this.#index = index
    this.#usableThreads = this._computeUsableThreads(block, index)
    this.#unusableThreads = Limits.warpSize - this.#usableThreads
  }

  /** 
   * Compute the number of usable threads in a warp
   * @protected 
   * @param {CudaBlock} block
   * @param {Number} warpIndex
   * */
  _computeUsableThreads(block, warpIndex) {
    if ( block.hasWarpWithInactiveLanes()) {
      if ( warpIndex == block.numWarps - 1) {
        return block.size % Limits.warpSize
      }
    }
    return Limits.warpSize
  }

  /** 
   * Retrieve the block this warp is part of
   * @returns {CudaBlock}
   */
  getBlock() { return this.#block } 

  /**
   * Retrieve the linear index of this warp8 in its block
   * @returns {Number}
   */
  getIndex() { return this.#index}  

  /**
   * Get the number of usable threads in this warp
   * A warp might have unusable threads if it is the last warp in the block
   * and the block size is not a multiple of the warp size
   * 
   * @return {Number}
   */
  getNumUsableThreads() { return this.#usableThreads}

  /**
   * Get the number of unusable threads in this warp
   * A warp might have unusable threads if it is the last warp in the block
   * and the block size is not a multiple of the warp size
   * 
   * @return {Number}
   */
  getNumUnusableThreads() { return this.#unusableThreads}


  /**
   * Retrieve the indices of the usable threads in the block
   * @returns {number[]}
   */
  getUsableThreads() { 
    return [...Array(this.#usableThreads).keys()]
  }

  /**
   * Retrieve the index of the last usable thread
   * @returns {Number}
   */
  getLastUsableThread() {
    return this.getNumUnusableThreads() - 1
  }

  /**
   * Retrieve the indices of the usable threads in the block
   * @returns {number[]}
   */
  getUsableThreads() { 
    return [...Array(this.#usableThreads).keys()]
  }

  /**
   * Retrieve the indices of the unusable threads in the block
   * @returns {number[]}
   */
  getUnusableThreads() {
    let res = []
    for ( let i = Limits.warpSize - 1; i >= this.#usableThreads; i-- )
      res.unshift(i)
    return res;
  }

  /**
   * Compare warps for value-equality
   * @param {CudaWarp} other 
   * @return {Boolean}
   */
  equals(other) {
    if ( !(other instanceof CudaWarp))
      return false
    return this.getBlock().equals(other.getBlock())
        && this.getIndex() === other.getIndex()
        && this.getNumUsableThreads() === other.getNumUsableThreads()
        && this.getNumUnusableThreads() === other.getNumUnusableThreads()  
  }

  /**
   * String representation of the warp
   * @returns {String}
   */
  toString() {
    return `CudaWarp(block: ${this.#block.toString()}, id: ${this.getIndex()}, usable: ${this.getNumUsableThreads()})`
  }
}

module.exports = CudaWarp