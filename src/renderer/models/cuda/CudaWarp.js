const Limits = require('@renderer/models/cuda/CudaLimits')
const CudaIndex = require('@renderer/models/cuda/CudaIndex')
const CudaLaunch = require('./CudaLaunch')

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
    this.#usableLanes   = this._computeUsableLanes(block, index)
    this.#unusableLanes = Limits.warpSize - this.#usableLanes
  }

  /** @type {Number} */
  static get Size() { return 32 }

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
   * Get the number of usable lanes in this warp
   * A warp might have unusable lanes if it is the last warp in the block
   * and the block size is not a multiple of the warp size
   * 
   * @return {Number}
   */
  getNumUsableLanes() { return this.#usableLanes}

  /**
   * Get the number of unusable lanes in this warp
   * A warp might have unusable threads if it is the last warp in the block
   * and the block size is not a multiple of the warp size
   * 
   * @return {Number}
   */
  getNumUnusableLanes() { return this.#unusableLanes}


  /**
   * Retrieve the indices of the usable lanes in the warp
   * @returns {number[]}
   */
  getUsableLaneIndices() { 
    return [...Array(this.#usableLanes).keys()]
  }

  /**
   * Retrieve the index of the last usable lane
   * @returns {Number}
   */
  getLastUsableLaneIndex() {
    return this.getNumUsableLanes() - 1
  }

  /**
   * Retrieve the indices of the unusable lanes in the warp
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
   * Retrieve the linear index, w.r.t its block, of the first thread in this warp
   * I.e the thread id of the thread at lane 0
   */
  getFirstThreadIndex() {
    return this.getIndex() * Limits.warpSize
  }

  /**
   * Retrieve the linear index, w.r.t its block, of the last thread in this warp
   * I.e the thread id of the thead at lane 31
   */
  getLastThreadIndex() {
    return (this.getIndex() + 1) * Limits.warpSize - 1
  }

  /**
   * Retrieve the linear index, w.r.t its block of the the thread at the last
   * usable lane of the warp
   */
  getLastUsableThreadIndex() {
    return this.getFirstThreadIndex() + this.getLastUsableLaneIndex()
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
    return short ? `#${this.getIndex()}, ${this.getNumUsableLanes()}/${this.getNumUnusableLanes()}, [${this.getFirstThreadIndex()}, ${this.hasUnusableLanes()? this.getLastUsableThreadIndex() + "/" : ""}${this.getLastThreadIndex()}]` 
      : `CudaWarp(id: ${this.getIndex()}, block: ${this.#block.toString()}, usable: ${this.getNumUsableLanes()})`
  }
}

module.exports = CudaWarp