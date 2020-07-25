const Service = require('@renderer/services/Service')
const App     = require('@renderer/app')
const MemoryVis = require('@renderer/services/memory-vis/MemoryVis')

/**@ignore @typedef {import("@renderer/services/memory-vis/MemoryVis")} MemoryVis */
/**@ignore @typeder {import("@renderer/models/memory/Memory")} Memory */

/**
 * The memory visualization service
 * This service can be used to visualize some memory (see {@link module:memory.Memory})
 * The service mentains no context, i.e it will only create and render the memory and 
 * return a controller to it. This means that when analysis for a different kernel takes place, 
 * the current visualization(s) must be removed explicitely. See {@link module:memory-vis.MemoryVisService#removeAll}
 * The service only mentains a list of the currently open visualizations and an API to query them
 * @memberof module:memory-vis
 */
class MemoryVisService extends Service {
  
  /** @type {MemoryVis[]} */
  #visualizations

  /**
   * Create a new MemoryVisService instance
   */
  constructor() {
    super("MemoryVisService")
    this.#visualizations = []
  }

  /** @returns {MemoryVis|undefined} */
  find(memory) {
    return this.#visualizations.find(vis => vis.getMemory().equals(memory))
  }

  /** @returns {MemoryVis|undefined} */
  findByName(name) {
    return this.#visualizations.find(vis => 
        vis.getMemory().getSrc() && (vis.getMemory().getSrc().getName() === name))
  }

  /** @returns {MemoryVis|undefined} */
  findById(id) {

  }

  /** @returns {Memory[]} */
  getAll() {
    return this.#visualizations
  }

  /** @returns {String[]} */
  getAllNames() {
    let res = []
    this.#visualizations.forEach(vis => {
      let src = vis.getMemory().getSrc()
      res.push( src !== undefined? src.getName() : "")
    })
    return res
  }

  /**
   * Create a new memory view and return a handler to it
   * @param {Memory}
   * @returns {MemoryView|undefined}
   */
  create(memory) {
    if ( this.find(memory))
      return App.Logger.warn("[mem-vis-service] A visualization of the requested memory already exists")
    let res = new MemoryVis(memory)
    //toto
    return res
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