const LaunchSelection = require('@renderer/services/launch-selection/LaunchSelection')
const Service = require('@renderer/services/Service')
const { Launch } = require('@renderer/models/cuda')

/**@ignore @typedef {import("@renderer/services/launch-selection/LaunchSelection").LaunchSelectionOnSelectCallback} LaunchSelectionOnSelectCallback */
/**@ignore @typedef {import("@renderer/models/cuda/CudaLaunch")} CudaLaunch */
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

  /**
   * Create a new KernelSelection for a given list of kernels
   * @param {CudaLaunch[]} launches An array of CudaLaunch objects
   * @param {Boolean} [makeCurrent] Make the selection the currently displayed selection
   * @returns {LaunchSelection}
   */
  create(launches, makeCurrent=false) {
    const selection = this.createEmpty(makeCurrent)
    launches.forEach(launch => selection.addLaunch(launch))
    return selection
  }

  /**
   * Create an empty LaunchSelection and optionally make it the current one
   * @param {Boolean} [makeCurrent] Make the selection the currently displayed selection
   * @returns {LaunchSelection}
   */
  createEmpty(makeCurrent=false) {
    const selection = new LaunchSelection()
    this.#defaultOnSelectCallbacks.forEach(callback => selection.onSelect(callback))
    this.#selections.push(selection)
    if ( makeCurrent)
      this.activate(selection)
    return selection
  }

  /**
   * 
   * @param {CudaKernel} kernel 
   * @param {Boolean} makeCurrent 
   */
  createForKernel(kernel, makeCurrent) {
    const selection = new LaunchSelection(kernel.launches)
    this.#defaultOnSelectCallbacks.forEach(callback => selection.onSelect(callback))
    this.#selections.push(selection)
    if ( makeCurrent)
      this.activate(selection)
    return selection
  }

  createMockForKernel(kernel) {
    //todo
  }

  /**
   * Retrieve the currently displaying selection
   * @returns {LaunchSelection}
   */
  getCurrent() { return this.#current }

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

  /**
   * Register a callback that will be hooken to every LaunchSelection created by the service
   * @param {...LaunchSelectionOnSelectCallback} callbacks
   * @returns {LaunchSelectionService} this
   */
  defaultOnSelect(...callbacks) {
    callbacks.forEach(callback => this.#defaultOnSelectCallbacks.push(callback))
    return this
  }
}

module.exports = LaunchSelectionService
