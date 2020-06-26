const Service           = require('@renderer/services').Service
const ComputeSelection  = require('@renderer/services/compute-selection').ComputeSelection

const App     = require('@renderer/app')

/**
 * This service handles compute unit selection.
 * ComputeUnitSelection objects are created and stored internally.
 * At any gived time a single selection can be activated.
 * 
 * @memberof module:compute-selection
 * @extends Service
 */
class ComputeSelectionService extends Service {
  constructor() {
    super('ComputeUnitSelectionService')
    this.selections = []
  }

  enable() {
    super.enable()
  }

  disable() {
    super.disable()
  }

  /**
   * Create a new ComputeUnitSelection for a given grid and block configuration.
   * The ComputeUnitSelection is storred internally.
   * @returns {ComputeUnitSelection}
   */
  createNew(grid, block) {
    let model // TODO Create the model
    let view  // TODO Create the view
    let newSelection = new ComputeSelection(model, view)
    this.selections.push(newSelection)
    return newSelection
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
   * @param {ComputeUnitSelection} computeUnitSelection
   * @returns {Boolean} True if the selection was successfully activated. False otherwise
   */
  activate(computeUnitSelection) {

  }



}

module.exports = ComputeSelectionService