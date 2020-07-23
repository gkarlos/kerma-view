const Service = require('@renderer/services/Service')

/**@ignore @typedef {import("@renderer/services/memory-vis/MemoryVis")} MemoryVis */
/**@ignore @typeder {import("@renderer/models/memory/Memory")} Memory */

/**
 * The memory visualization service
 * This service can be used to visualize some memory (see {@link module:memory.Memory})
 * The service mentains no context, i.e it will display the memory and return a controller
 * to it; it is not aware for instance which kernel the memory belongs too etc. This means
 * that when analysis for a different kernel takes place, the current visualization must
 * be removed explicitely. See {@link module:memory-vis.MemoryVisService#removeAll}
 * @memberof module:memory-vis
 */
class MemoryVisService extends Service {
  
  /** @type {MemoryVis[]} */
  #visualizations

  /**
   * Create a new MemoryVisService instance
   */
  constructor() {
    super("MemoryViewService")
    this.#visualizations = []
  }

  /**
   * Create a new memory view and return a handler to it
   * @param {Memory}
   * @returns {MemoryView}
   */
  create(memory) {

  }

  /**
   * 
   */
  getAll() {

  }

  getForMemory(memory) {

  }

  removeAll() {

  }

  /**
   * @param {MemoryView}
   * @returns {MemoryViewService} this
   */
  remove(memoryView) {

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