const Component = require('@renderer/ui/component/Component')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel")} ComputeSelectionModel */

class ComputeSelectionBlockView extends Component {

  /** @type {ComputeSelectionModel} */
  #model

  /**
   * 
   * @param {ComputeSelectionModel} model 
   */
  constructor(model) {
    this.#model = model
  }

  render() {
    
  }
}

module.exports = ComputeSelectionBlockView