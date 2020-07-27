const {uuid} = require('@renderer/util/random')

/** @ignore @typedef {import("@renderer/models/memory/Memory")} Memory */
/** @ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")`} MemoryVisView */

const MemoryVisView = require('@renderer/services/memory-vis/view/MemoryVisView')

/**
 * Controller for a memory Visualization
 * @memberof module:memory-vis
 */
class MemoryVis {

  /** @type {Memory} */        #memory
  /** @type {String} */        #id
  /** @type {MemoryVisView} */ #view

  /**
   * Create a new MemoryVis instance
   * @param {Memory} memory 
   */
  constructor(memory) {
    this.#memory = memory
    this.#view   = new MemoryVisView(memory)
  }

  /** @type {String} */
  get id() { return this.#view.id }

  /**@type {Memory}*/ get memory() { return this.#memory }


  /**
   * @returns {MemoryVis} this
   */
  dispose() {
    //todo
  }





  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @returns {MemoryVisView} */
  get view() { return this.#view }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @returns {MemoryVisView} */
  getView() { return this.#view }

  /** @returns {Memory} */
  getMemory() { return this.#memory }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /**
   * @param {MemoryVis} other 
   * @returns {Boolean}
   */
  equals(other) {
    return this.#memory.equals(other.getMemory())
  }
}

module.exports = MemoryVis