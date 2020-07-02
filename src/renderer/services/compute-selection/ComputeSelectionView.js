const ComputeSelectionMode      = require('@renderer/services/compute-selection/ComputeSelectionMode')
const ComputeSelectionModeView  = require('@renderer/services/compute-selection/ComputeSelectionModeView')
const ComputeSelectionWarpView  = require('@renderer/services/compute-selection/ComputeSelectionWarpView')
const ComputeSelectionBlockView = require('@renderer/services/compute-selection/ComputeSelectionBlockView')
const EventEmitter = require('events').EventEmitter
const Events       = require('@renderer/services/compute-selection/Events')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").ComputeSelectionOnWarpSelectCallback}   ComputeSelectionOnWarpSelectCallback */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").ComputeSelectionOnThreadSelectCallback} ComputeSelectionOnThreadSelectCallback */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").ComputeSelectionOnUnitSelectCallback}   ComputeSelectionOnUnitSelectCallback */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").ComputeSelectionOnBlockSelectCallback}  ComputeSelectionOnBlockSelectCallback */

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").} ComputeUnitSelection */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionMode").} ComputeSelectionMode */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel").} ComputeSelectionModel */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionWarpView").} ComputeSelectionWarpView */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionThreadView").} ComputeSelectionThreadView */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionBlockView")} ComputeSelectionBlockView */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModeView")} ComputeSelectionModeView */
/** @ignore @typedef {import("@renderer/models/cuda/CudaLaunch")} CudaLaunch */

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
  /** @type {ComputeSelectionModeView} */
  #modeViewImpl
  /** @type {ComputeSelectionBlockView} */
  #blockViewImpl
  /** @type {Boolean} */
  #active
  /** @type {Boolean} */
  #enabled
  /** @type {EventEmitter} */
  #emitter

  /**
   * Creates a new ComputeSelectionView
   * @param {ComputeUnitSelectionModel} model
   */
  constructor(model) {
    this.#emitter = new EventEmitter()
    this.#model = model
    this.#blockViewImpl = new ComputeSelectionBlockView(model)
    this.#modeViewImpl = new ComputeSelectionModeView(model)
    this.#warpViewImpl = new ComputeSelectionWarpView(model)


    let self = this
    this.#warpViewImpl.onSelect( warp => self.#emitter.emit(Events.UnitSelect, warp, ComputeSelectionMode.Warp))
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
    if ( !this.isActive()) {
      if ( this.inWarpMode())
        this.#warpViewImpl.activate()
      else
        this.#threadViewImpl.activate()

      this.#blockViewImpl.activate()
      this.#modeViewImpl.activate()

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
      this.#blockViewImpl.deactivate()
      this.#modeViewImpl.deactivate()
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
    // this.#threadViewImpl.onThreadSelect(callback)
  }

  /** 
   * Register a callback to be invoken when a unit is selected
   * @param {ComputeSelectionOnUnitSelectCallback} A callback
   */
  onUnitSelect(callback) { 
    this.#emitter.on(Events.UnitSelect, callback)
    return this
  }
}

module.exports = ComputeSelectionView