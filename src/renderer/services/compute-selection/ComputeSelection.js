const ComputeSelectionMode = require('@renderer/services/compute-selection/ComputeSelectionMode')
const ComputeSelectionView = require('@renderer/services/compute-selection/ComputeSelectionView')
const ComputeSelectionModel = require('@renderer/services/compute-selection/ComputeSelectionModel')
const ThreadMode = ComputeSelectionMode.Thread
const WarpMode = ComputeSelectionMode.Warp

/** @ignore @typedef {import("@renderer/services/compute-selection").ComputeSelectionOnModeChangeCallback} ComputeSelectionOnModeChangeCallback*/
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel")} ComputeSelectionModel */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionView")} ComputeSelectionView */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionMode")} ComputeSelectionMode */
/** @ignore @typedef {import("@renderer/models/cuda/CudaLaunch")} CudaLaunch*/
/** @ignore @typedef {import("@renderer/models/cuda/CudaThread")} CudaThread*/
/** @ignore @typedef {import("@renderer/models/cuda/CudaWarp")} CudaWarp*/

/**
 * A compute unit selection controller.
 * 
 * Instances of this class are meant to only be created by ComputeUnitSelectionService
 * and are returned by the service to be used as handlers.
 * 
 * @memberof module:compute-selection
 */
class ComputeSelection {
  
  /**@type {ComputeSelectionModel}*/ #model
  /**@type {ComputeSelectionView} */ #view
  /**@type {ComputeSelectionMode} */ #mode
  /**@type {Array.<ComputeSelectionOnModeChangeCallback>}*/#onModeChangeCallbacks

  /**
   * Create a new ComputeSelection
   * @param {CudaGrid} grid A CudaGrid
   * @param {CudaBlock} block A CudaBlock
   */
  constructor(grid, block) {
    this.#model = new ComputeSelectionModel(grid, block)
    this.#view  = new ComputeSelectionView(this.#model)
  }

  /** 
   * The model of this selection
   * @type {ComputeSelectionModel}
   */
  get model() { 
    return this.#model
  }

  /** Retrieve the view */
  get view() { 
    return this.#view
  }

  get grid() { 
    return this.#model.grid
  }

  get block() {
    return this.#model.block
  }

  /** 
   * The current mode 
   * @type {ComputeSelectionMode}
   */
  get mode() { 
    return this.#model.getMode()
  }

  activate() {
    this.#view.activate()
  }

  deactivate() {
    this.#view.deactivate()
  }

  enable() {
    this.#view.enable()
  }

  disable() {
    this.#view.disable()
  }

  dispose() {
    this.#view.dispose()
  }

  onBlockSelect(callback) {

  }

  onUnitSelect(callback) {
    this.#view.onUnitSelect(callback)
  }

  /** 
   * Register a callback to be fired when the unit selection changes mode 
   * @param {ComputeSelectionOnModeChangeCallback} callback A callback
   * @returns {ComputeSelection} this
   */
  onModeChange(callback) {
    if (typeof callback === 'function') {
      // this.#onModeChangeCallbacks.push(callback)
      this.#view.onModeChange(callback)
    }
    return this
  }

  /**
   * Change the mode of this compute unit selection
   * @param {ComputeSelectionMode} mode A new mode
   * @returns {Boolean} True if the new mode is successfully changed. False otherwise
   */
  setMode(mode) {
    if ( !(mode instanceof ComputeSelectionMode))
      throw new Error("Invalid argument 'mode'. Must be a ComputeSelectionMode")
    let oldMode = this.#model.mode
    if ( this.#model.setMode(mode)) {
      let newMode = mode
      this.view.setMode(newmode)
      this.#onModeChangeCallbacks.forEach(callbackfn => callbackfn( oldMode, newMode))
      return true
    }
    return false
  }

  hasSelected() {
    // return this.#selection !== undefined
  }

  select(x,y=1,z=1) {
  }

  clear() {
    this.#view.clear()
  }
  
  getSelected() { 
    // return this.#model.selection 
  }

  selectRandomUnit() {

  }

  get() {

  }

  equals(other) {
    return this.#model.equals(other.model)
  }
}

module.exports = ComputeSelection