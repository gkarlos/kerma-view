const CuIndex = require('@renderer/models/cuda/CuIndex')
const CuWarp = require('@renderer/models/cuda/CuWarp')
const CuLimits = require('@renderer/models/cuda/CuLimits')

/** @ignore @typedef {import("@renderer/models/cuda/CuBlock")} CuBlock */
/** @ignore @typedef {import("@renderer/models/cuda/CuWarp")}  CuWarp  */
/** @ignore @typedef {import("@renderer/models/cuda/CuIndex")} CuIndex */

/**
 * Represents a Cuda thread.  This class is meant to be used to 
 * describe specific threads in a block.
 * 
 * @memberof module:cuda
 */
class CuThread {
  /** @type {CuBlock} */ #block
  /** @type {CuIndex} */ #index
  /** @type {CuIndex} */ #globalIndex
  /** @type {CuWarp}  */ #warp
  
  /**
   * Create a new CuThread instance
   * @param {CuBlock} block The block this therad belongs to. This must refer to a specific block in the grid, i.e a block with an index
   * @param {CuIndex|Number} index 
   */
  constructor(block, index) {
    if ( !block)
      throw new Error(`Missing required argument 'block'`)
    if ( index instanceof CuIndex) {
      if ( index.x >= block.x)
        throw new Error(`Invalid thread index '${index.toString()}' for block '${block.toString()}'`)
      if ( index.is2D() && index.y >= block.y)
        throw new Error(`Invalid thread index '${index.toString()}' for block '${block.toString()}'`)
      this.#index = index
    } else if ( Number.isInteger(index)) {
      if ( index >= block.size)
        throw new Error(`Invalid thread index '${index}' for block '${block.toString()}'`)
      this.#index = new CuIndex(index)
    } else {
      throw new Error(`Invalid argument 'index'. Must be an Integer or CuIndex instance`)
    }

    // TODO #globalIndex = ?
    this.#block = block
    this.#warp = undefined
  }

  /** @type {CuIndex} */
  get index() { return this.#index }

  /** @type {Number} */
  get x() { return this.#index.x }

  /** @type {Number} */
  get y() { return this.#index.y }

  /** @type {CuIndex} */
  get globalIndex() { return this.#globalIndex }

  /** @type {Number} */
  get globalX() { return this.#globalIndex.x }

  /** @type {Number} */
  get globalY() { return this.#globalIndex.y }

  /**
   * Retrieve the index of this thread within its block
   * @returns {CuIndex}
   */
  getIndex() {
    return this.#index
  }

  /**
   * Retrieve the global index of this thread
   * @returns {CuIndex}
   */
  getGlobalIndex() {
    return this.#globalIndex
  }

  /**
   * Retrieve the block this thread is part of
   * @returns {CuBlock}
   */
  getBlock() { return this.#block }

  /**
   * Retrieve the warp (within its block) this thread belongs to
   * @returns {CuWarp}
   */
  getWarp() { 
    if ( this.#warp === undefined)
      this.#warp = new CuWarp( this.#block, CuIndex.linearize(this.#index, this.#block.dim) / CuLimits.warpSize)
    return this.#warp
  }

  /**
   * Retrieve the lane of this thread within its warp
   * @returns {Number}
   */
  getLane() {
    return CuIndex.linearize(this.index, this.getBlock().dim) % CuLimits.warpSize
  }

  /**
   * Check if the lane that corresponds to this thread in the warp is usable.
   * @returns {Boolean}
   */
  inUsableLane() {
    return CuIndex.linearize(this.index, this.getBlock().dim) <= this.getWarp().getLastUsableThread()
  }

  /**
   * Check if the lane that corresponds to this thread in the warp is always inactive.
   * i.e. this thread will never exist in an execution
   * @returns {Boolean}
   */
  inUnusableLane() {
    return CuIndex.linearize(this.index, this.getBlock().dim) > this.getWarp().getLastUsableThread()
  }

  /**
   * Compare with another thread for equality
   * Two threads are considered equal if they belong to the same block and have the same index
   * within the block
   * @param {CuThread} other 
   */
  equals(other) {
    return ( other instanceof CuThread)
      && this.#block.equals(other.getBlock())
      && this.#index.equals(other.getIndex())
  }

  toString() {
    return `#${this.index.toString()}`
  }
}

module.exports = CuThread