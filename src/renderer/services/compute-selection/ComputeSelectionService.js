const Service           = require('@renderer/services').Service
const ComputeSelection  = require('@renderer/services/compute-selection/ComputeSelection')
const App     = require('@renderer/app')

/** @ignore @typedef {import("@renderer/models/cuda/CudaLaunch")} CudaLaunch */
/** @ignore @typedef {import("@renderer/models/cuda/CudaGrid")} CudaGrid */
/** @ignore @typedef {import("@renderer/models/cuda/CudaBlock")} CudaBlock */
/** @ignore @typedef {import("@renderer/models/cuda/CudaThread")} CudaThread */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection")} ComputeSelection */
/** @ignore @typedef {import("@renderer/services/compute-selection/").ComputeSelectionOnBlockSelectCallback} ComputeSelectionOnBlockSelectCallback */
/** @ignore @typedef {import("@renderer/services/compute-selection/").ComputeSelectionOnUnitSelectCallback} ComputeSelectionOnUnitSelectCallback */

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
  /** @type {ComputeSelectionOnBlockSelectCallback[]} */
  #defaultOnBlockSelectCallbacks
  /** @type {ComputeSelectionOnUnitSelectCallback[]} */
  #defaultOnUnitSelectCallbacks

  constructor() {
    super('ComputeSelectionService')
    this.#selections = []
    this.#current = undefined
    this.#defaultOnBlockSelectCallbacks = []
    this.#defaultOnUnitSelectCallbacks = []
  }

  enable() {
    super.enable()
    return this
  }

  disable() {
    super.disable()
  }

  /**
   * Create a new ComputeSelection for a given grid and block configuration
   * The ComputeUnitSelection is storred internally.
   * @param {CudaGrid} grid
   * @param {CudaBlock} block
   * @param {Boolean} activate immediate activate this selection upon creation
   * @returns {ComputeSelection}
   */
  create(grid, block, activate=false) {

    let lookup = this.#selections.find(sel => sel.grid.equals(grid) && sel.block.equals(block))
    /** @type {ComputeSelection} */
    let selection

    if ( lookup) { // We found a cached selection that can be used for this launch...
      if ( this.#current.equals(lookup)) { // But its the current one so just create a new one
        selection = new ComputeSelection( grid, block)

        this.#defaultOnBlockSelectCallbacks.forEach(cb => selection.onBlockSelect(cb))
        this.#defaultOnUnitSelectCallbacks.forEach(cb => selection.onUnitSelect(cb))
        this.#selections.push(selection)    
      } else {
        lookup.clear()
        selection = lookup
      }
    } else { // We cant use any of the cached selections. Create a new one
      selection = new ComputeSelection(grid, block)

      this.#defaultOnBlockSelectCallbacks.forEach(cb => selection.onBlockSelect(cb))
      this.#defaultOnUnitSelectCallbacks.forEach(cb => selection.onUnitSelect(cb))
      this.#selections.push(selection)
    } 


    if ( activate)
      this.activate(selection)

    return selection
  }

  /**
   * Create a new ComputeSelection for a given kernel launch
   * @param {CudaLaunch} launch
   * @param {Boolean} activate immediately activate this selection upon creation
   * @returns {ComputeSelection}
   */
  createForLaunch(launch, activate=false) {
    return this.create(launch.grid, launch.block, activate)
  }

  /**
   * Discard a ComputeUnitSelection. 
   * A discarded selection can no longer be activated
   * @param {ComputeUnitSelection} computeUnitSelection
   * @returns {Boolean} False if the selection was not created through the service (and thus not removed). True otherwise
   */
  discard(computeUnitSelection) {
    
  }

  /**
   * Make a ComputeUnitSelection the current active one.
   * The selection will be activated only if it was created through the service
   * @param {ComputeSelection} selection
   * @returns {Boolean} True if the selection was successfully activated. False otherwise
   */
  activate(selection, enable) {
    this.#current && this.#current.deactivate()
    this.#current = selection
    selection.activate()
    if ( enable)
      selection.enable()
    return selection
  }

  getCurrent() {
    return this.#current
  }

  /**
   * Register a default callback to be fired when a block is selected
   * Default callbacks are hooked to every ComputeSelection created by the service
   * 
   * @param {...ComputeSelectionOnBlockSelectCallback}
   * @returns {void}
   */
  defaultOnBlockSelect(...callbacks) {

  }

  /**
   * Register a default callback to be fired when a unit (warp of thread) is selected
   * Default callbacks are hooked to every ComputeSelection created by the service
   * @param {...ComputeSelectionOnUnitSelectCallback}
   * @returns {void}
   */
  defaultOnUnitSelect(...callbacks) {
    callbacks.forEach( callback => this.#defaultOnUnitSelectCallbacks.push(callback))
  }
}

ComputeSelectionService.Mode = require('@renderer/services/compute-selection/ComputeSelectionMode')

module.exports = ComputeSelectionService