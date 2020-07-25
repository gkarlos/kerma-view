const {uuid} = require('@renderer/util/random')

/** @ignore @typedef {import("@renderer/models/memory/Memory")} Memory */
/** @ignore @typedef {impo`} */


/**
 * Controller for a memory Visualization
 * @memberof module:memory-vis
 */
class MemoryVis {

  /** @type {Memory} */ #memory
  /** @type {String} */ #id

  /**
   * Create a new MemoryVis instance
   * @param {Memory} memory 
   */
  constructor(memory) {
    this.#memory = memory
    this.#id = uuid(10)
  }

  /** @type {String} */
  get id() { return this.#id }

  /**@type {Memory}*/ get memory() { return this.#memory }

  /** @returns {Memory} */
  getMemory() {
    return this.#memory
  }

  /**
   * @returns {MemoryVis} this
   */
  dispose() {
    //todo
  }

  /**
   * @param {MemoryVis} other 
   * @returns {Boolean}
   */
  equals(other) {
    return this.#memory.equals(other.getMemory())
  }
}

module.exports = MemoryVis