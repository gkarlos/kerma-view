const LaunchSelection = require('@renderer/services/launch-selection/LaunchSelection')
const Service = require('@renderer/services/Service')
const { Launch } = require('@renderer/models/cuda')

/**@ignore @typedef {import("@renderer/services/launch-selection/LaunchSelection").LaunchSelectionOnSelectCallback} LaunchSelectionOnSelectCallback */
/**@ignore @typedef {import("@renderer/models/cuda/CudaKernel")} CudaKernel */

class LaunchSelectionService extends Service {

  /** @type {LaunchSelection[]} */
  #selections
  /** @type {LaunchSelection} */
  #current
  /** @type {LaunchSelectionOnSelectCallback[]} */
  #defaultOnSelectCallbacks

  constructor() {
    super("LaunchSelectionService")
    this.#selections = []
    this.#current = null
    this.#defaultOnSelectCallbacks = []
  }

  create(launches, makeCurrent=false) {
    //TODO
  }

  /**
   * Create an empty LaunchSelection and optionally make it the current one
   * @param {Boolean} [makeCurrent] Make the selection the currently displayed selection
   * @returns {KernelSelection}
   */
  createEmpty(makeCurrent=false) {
    const selection = new LaunchSelection()
    this.#defaultOnSelectCallbacks.forEach(callback => selection.onSelect(callback))
    this.#selections.push(selection)
    if ( makeCurrent)
      this.activate(selection)
    return selection
  }

  activate(launchSelection) {
    if ( launchSelection && this.#current !== launchSelection) {
      if ( !this.#selections.find(sel => sel === launchSelection))
        this.#selections.push(launchSelection)
      this.#current && this.#current.dispose(true)
      this.#current = launchSelection
      this.#current.view.render()
    }
    return this
  }
}

module.exports = LaunchSelectionService
