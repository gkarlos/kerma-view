const ComputeSelectionMode       = require('@renderer/services/compute-selection/ComputeSelectionMode')
const ComputeSelectionModeView   = require('@renderer/services/compute-selection/ComputeSelectionModeView')
const ComputeSelectionWarpView   = require('@renderer/services/compute-selection/ComputeSelectionWarpView')
const ComputeSelectionThreadView = require('@renderer/services/compute-selection/ComputeSelectionThreadView')
const ComputeSelectionBlockView  = require('@renderer/services/compute-selection/ComputeSelectionBlockView')
const EventEmitter = require('events').EventEmitter
const Events       = require('@renderer/services/compute-selection/Events')

/** @ignore @typedef {import("@renderer/services/compute-selection").ComputeSelectionOnWarpSelectCallback}   ComputeSelectionOnWarpSelectCallback */
/** @ignore @typedef {import("@renderer/services/compute-selection").ComputeSelectionOnThreadSelectCallback} ComputeSelectionOnThreadSelectCallback */
/** @ignore @typedef {import("@renderer/services/compute-selection").ComputeSelectionOnUnitSelectCallback}   ComputeSelectionOnUnitSelectCallback */
/** @ignore @typedef {import("@renderer/services/compute-selection").ComputeSelectionOnBlockSelectCallback}  ComputeSelectionOnBlockSelectCallback */
/** @ignore @typedef {import("@renderer/services/compute-selection").ComputeSelectionOnModeChangeCallback}  ComputeSelectionOnModeChangeCallback */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").} ComputeUnitSelection */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel").} ComputeSelectionModel */
/** @ignore @typedef {import("@renderer/models/cuda/CudaLaunch")} CudaLaunch */

/**
 * @memberof module:compute-selection
 */
class ComputeSelectionView {

  /** @type {ComputeUnitSelectionModel}  */ #model
  /** @type {ComputeSelectionWarpView}   */ #warpViewImpl
  /** @type {ComputeSelectionThreadView} */ #threadViewImpl
  /** @type {ComputeSelectionModeView}   */ #modeViewImpl
  /** @type {ComputeSelectionBlockView}  */ #blockViewImpl
  /** @type {Boolean} */ #active
  /** @type {Boolean} */ #enabled
  /** @type {EventEmitter} */ #emitter

  /**
   * Creates a new ComputeSelectionView
   * @param {ComputeUnitSelectionModel} model
   */
  constructor(model) {
    this.#emitter = new EventEmitter()
    this.#model = model
    this.#blockViewImpl  = new ComputeSelectionBlockView(model)
    this.#modeViewImpl   = new ComputeSelectionModeView(model)
    this.#warpViewImpl   = new ComputeSelectionWarpView(model)
    this.#threadViewImpl = new ComputeSelectionThreadView(model)




    let self = this
    
    this.#modeViewImpl.onChange((oldMode, newMode) => {
      if ( newMode.equals(ComputeSelectionMode.Thread)) {
        self.#warpViewImpl.deactivate()
        self.#threadViewImpl.activate()
      } else {
        self.#threadViewImpl.deactivate()
        self.#warpViewImpl.activate()
      }
    })

    this.#warpViewImpl.onSelect( warp => self.#emitter.emit(Events.UnitSelect, warp, ComputeSelectionMode.Warp))
    this.#active = false
    this.#enabled = false
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

  isEnabled() {

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
      if ( this.inWarpMode()) {
        this.#warpViewImpl.activate()
        this.#threadViewImpl.deactivate()
      } else {
        this.#threadViewImpl.activate()
        this.#warpViewImpl.deactivate()
      }
        
      this.#blockViewImpl.activate()
      this.#modeViewImpl.activate()
      this.#active = true
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
      this.#threadViewImpl.deactivate()
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
    if ( !this.isEnabled()) {    
      console.log
      // this.#warpViewImpl.enable()
      this.#blockViewImpl.enable()
      this.#modeViewImpl.enable()
      this.#enabled = true
    }
    return this
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
   * @param {ComputeSelectionOnBlockSelectCallback} callback A callback
   * @returns {ComputeSelectionView} this
   */
  onBlockSelect(callback) {
    // this.#emitter.on(Events.BlockSelect, callback)
    return this
  }

  /**
   * Register a callback to be invoked when a warp is selected
   * @param {ComputeSelectionOnWarpSelectCallback} callback A callback
   * @returns {ComputeSelectionView} this
   */
  onWarpSelect(callback) {
    this.#warpViewImpl.onSelect(callback)
    return this
  }

  /**
   * Register a callback to be invoked when a thread is selected
   * @param {ComputeSelectionOnThreadSelectCallback} callback
   * @returns {ComputeSelectionView} this
   */
  onThreadSelect(callback) {
    // this.#threadViewImpl.onThreadSelect(callback)
  }

  /** 
   * Register a callback to be invoked when a unit is selected
   * @param {ComputeSelectionOnUnitSelectCallback} callback A callback
   * @returns {ComputeSelectionView} this
   */
  onUnitSelect(callback) { 
    this.#emitter.on(Events.UnitSelect, callback)
    return this
  }

  /**
   * Register a callback to be invoked when the mode changes
   * @param {ComputeSelectionOnModeChangeCallback} callback A callback
   * @returns {ComputeSelectionView} this
   */
  onModeChange(callback) {
    this.#modeViewImpl.onChange(callback)
    return this;
  }
}

module.exports = ComputeSelectionView