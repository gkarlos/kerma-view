const Service = require('@renderer/services/Service')
const App     = require('@renderer/app')
const MemoryVis = require('@renderer/services/memory-vis/MemoryVis')

/**@ignore @typedef {import("@renderer/services/memory-vis/MemoryVis")} MemoryVis */
/**@ignore @typeder {import("@renderer/models/memory/Memory")} Memory */
/**@ignore @typedef {import("@renderer/ui/memory/MemoryArea")} MemoryArea */

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
  /** @type {MemoryArea} */
  #memoryArea

  /**
   * Create a new MemoryVisService instance
   */
  constructor() {
    super("MemoryVisService")
    this.#visualizations = []
    this.#memoryArea = App.ui.memory
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
    return this.#visualizations.find(vis => vis.id === id)
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
   * @param {Memory} memory
   * @returns {MemoryVis|undefined}
   */
  create(memory) {
    if ( this.find(memory))
      return App.Logger.warn("[mem-vis-service] A visualization of the requested memory already exists")
    let vis = new MemoryVis(memory)
    App.Logger.debug("[vis]", "created", vis.id, "for", memory.toString())
    this.#visualizations.push(vis)
    this.#memoryArea.add(vis)
    return vis
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
   * @param {MemoryVis}
   * @returns {MemoryVisService} this
   */
  remove(memoryVis) {
    let found = false
    for ( let i = 0; i < this.#visualizations.length; ++i )
      if ( this.#visualizations[i].equals(memoryVis)) {
        found = true
        this.#visualizations.splice(i, 1)
        memoryVis.dispose()
        break
      }
    if ( !found)
      App.Logger.warn("[vis]", "Requested removal of unknown MemoryVis. No action taken" )
    return this
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