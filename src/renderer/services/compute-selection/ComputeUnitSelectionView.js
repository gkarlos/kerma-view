/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeUnitSelection").} ComputeUnitSelection */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeUnitSelectionMode").} ComputeUnitSelectionMode */


/**
 * @memberof module:compute-unit-selection
 */
class ComputeUnitSelectionView {

  #model
  #mode
  #node

  /**
   * Creates a new ExecutionUnitSelectionView
   * @param {ExecutionUnitSelection} model 
   */
  constructor(model) {
    this.#model = model
  }

  /**
   * Change the mode of this 
   * @param {ComputeUnitSelectionMode} mode 
   */
  setMode(mode) {

  }
}

module.exports = ComputeUnitSelectionView