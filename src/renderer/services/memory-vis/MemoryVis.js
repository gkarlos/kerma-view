/** @ignore @typedef {import("@renderer/models/memory/Memory")} Memory */
/** @ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")`} MemoryVisView */
/** @ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisModel")`} MemoryVisModel */

const MemoryVisView = require('@renderer/services/memory-vis/view/MemoryVisView')
const MemoryVisModel = require('@renderer/services/memory-vis/MemoryVisModel')

/**
 * Controller for a memory Visualization
 * @memberof module:memory-vis
 */
class MemoryVis {
  /** @type {String}         */ #id
  /** @type {MemoryVisModel} */ #model
  /** @type {MemoryVisView}  */ #view

  /**
   * Create a new MemoryVis instance
   * @param {Memory} memory 
   */
  constructor(memory) {
    this.#model  = new MemoryVisModel(memory)
    this.#view   = new MemoryVisView(this.#model)
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @type {String} */
  get id() { return this.#view.id }

  /** @type {MemoryVisModel} */ 
  get model() { return this.#model }

  /** @type {MemoryVisView} */
  get view() { return this.#view }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /**
   * @returns {MemoryVis} this
   */
  dispose() {
    //todo
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @returns {MemoryVisModel} */
  getModel() { return this.#model }

  /** @returns {MemoryVisView} */
  getView() { return this.#view }

  /** @returns {Memory} */
  getMemory() { return this.#model.memory }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /**
   * @param {MemoryVis} other 
   * @returns {Boolean}
   */
  equals(other) {
    return this.#model.equals(other.getModel())
  }
}

module.exports = MemoryVis