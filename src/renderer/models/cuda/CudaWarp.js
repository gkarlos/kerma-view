const Limits = require('@renderer/models/cuda/CudaLimits')
const CudaIndex = require('@renderer/models/cuda/CudaIndex')

/** @ignore @typedef {import("@renderer/models/cuda/CudaBlock")} CudaBlock */
/** @ignore @typedef {import("@renderer/models/cuda/CudaIndex")} CudaIndex */

/**
 * Represents a Cuda Warp. This class is meant to be used to 
 * describe specific warps in a block.
 * 
 * @memberof module:cuda
 */
class CudaWarp {
  
  /** @type CudaBlock */ #block
  /** @type Number    */ #index
  /** @type Number    */ #usableLanes
  /** @type Number    */ #unusableLanes

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
      this.#index = CudaIndex.linearize(index, block.dim)
    } else if (Number.isInteger(index)) {
      if ( index >= block.numWarps)
        throw new Error(`Invalid warp index '${index}' for block ${block.toString()}`)
      this.#index = index
    } else {
      throw new Error(`Invalid argument 'index'. Must be an Integer or CudaIndex instance`)
    }

    this.#block = block
    this.#usableLanes = this._computeUsableLanes(block, index)
    this.#unusableLanes = Limits.warpSize - this.#usableLanes
  }

  /** 
   * Compute the number of usable threads in a warp
   * @protected 
   * @param {CudaBlock} block
   * @param {Number|CudaIndex} warpIndex
   * */
  _computeUsableLanes(block, warpIndex) {
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
  getNumUsableLanes() { return this.#usableLanes}

  /**
   * Get the number of unusable threads in this warp
   * A warp might have unusable threads if it is the last warp in the block
   * and the block size is not a multiple of the warp size
   * 
   * @return {Number}
   */
  getNumUnusableLanes() { return this.#unusableLanes}


  /**
   * Retrieve the indices of the usable threads in the block
   * @returns {number[]}
   */
  getUsableLaneIndices() { 
    return [...Array(this.#usableLanes).keys()]
  }

  /**
   * Retrieve the index of the last usable thread
   * @returns {Number}
   */
  getLastUsableLaneIndex() {
    return this.getNumUnusableLanes() - 1
  }

  /**
   * Retrieve the indices of the unusable threads in the block
   * @returns {number[]}
   */
  getUnusableLaneIndices() {
    let res = []
    for ( let i = Limits.warpSize - 1; i >= this.#usableLanes; i-- )
      res.unshift(i)
    return res;
  }

  /**
   * Check if there are lanes in this warp  
   * @returns {Boolean}
   */
  hasUnusableLanes() {
    return this.getNumUnusableLanes() > 0
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
        && this.getNumUsableLanes() === other.getNumUsableLanes()
        && this.getNumUnusableLanes() === other.getNumUnusableLanes()  
  }

  /**
   * String representation of the warp
   * @param {Boolean} [short=false] If set a compact String representation is return
   * @returns {String}
   */
  toString(short=false) {
    return short ? `#${this.getIndex()}, ${this.getNumUsableLanes()}/${this.getNumUnusableLanes()}` 
      : `CudaWarp(block: ${this.#block.toString()}, id: ${this.getIndex()}, usable: ${this.getNumUsableLanes()})`
  }
}

module.exports = CudaWarp