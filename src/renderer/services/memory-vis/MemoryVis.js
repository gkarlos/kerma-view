/** @ignore @typedef {import("@renderer/models/memory/Memory")} Memory */
/** @ignore @typedef {impo`} */

/**
 * Controller for a memory Visualization
 * @memberof module:memory-vis
 */
class MemoryVis {

  /** @type {Memory} */ #memory

  /**
   * Create a new MemoryVis instance
   * @param {Memory} memory 
   */
  constructor(memory) {
    this.#memory = memory
  }

  /**@type {Memory}*/ get memory() { return this.#memory }

  /** @returns {Memory} */
  getMemory() {
    return this.#memory
  }
}

module.exports = MemoryVis