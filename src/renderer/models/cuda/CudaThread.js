const CudaIndex = require('@renderer/models/cuda/CudaIndex')
const CudaWarp = require('@renderer/models/cuda/CudaWarp')
const CudaLimits = require('@renderer/models/cuda/CudaLimits')

/** @ignore @typedef {import("@renderer/models/cuda/CudaBlock")} CudaBlock */
/** @ignore @typedef {import("@renderer/models/cuda/CudaWarp")}  CudaWarp  */
/** @ignore @typedef {import("@renderer/models/cuda/CudaIndex")} CudaIndex */

/**
 * Represents a Cuda thread.  This class is meant to be used to 
 * describe specific threads in a block.
 * 
 * @memberof module:cuda
 */
class CudaThread {
  /** @type {CudaBlock} */ #block
  /** @type {CudaIndex} */ #index
  /** @type {CudaIndex} */ #globalIndex
  /** @type {CudaWarp}  */ #warp
  
  /**
   * Create a new CudaThread instance
   * @param {CudaBlock} block The block this therad belongs to. This must refer to a specific block in the grid, i.e a block with an index
   * @param {CudaIndex|Number} index 
   */
  constructor(block, index) {
    if ( !block)
      throw new Error(`Missing required argument 'block'`)
    if ( index instanceof CudaIndex) {
      if ( index.x >= block.x)
        throw new Error(`Invalid thread index '${index.toString()}' for block '${block.toString()}'`)
      if ( index.is2D() && index.y >= block.y)
        throw new Error(`Invalid thread index '${index.toString()}' for block '${block.toString()}'`)
      this.#index = index
    } else if ( Number.isInteger(index)) {
      if ( index >= block.size)
        throw new Error(`Invalid thread index '${index}' for block '${block.toString()}'`)
      this.#index = new CudaIndex(index)
    } else {
      throw new Error(`Invalid argument 'index'. Must be an Integer or CudaIndex instance`)
    }

    // TODO #globalIndex = ?
    this.#block = block
    this.#warp = undefined
  }

  /** @type {CudaIndex} */
  get index() { return this.#index }

  /** @type {Number} */
  get x() { return this.#index.x }

  /** @type {Number} */
  get y() { return this.#index.y }

  /** @type {CudaIndex} */
  get globalIndex() { return this.#globalIndex }

  /** @type {Number} */
  get globalX() { return this.#globalIndex.x }

  /** @type {Number} */
  get globalY() { return this.#globalIndex.y }

  /**
   * Retrieve the index of this thread within its block
   * @returns {CudaIndex}
   */
  getIndex() {
    return this.#index
  }

  /**
   * Retrieve the global index of this thread
   * @returns {CudaIndex}
   */
  getGlobalIndex() {
    return this.#globalIndex
  }

  /**
   * Retrieve the block this thread is part of
   * @returns {CudaBlock}
   */
  getBlock() { return this.#block }

  /**
   * Retrieve the warp (within its block) this thread belongs to
   * @returns {CudaWarp}
   */
  getWarp() { 
    if ( this.#warp === undefined)
      this.#warp = new CudaWarp( this.#block, CudaIndex.linearize(this.#index, this.#block.dim) / CudaLimits.warpSize)
    return this.#warp
  }

  /**
   * Retrieve the lane of this thread within its warp
   * @returns {Number}
   */
  getLane() {
    return CudaIndex.linearize(this.index, this.getBlock().dim) % CudaLimits.warpSize
  }

  /**
   * Check if the lane that corresponds to this thread in the warp is usable.
   * @returns {Boolean}
   */
  inUsableLane() {
    return CudaIndex.linearize(this.index, this.getBlock().dim) <= this.getWarp().getLastUsableThread()
  }

  /**
   * Check if the lane that corresponds to this thread in the warp is always inactive.
   * i.e. this thread will never exist in an execution
   * @returns {Boolean}
   */
  inUnusableLane() {
    return CudaIndex.linearize(this.index, this.getBlock().dim) > this.getWarp().getLastUsableThread()
  }

  /**
   * Compare with another thread for equality
   * Two threads are considered equal if they belong to the same block and have the same index
   * within the block
   * @param {CudaThread} other 
   */
  equals(other) {
    return ( other instanceof CudaThread)
      && this.#block.equals(other.getBlock())
      && this.#index.equals(other.getIndex())
  }

  toString() {
    return `#${this.index.toString()}`
  }
}

module.exports = CudaThread