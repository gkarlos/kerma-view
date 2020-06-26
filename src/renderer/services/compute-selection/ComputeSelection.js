const ComputeSelectionMode = require('@renderer/services/compute-selection/ComputeSelectionMode')
const ComputeSelectionView = require('@renderer/services/compute-selection/ComputeSelectionView')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel")} ComputeSelectionModel */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionView")} ComputeSelectionView */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionMode")} ComputeSelectionMode */

/**
 * This callback is fired when the compute unit selection changes mode
 * @callback ComputeSelectionOnModeChangeCallback
 * @param {ComputeSelectionMode} oldMode The previous mode
 * @param {ComputeSelectionMode} newMode The new mode
 * @returns {void}
 */

const ThreadMode = ComputeSelectionMode.Thread
const WarpMode = ComputeSelectionMode.Warp

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
   * @param {ComputeSelectionModel} model The ComputeUnitSelection model
   * @param {ComputeUnitSelectionView} view The ComputeUnitSelection view
   */
  constructor(model) {
    this.#model = model
    this.#view  = new ComputeSelectionView(model)
  }

  /** Retrieve the model */
  get model() { 
    return this.#model
  }

  /** Retrieve the view */
  get view() { 
    return this.#view
  }

  /** 
   * The current mode 
   * @type {ComputeSelectionMode}
   */
  get mode() { 
    return this.#model.getMode()
  }

  activate() {
    this.#view.render()
  }

  /** 
   * Register a callback to be fired when the unit selection changes mode 
   * @param {ComputeUnitSelectionOnModeChange} callback A callback
   * @returns {Boolean} Whether the callback was registered correctly
   */
  onModeChange(callback) {
    if (typeof callback === 'function') {
      this.#onModeChangeCallbacks.push(callback)
      return true
    }
    return false
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

  clearSelected() {
    // this.#selection = undefined
  }
  
  getSelected() { 
    // return this.#model.selection 
  }

  selectRandomUnit() {

  }

  get() {

  }
}

module.exports = ComputeSelection