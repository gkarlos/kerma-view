const ComputeSelectionMode     = require('@renderer/services/compute-selection/ComputeSelectionMode')
const ComputeSelectionWarpView = require('@renderer/services/compute-selection/ComputeSelectionWarpView')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").} ComputeUnitSelection */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionMode").} ComputeUnitSelectionMode */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel").} ComputeUnitSelectionModel */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionWarpView").} ComputeSelectionWarpView */

/**
 * @memberof module:compute-selection
 */
class ComputeSelectionView {

  /** @type {ComputeSelectionModel} */
  #model
  /** @type {ComputeSelectionMode} */
  #mode
  /** @type {ComputeSelectionWarpView} */
  #viewimpl

  /**
   * Creates a new ExecutionUnitSelectionView
   * @param {ComputeSelectionModel} model 
   */
  constructor(model) {
    this.#model = model
    this.#mode = ComputeSelectionMode.Default
    this.#viewimpl = new ComputeSelectionWarpView(model)
    console.log(this.#viewimpl)
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

  }

  render() {
    this.#viewimpl.render()
  }
}

module.exports = ComputeSelectionView