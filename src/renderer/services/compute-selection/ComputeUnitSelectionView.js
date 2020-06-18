/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").} ComputeUnitSelection */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionMode").} ComputeUnitSelectionMode */


/**
 * @memberof module:compute-selection
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