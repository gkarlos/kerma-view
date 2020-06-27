const ComputeSelectionMode     = require('@renderer/services/compute-selection/ComputeSelectionMode')
const ComputeSelectionWarpView = require('@renderer/services/compute-selection/ComputeSelectionWarpView')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").} ComputeUnitSelection */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionMode").} ComputeUnitSelectionMode */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel").} ComputeUnitSelectionModel */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionWarpView").} ComputeSelectionWarpView */
/** @ignore @typedef {import("@renderer/models/cuda/CudaLaunch")} CudaLaunch*/

/**
 * @memberof module:compute-selection
 */
class ComputeSelectionView {

  /** @type {ComputeUnitSelectionModel} model */
  #model
  /** @type {ComputeSelectionWarpView} */
  #viewimpl

  /**
   * Creates a new ComputeSelectionView
   * @param {ComputeUnitSelectionModel} model
   */
  constructor(model) {
    this.#model = model
    this.#viewimpl = new ComputeSelectionWarpView(model)
    console.log(this.#model.grid.toString())
    console.log(this.#model.block.toString())
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
    console.log()
    this.#viewimpl.render()
  }
}

module.exports = ComputeSelectionView