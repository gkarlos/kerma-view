const ComputeSelectionMode     = require('@renderer/services/compute-selection/ComputeSelectionMode')
const ComputeSelectionWarpView = require('@renderer/services/compute-selection/ComputeSelectionWarpView')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").ComputeSelectionOnWarpSelectCallback}   ComputeSelectionOnWarpSelectCallback */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").ComputeSelectionOnThreadSelectCallback} ComputeSelectionOnThreadSelectCallback */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").ComputeSelectionOnUnitSelectCallback}   ComputeSelectionOnUnitSelectCallback */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").ComputeSelectionOnBlockSelectCallback}  ComputeSelectionOnBlockSelectCallback */

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").} ComputeUnitSelection */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionMode").} ComputeUnitSelectionMode */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel").} ComputeUnitSelectionModel */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionWarpView").} ComputeSelectionWarpView */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionThreadView").} ComputeSelectionThreadView */
/** @ignore @typedef {import("@renderer/models/cuda/CudaLaunch")} CudaLaunch*/

/**
 * @memberof module:compute-selection
 */
class ComputeSelectionView {

  /** @type {ComputeUnitSelectionModel} */
  #model
  /** @type {ComputeSelectionWarpView} */
  #warpViewImpl
  /** @type {ComputeSelectionThreadView} */
  #threadViewImpl
  /** @type {JQuery} */
  #modeSelection
  /** @type {JQuery} */
  #blockSelection
  /** @type {Boolean} */
  #active
  /** @type {Boolean} */
  #enabled

  /**
   * Creates a new ComputeSelectionView
   * @param {ComputeUnitSelectionModel} model
   */
  constructor(model) {
    this.#model = model
    this.#warpViewImpl = new ComputeSelectionWarpView(model)
    this.#active = false
  }

  /**
   * Change the mode of this 
   * @param {ComputeUnitSelectionMode} mode 
   */
  setMode(mode) {

  }

  /**
   * 
   */
  getMode() {
    return this.#model.mode
  }

  clear() {
    this.#warpViewImpl.clear()
    // this.#threadViewImpl.clear()
  }

  isActive() {
    return this.#active
  }

  inWarpMode() {
    return this.#model.inWarpMode()
  }

  inThreadMode() {
    return this.#model.inThreadMode()
  }

  /**
   * Activate the view. I.e make it the currently 
   * displaying ComputeSelection view
   */
  activate() {
    console.log("activate")
    if ( !this.isActive()) {
      if ( this.inWarpMode())
        this.#warpViewImpl.activate()
      else
        this.#threadViewImpl.activate()

      //TODO activate BlockSelection
      //TODO activate ModeSelection
      this.#active = true

      // setTimeout(() => this.#warpViewImpl.deactivate(), 5000)
    }
    return this
  }

  /**
   * Deactivate the view. A deactivated view is only
   * hidden
   */
  deactivate() {
    if ( this.isActive()) {
      this.#warpViewImpl.deactivate()
      // this.#threadViewImpl.deactivate()
      //TODO deactivate BlockSelection
      //TODO deactivate ModeSelection
      this.#active = false
    }
    return this
  }

  /**
   * Allow user interaction
   * @returns {ComputeSelectionView} this
   */
  enable() {
    
  }

  /**
   * Prevent user interaction
   * @returns {ComputeSelectionView} this
   */
  disable() {

  }

  dispose() {

  }

  /**
   * Register a callback to be invoked when a block is selected
   * @param {ComputeSelectionOnBlockSelectCallback} A callback
   */
  onBlockSelect(callback) {
    // this.#emitter.on(Events.BlockSelect, callback)
    return this
  }

  /**
   * Register a callback to be invoked when a warp is selected
   * @param {ComputeSelectionOnWarpSelectCallback} callback 
   * @returns {ComputeSelectionView} this
   */
  onWarpSelect(callback) {
    this.#warpViewImpl.onSelect(callback)
    return this
  }

  /**
   * Register a callback to be invoken when a thread is selected
   * @param {ComputeSelectionOnThreadSelectCallback} callback
   * @returns {ComputeSelectionView} this 
   */
  onThreadSelect(callback) {
    this.#threadViewImpl.onThreadSelect(callback)
  }

  /** 
   * Register a callback to be invoken when a unit is selected
   * @param {ComputeSelectionOnUnitSelectCallback} A callback
   */
  onUnitSelect(callback) { 
    this.onWarpSelect(callback)
    this.onThreadSelect(callback)
    return this
  }
}

module.exports = ComputeSelectionView