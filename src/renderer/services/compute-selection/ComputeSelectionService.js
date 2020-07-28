const Service           = require('@renderer/services').Service
const ComputeSelection  = require('@renderer/services/compute-selection/ComputeSelection')
const App     = require('@renderer/app')
const ComputeSelectionMode = require('./ComputeSelectionMode')

/** @ignore @typedef {import("@renderer/models/cuda/CuLaunch")} CuLaunch */
/** @ignore @typedef {import("@renderer/models/cuda/CuGrid")}   CuGrid   */
/** @ignore @typedef {import("@renderer/models/cuda/CuBlock")}  CuBlock  */
/** @ignore @typedef {import("@renderer/models/cuda/CuThread")} CuThread */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection")} ComputeSelection */
/** @ignore @typedef {import("@renderer/services/compute-selection/").ComputeSelectionOnBlockChangeCallback}  ComputeSelectionOnBlockChangeCallback */
/** @ignore @typedef {import("@renderer/services/compute-selection/").ComputeSelectionOnUnitSelectCallback }  ComputeSelectionOnUnitSelectCallback  */
/** @ignore @typedef {import("@renderer/services/compute-selection/").ComputeSelectionOnModeChangeCallback }  ComputeSelectionOnModeChangeCallback  */

const TAG = "[compute-selection]"

/**
 * This service handles compute unit selection.
 * ComputeUnitSelection objects are created and stored internally.
 * At any gived time a single selection can be activated.
 * 
 * @memberof module:compute-selection
 * @extends Service
 */
class ComputeSelectionService extends Service {

  /** @type {ComputeSelection[]} */
  #selections
  /** @type {ComputeSelection} */
  #current
  /** @type {ComputeSelectionOnBlockChangeCallback[]} */
  #defaultOnBlockChangeCallbacks
  /** @type {ComputeSelectionOnUnitSelectCallback[]} */
  #defaultOnUnitSelectCallbacks
  /** @type {ComputeSelectionOnModeChangeCallback[]} */
  #defaultOnModeChangeCallbacks

  /**
   * Create a new ComputeSelectionService instance
   */
  constructor() {
    super('ComputeSelectionService')
    this.#selections = []
    this.#current = undefined
    this.#defaultOnBlockChangeCallbacks = []
    this.#defaultOnUnitSelectCallbacks  = []
    this.#defaultOnModeChangeCallbacks  = []
  }

  /**
   * Enable the service
   * @returns {ComputeSelectionService} this
   */
  enable() {
    super.enable()
    return this
  }

  /**
   * Disable the service
   * @returns {ComputeSelectionService} this
   */
  disable() {
    super.disable()
    return this
  }

  /**
   * Check if a selection exists in the service and if so return it
   * @param {ComputeSelection} computeSelection
   * @returns {ComputeSelection|undefined} The ComputeSelection if found. `undefined` otherwise 
   */
  lookup(computeSelection) {
    return this.#selections.find(sel => sel.equals(computeSelection))
  }

  /**
   * Check if a selection for a given launch exists and if so return it
   * @param {CuLaunch} launch
   * @returns {ComputeSelection|undefined}
   */
  lookupForLaunch(launch) {
    return this.#selections.find(sel => sel.model.launch.equals(launch))
  }

  /**
   * Create a new ComputeSelection for a given kernel launch
   * @param {CuLaunch} launch
   * @param {Boolean} activate immediately activate this selection upon creation
   * @returns {ComputeSelection}
   */
  createForLaunch(launch, activate=false) {
    let selection = new ComputeSelection(launch)

    this.#defaultOnBlockChangeCallbacks.forEach(cb => selection.onBlockChange(cb))
    this.#defaultOnUnitSelectCallbacks.forEach(cb => selection.onUnitSelect(cb))
    this.#defaultOnModeChangeCallbacks.forEach(cb => selection.onModeChange(cb))
    this.#selections.push(selection)

    if ( activate) {
      this.activate(selection)
    }
      

    return selection
  }

  /**
   * Lookup the saved selections if one exists for the provided kernel launch and if so use it.
   * If none exists one will be created
   * @param {CuLaunch} launch 
   * @param {Boolean} activate
   * @returns {ComputeSelection}
   */
  getForLaunch(launch, activate=false) {
    let lookup = this.lookupForLaunch(launch, activate)
    if ( lookup ) {
      App.Logger.debug(TAG, `Found cached for: ${lookup.model.launch.toString()}`)
      return lookup
    }
    App.Logger.debug(TAG, `Creating new for: ${launch.toString()}`)
    return this.createForLaunch(launch, activate)
  }

  /**
   * Discard a ComputeSelection
   * A discarded selection can no longer be activated
   * @param {ComputeSelection} computeSelection A ComputeSelectio
   * @returns {Boolean} False if the selection was not created through the service, or is not currently
   *                    part of it (was disposed earlier). True otherwise
   */
  dispose(computeSelection) {
    if ( !computeSelection)
      return false

    for ( let i = 0; i < this.#selections.length; ++i ) {
       
      if (computeSelection.equals(this.#selections[i])) {
        computeSelection.dispose()
        this.#selections.splice(i, 1)
        return true
      }
    }

    return false
  }

  /**
   * Discard the currently active ComputeSelection
   * @returns {ComputeSelectionService} this
   */
  disposeCurrent() {
    App.Logger.debug(TAG, "Disposing Current ComputeSelection")
    this.dispose(this.#current)
    this.#current = null
    return this
  }

  /**
   * Discard all stored selections
   * @returns {ComputeSelectionService} this
   */
  disposeAll() {
    App.Logger.debug(TAG, "Disposing all ComputeSelections")
    
    //dispose current first
    this.#current && this.#current.dispose()
    
    //dispose the rest
    for ( let i = 0; i < this.#selections.length; ++i) {
      if ( this.#selections[i].equals(this.#current)) 
        continue //current disposed already
      this.#selections[i].dispose()
    }

    this.#selections = []
    this.#current = undefined
  }

  /**
   * Make a ComputeSelection the currently active one.
   * The selection will be activated only if it is currently part of the service (i.e was not disposed)
   * @param {ComputeSelection} selection
   * @param {Boolean} [enable=true] Immediately enable the service
   * @returns {ComputeSelectionService} this
   * @throws {Error} The selection is not part of the service
   */
  activate(selection, enable=true) {
    if ( !this.lookup(selection))
      throw new Error("requested selection currently not part of the service")
    this.#current && this.deactivate(this.#current)
    this.#current = selection
    !selection.isActive() && selection.activate()
    if ( enable)
      selection.enable()
    return this
  }
  
  /**
   * Deactivate a selection
   * @param {ComputeSelection} computeSelection 
   * @returns {ComputeSelectionService}
   */
  deactivate(computeSelection) {
    if ( !computeSelection)
      return false

    for ( let i = 0; i < this.#selections.length; ++i ) {

      if (computeSelection.equals(this.#selections[i])) {
        computeSelection.deactivate()
        return true
      }
    }

    return false
  }

  /**
   * @returns {ComputeSelectionService}
   */
  deactivateCurrent() {
    App.Logger.debug(TAG, "Deactivating Current ComputeSelection")
    this.deactivate(this.#current)
    this.#current = null
    return this
  }

  /**
   * Retrieve the currently active selection
   * @returns {ComputeSelection|undefined}
   */
  getCurrent() {
    return this.#current
  }

  /**
   * Register a default callback to be fired when a block is selected
   * Default callbacks are hooked to every ComputeSelection created by the service
   * 
   * @param {...ComputeSelectionOnBlockChangeCallback}
   * @returns {void}
   */
  defaultOnBlockChange(...callbacks) {
    callbacks.forEach( callback => this.#defaultOnBlockChangeCallbacks.push(callback))
    return this
  }

  /**
   * Register default callback(s) to be fired when a unit (warp of thread) is selected
   * Default callbacks are hooked to every ComputeSelection created by the service
   * @param {...ComputeSelectionOnUnitSelectCallback}
   * @returns {ComputeSelectionService} this
   */
  defaultOnUnitSelect(...callbacks) {
    callbacks.forEach( callback => this.#defaultOnUnitSelectCallbacks.push(callback))
    return this;
  }

  /**
   * Register default callback(s) to be fired when the more changes
   * Default callbacks are hooked to every ComputeSelection created by the service
   * @param {...ComputeSelectionOnModeChangeCallback}
   * @returns {ComputeSelectionService} this
   */
  defaultOnModeChange(...callbacks) {
    callbacks.forEach( callback => this.#defaultOnModeChangeCallbacks.push(callback))
    return this
  }
}

/**
 * @type {ComputeSelectionMode}
 */
ComputeSelectionService.Mode = require('@renderer/services/compute-selection/ComputeSelectionMode')

module.exports = ComputeSelectionService