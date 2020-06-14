const ComputeUnitSelectionMode = require('./ComputeUnitSelectionMode')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel")} ComputeUnitSelectionModel */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeUnitSelectionView")} ComputeUnitSelectionView */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeUnitSelectionMode")} ComputeUnitSelectionMode */

/**
 * This callback is fired when the compute unit selection changes mode
 * @callback ComputeUnitSelectionOnModeChange
 * @param {ComputeUnitSelectionMode} oldMode The previous mode
 * @param {ComputeUnitSelectionMode} newMode The new mode
 * @returns {void}
 */

/**
 * A compute unit selection controller.
 * 
 * Instances of this class are meant to only be created by ComputeUnitSelectionService
 * and are returned by the service to be used as handlers.
 * 
 * @memberof module:compute-unit-selection
 */
class ComputeUnitSelection {
  static ThreadMode = new ComputeUnitSelectionMode('thread')
  static WarpMode = new ComputeUnitSelectionMode('warp')
  
  /**@type {ComputeUnitSelectionModel}*/ #model
  /**@type {ComputeUnitSelectionView} */ #view
  /**@type {ComputeUnitSelectionMode} */ #mode
  /**@type {Array.<ComputeUnitSelectionOnModeChange>}*/#onModeChangeCallbacks

  /**
   * Create a new ComputeUnitSelection
   * @param {ComputeUnitSelectionModel} model The ComputeUnitSelection model
   * @param {ComputeUnitSelectionView} view The ComputeUnitSelection view
   */
  constructor(  mode=ComputeUnitSelection.ThreadMode) {
    this.#model = model
    this.#view  = view
    this.#onModeChangeCallbacks = []
  }

  /** Retrieve the model */
  get model() { return this.#model}

  /** Retrieve the view */
  get view() { return this.#view}

  /** Retrieve the current mode */
  get mode() { return this.#mode}


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
   * @param {ComputeUnitSelectionMode} mode A new mode
   * @returns {Boolean} True if the new mode is successfully changed. False otherwise
   */
  setMode(mode) {
    let oldMode = this.#model.mode
    if ( this.#mode.setMode(mode)) {
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

module.exports = ComputeUnitSelection