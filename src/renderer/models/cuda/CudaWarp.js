const Limits = require('@renderer/models/cuda/CudaLimits')
const CudaIndex = require('@renderer/models/cuda/CudaIndex')

/** @ignore @typedef {import("@renderer/models/cuda/CudaBlock")} CudaBlock */
/** @ignore @typedef {import("@renderer/models/cuda/CudaIndex")} CudaIndex */

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
   * @param {CudaIndex|Number} index Linear index for the position of the warp in its block
   */
  constructor(block, index) {
    if (index instanceof CudaIndex) {
      if (!index.is1D())
        throw new Error("Invalid index. Must be 1D")
      if ( index.x >= block.numWarps)
        throw new Error(`Invalid warp index '${index.toString()}' for block ${block.toString()}`)
    } else if (Number.isInteger(index)) {
      if ( index >= block.numWarps)
        throw new Error(`Invalid index '${index}' for block ${block.toString()}`)
    } else {
      throw new Error(`Invalid argument 'index'. Must be an Integer or CudaIndex instance`)
    }

    this.#block = block
    this.#index = index
    this.#usableThreads = this._computeUsableThreads(block, index)
    this.#unusableThreads = Limits.warpSize - this.#usableThreads
  }

  /** 
   * Compute the number of usable threads in a warp
   * @protected 
   * @param {CudaBlock} block
   * @param {Number|CudaIndex} warpIndex
   * */
  _computeUsableThreads(block, warpIndex) {
    if ( block.hasWarpWithInactiveLanes()) {
      if ( Number.isInteger(warpIndex))
        if ( warpIndex == block.numWarps - 1)
          return block.size % Limits.warpSize
      else
        if ( warpIndex.x == block.numWarps - 1)
          return block.size % Limits.warpSize
    }
    return Limits.warpSize
  }

  /** 
   * Retrieve the block this warp is part of
   * @returns {CudaBlock}
   */
  getBlock() { return this.#block } 

  /**
   * Retrieve the linear index of this warp in its block
   * @returns {Number}
   */
  getIndex() { return this.#index }  

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
      return (other instanceof CudaWarp) 
        && this.getBlock().equals(other.getBlock())
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