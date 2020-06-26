const Component      = require('@renderer/ui/component/Component')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").} ComputeUnitSelection */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionMode").} ComputeUnitSelectionMode */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel").} ComputeUnitSelectionModel */



/**
 * @memberof module:compute-selection
 */
class ComputeUnitSelectionView extends Component {

  /** @type {ComputeUnitSelectionModel} */
  #model
  /** @type {ComputeUnitSelectionMode} */
  #mode
  /** @type {JQuery} */
  #node

  /**
   * Creates a new ExecutionUnitSelectionView
   * @param {ComputeSelectionModel} model 
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