const Service = require('@renderer/services/Service')

/**@ignore @typedef {import("@renderer/services/memory-vis/MemoryVis")} MemoryVis */
/**@ignore @typeder {import("@renderer/models/memory/Memory")} Memory */

/**
 * @memberof module:memory-vis
 */
class MemoryVisService extends Service {
  
  /** @type {MemoryView[]} */
  #views

  /**
   * Create a new MemoryVisService instance
   */
  constructor() {
    super("MemoryViewService")
    console.log("Memory")
    this.#views = []
  }

  /**
   * Create a new memory view and return a handler to it
   * @param {Memory}
   * @returns {MemoryView}
   */
  create(memory) {

  }

  /**
   * @param {MemoryView}
   * @returns {MemoryViewService} this
   */
  dispose(memoryView) {

  }

  disposeAll() {

  }

  /**
   * Enable the Service
   * @returns {Me}
   */
  enable() {
    super.enable()
    return this
  }

  disable() {
    super.disable()
    return this
  }
}

module.exports = MemoryVisService